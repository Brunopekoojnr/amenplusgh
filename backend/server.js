// AMEN+ BACKEND - PURE NODE.JS (NO MONGODB)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allowed origins for CORS (comma-separated in env, or wildcard for dev)
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['*'];

// Middleware
app.use(cors({
    origin: allowedOrigins.includes('*') ? '*' : (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) cb(null, true);
        else cb(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ── HTTPS redirect (Render.com terminates TLS and sets x-forwarded-proto) ──
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
});

// ── Security headers ──────────────────────────────────────────────────────
app.use((req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

app.use(express.static(path.join(__dirname, '../')));


// JSON File Paths
const DB_DIR = __dirname;
const PRODUCTS_FILE = path.join(DB_DIR, 'products.json');
const ORDERS_FILE = path.join(DB_DIR, 'orders.json');
const CUSTOMERS_FILE = path.join(DB_DIR, 'customers.json');

// Helper to read JSON
function readJSON(filePath) {
    if (!fs.existsSync(filePath)) return [];
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading ${filePath}:`, err.message);
        return [];
    }
}

// Helper to write JSON
function writeJSON(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error(`Error writing to ${filePath}:`, err.message);
    }
}

// Admin Auth Middleware
const adminAuth = (req, res, next) => {
    if (req.headers['x-admin-key'] !== process.env.ADMIN_KEY) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    next();
};

// SMS Helper
async function sendSMS(phone, message) {
    try {
        let formattedPhone = phone;
        if (phone.startsWith('0')) formattedPhone = '+233' + phone.slice(1);
        else if (!phone.startsWith('+')) formattedPhone = '+233' + phone;

        await axios.get('https://sms.arkesel.com/sms/api', {
            params: {
                action: 'send-sms',
                api_key: process.env.ARKESEL_API_KEY,
                to: formattedPhone,
                from: process.env.ARKESEL_SENDER_ID || 'Arkesel',
                sms: message
            }
        });
        console.log(`✅ SMS sent to ${phone}`);
        return { success: true };
    } catch (err) {
        console.error('❌ SMS failed:', err.message);
        return { success: false, error: err.message };
    }
}

// ROUTES
app.get('/', (req, res) => {
    res.json({ message: '🚀 Amen+ API is running (Node.js JSON mode)!', status: 'live', timestamp: new Date() });
});

// PRODUCTS
app.get('/api/products', (req, res) => {
    try {
        let products = readJSON(PRODUCTS_FILE);
        // Default isAvailable to true if not present, and filter only available products
        products = products.filter(p => p.isAvailable !== false);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/products/:id', (req, res) => {
    try {
        const products = readJSON(PRODUCTS_FILE);
        const product = products.find(p => p.id == req.params.id);
        if (!product) return res.status(404).json({ error: 'Not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/products', adminAuth, (req, res) => {
    try {
        const products = readJSON(PRODUCTS_FILE);
        const newProduct = {
            id: Date.now(), // Generate a simple unique ID
            ...req.body,
            createdAt: new Date().toISOString()
        };
        products.push(newProduct);
        writeJSON(PRODUCTS_FILE, products);
        res.json({ success: true, product: newProduct });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ORDERS
app.post('/api/orders', (req, res) => {
    try {
        // Input validation
        const { reference, customerName, customerPhone, customerEmail, totalAmount, items } = req.body;
        if (!reference || typeof reference !== 'string' || reference.length > 100) {
            return res.status(400).json({ success: false, error: 'Invalid or missing reference' });
        }
        if (!customerName || typeof customerName !== 'string' || customerName.length > 100) {
            return res.status(400).json({ success: false, error: 'Invalid or missing customerName' });
        }
        if (!customerPhone || typeof customerPhone !== 'string' || customerPhone.length > 20) {
            return res.status(400).json({ success: false, error: 'Invalid or missing customerPhone' });
        }
        if (!customerEmail || typeof customerEmail !== 'string' || !customerEmail.includes('@') || customerEmail.length > 254) {
            return res.status(400).json({ success: false, error: 'Invalid or missing customerEmail' });
        }
        if (typeof totalAmount !== 'number' || totalAmount < 0 || totalAmount > 100000) {
            return res.status(400).json({ success: false, error: 'Invalid totalAmount' });
        }
        if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
            return res.status(400).json({ success: false, error: 'Invalid or empty items array' });
        }

        const orders = readJSON(ORDERS_FILE);
        
        // Check if order already exists (Paystack reference)
        const existing = orders.find(o => o.reference === req.body.reference);
        if (existing) return res.json({ success: true, order: existing, message: 'Exists' });

        const isPreOrder = req.body.items?.some(i => i.isPreOrder) || false;
        
        const newOrder = {
            _id: Date.now().toString(),
            ...req.body,
            isPreOrder,
            status: 'pending',
            paymentStatus: 'pending',
            smsReceiptSent: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        orders.push(newOrder);
        writeJSON(ORDERS_FILE, orders);

        // Update customer
        if (req.body.customerPhone) {
            const customers = readJSON(CUSTOMERS_FILE);
            let customer = customers.find(c => c.phone === req.body.customerPhone);
            
            if (customer) {
                customer.name = req.body.customerName;
                customer.email = req.body.customerEmail;
                customer.totalOrders = (customer.totalOrders || 0) + 1;
                customer.totalSpent = (customer.totalSpent || 0) + req.body.totalAmount;
            } else {
                customer = {
                    id: Date.now().toString(),
                    name: req.body.customerName,
                    phone: req.body.customerPhone,
                    email: req.body.customerEmail,
                    totalOrders: 1,
                    totalSpent: req.body.totalAmount,
                    createdAt: new Date().toISOString()
                };
                customers.push(customer);
            }
            writeJSON(CUSTOMERS_FILE, customers);
        }
        res.json({ success: true, order: newOrder });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/verify-payment', async (req, res) => {
    try {
        const { reference } = req.body;
        if (!reference) return res.status(400).json({ success: false, error: 'Reference required' });

        const paystackRes = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
        );

        if (paystackRes.data.data.status === 'success') {
            const orders = readJSON(ORDERS_FILE);
            const orderIndex = orders.findIndex(o => o.reference === reference);
            
            if (orderIndex > -1) {
                const order = orders[orderIndex];
                order.status = 'paid';
                order.paymentStatus = 'paid';
                order.updatedAt = new Date().toISOString();
                
                if (!order.smsReceiptSent) {
                    const customerSMS = `AMEN+ RECEIPT\nOrder: ${reference}\nName: ${order.customerName}\nAmount: GHS ${order.totalAmount}\nStatus: PAID\n\n${order.isPreOrder ? 'Pre-order confirmed!' : 'Our team will contact you for delivery.'}\nThank you!`;
                    await sendSMS(order.customerPhone, customerSMS);

                    const adminSMS = `NEW ${order.isPreOrder ? 'PRE-ORDER' : 'ORDER'}!\nRef: ${reference}\nCustomer: ${order.customerName}\nPhone: ${order.customerPhone}\nTotal: GHS ${order.totalAmount}\nZone: ${order.deliveryZone}`;
                    await sendSMS(process.env.MOMO_NUMBER || '0530379533', adminSMS);

                    order.smsReceiptSent = true;
                }
                
                writeJSON(ORDERS_FILE, orders);
                res.json({ success: true, message: 'Verified & SMS sent', order });
            } else {
                res.status(404).json({ success: false, error: 'Order not found in local database' });
            }
        } else {
            res.status(400).json({ success: false, error: 'Payment not successful on Paystack' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/orders', adminAuth, (req, res) => {
    try {
        let orders = readJSON(ORDERS_FILE);
        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.patch('/api/orders/:id/status', adminAuth, async (req, res) => {
    try {
        const orders = readJSON(ORDERS_FILE);
        const order = orders.find(o => o._id === req.params.id);
        
        if (!order) return res.status(404).json({ error: 'Not found' });

        order.status = req.body.status;
        order.updatedAt = new Date().toISOString();
        writeJSON(ORDERS_FILE, orders);

        if (req.body.status === 'dispatched') {
            await sendSMS(order.customerPhone, `Hi ${order.customerName}! 📦 Your Amen+ order ${order.reference} is on its way!`);
        } else if (req.body.status === 'delivered') {
            await sendSMS(order.customerPhone, `Hi ${order.customerName}! ✅ Order delivered. Thank you for shopping with Amen+!`);
        }
        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/customers', adminAuth, (req, res) => {
    try {
        let customers = readJSON(CUSTOMERS_FILE);
        customers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json({ success: true, customers });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Manually add a client
app.post('/api/customers', adminAuth, (req, res) => {
    try {
        const customers = readJSON(CUSTOMERS_FILE);
        const { name, phone, email, notes } = req.body;
        if (!name || !phone) return res.status(400).json({ success: false, error: 'Name and phone are required' });

        const existing = customers.find(c => c.phone === phone);
        if (existing) return res.status(409).json({ success: false, error: 'Client with this phone already exists' });

        const newCustomer = {
            id: Date.now().toString(),
            name, phone,
            email: email || '',
            notes: notes || '',
            totalOrders: 0,
            totalSpent: 0,
            addedManually: true,
            createdAt: new Date().toISOString()
        };
        customers.push(newCustomer);
        writeJSON(CUSTOMERS_FILE, customers);
        res.json({ success: true, customer: newCustomer });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Edit a client
app.patch('/api/customers/:id', adminAuth, (req, res) => {
    try {
        const customers = readJSON(CUSTOMERS_FILE);
        const index = customers.findIndex(c => c.id === req.params.id);
        if (index === -1) return res.status(404).json({ success: false, error: 'Client not found' });

        const { name, phone, email, notes } = req.body;
        if (name) customers[index].name = name;
        if (phone) customers[index].phone = phone;
        if (email !== undefined) customers[index].email = email;
        if (notes !== undefined) customers[index].notes = notes;
        customers[index].updatedAt = new Date().toISOString();

        writeJSON(CUSTOMERS_FILE, customers);
        res.json({ success: true, customer: customers[index] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Delete a client
app.delete('/api/customers/:id', adminAuth, (req, res) => {
    try {
        let customers = readJSON(CUSTOMERS_FILE);
        const index = customers.findIndex(c => c.id === req.params.id);
        if (index === -1) return res.status(404).json({ success: false, error: 'Client not found' });

        customers.splice(index, 1);
        writeJSON(CUSTOMERS_FILE, customers);
        res.json({ success: true, message: 'Client deleted' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/dashboard/stats', adminAuth, (req, res) => {
    try {
        const orders = readJSON(ORDERS_FILE);
        const customers = readJSON(CUSTOMERS_FILE);
        
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const paidOrders = orders.filter(o => o.status === 'paid').length;
        const dispatchedOrders = orders.filter(o => o.status === 'dispatched').length;
        const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
        const preOrders = orders.filter(o => o.isPreOrder === true).length;
        const totalCustomers = customers.length;

        const totalRevenue = orders
            .filter(o => ['paid', 'dispatched', 'delivered'].includes(o.status))
            .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        res.json({
            success: true,
            stats: {
                totalOrders, pendingOrders, paidOrders,
                dispatchedOrders, deliveredOrders, preOrders,
                totalCustomers, totalRevenue
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// CRON
cron.schedule('0 8 * * *', async () => {
    try {
        const orders = readJSON(ORDERS_FILE);
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        const pending = orders.filter(o => 
            o.status === 'pending' && 
            new Date(o.createdAt) < yesterday
        );
        
        for (const order of pending) {
            await sendSMS(order.customerPhone, `Hi ${order.customerName}, your order ${order.reference} is still pending.`);
        }
    } catch (err) {
        console.error('Cron error:', err.message);
    }
});

// Catch-all: only serve frontend routes, not API paths
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ success: false, error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 AMEN+ SERVER RUNNING on port ${PORT} (Node.js JSON mode)`);
});