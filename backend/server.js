// AMEN+ BACKEND - PRODUCTION READY (NO SQLITE)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const cron = require('node-cron');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err.message));

// SCHEMAS
const orderSchema = new mongoose.Schema({
    reference: { type: String, unique: true, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: String,
    items: [{
        id: String, name: String, size: String,
        quantity: Number, price: Number, image: String,
        isPreOrder: { type: Boolean, default: false }
    }],
    totalAmount: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    deliveryZone: String,
    deliveryArea: String,
    status: { type: String, enum: ['pending', 'paid', 'dispatched', 'delivered', 'cancelled'], default: 'pending' },
    isPreOrder: { type: Boolean, default: false },
    paymentStatus: { type: String, default: 'pending' },
    smsReceiptSent: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    sizes: [String],
    image: String,
    description: String,
    stock: { type: Number, default: 100 },
    isPreOrder: { type: Boolean, default: false },
    expectedDeliveryDate: Date,
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', productSchema);

const customerSchema = new mongoose.Schema({
    name: String,
    phone: { type: String, unique: true },
    email: String,
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});
const Customer = mongoose.model('Customer', customerSchema);

// Admin Auth
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
    res.json({ message: '🚀 Amen+ API is running!', status: 'live', timestamp: new Date() });
});

// PRODUCTS
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({ isAvailable: true }).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/products', adminAuth, async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ORDERS
app.post('/api/orders', async (req, res) => {
    try {
        const existing = await Order.findOne({ reference: req.body.reference });
        if (existing) return res.json({ success: true, order: existing, message: 'Exists' });

        const isPreOrder = req.body.items?.some(i => i.isPreOrder) || false;
        const order = await Order.create({ ...req.body, isPreOrder });

        if (req.body.customerPhone) {
            await Customer.findOneAndUpdate(
                { phone: req.body.customerPhone },
                {
                    name: req.body.customerName,
                    phone: req.body.customerPhone,
                    email: req.body.customerEmail,
                    $inc: { totalOrders: 1, totalSpent: req.body.totalAmount }
                },
                { upsert: true, new: true }
            );
        }
        res.json({ success: true, order });
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
            const order = await Order.findOneAndUpdate(
                { reference },
                { status: 'paid', paymentStatus: 'paid', updatedAt: new Date() },
                { new: true }
            );

            if (order && !order.smsReceiptSent) {
                const customerSMS = `AMEN+ RECEIPT\nOrder: ${reference}\nName: ${order.customerName}\nAmount: GHS ${order.totalAmount}\nStatus: PAID\n\n${order.isPreOrder ? 'Pre-order confirmed!' : 'Our team will contact you for delivery.'}\nThank you!`;
                await sendSMS(order.customerPhone, customerSMS);

                const adminSMS = `NEW ${order.isPreOrder ? 'PRE-ORDER' : 'ORDER'}!\nRef: ${reference}\nCustomer: ${order.customerName}\nPhone: ${order.customerPhone}\nTotal: GHS ${order.totalAmount}\nZone: ${order.deliveryZone}`;
                await sendSMS(process.env.MOMO_NUMBER || '0530379533', adminSMS);

                await Order.findByIdAndUpdate(order._id, { smsReceiptSent: true });
            }
            res.json({ success: true, message: 'Verified & SMS sent', order });
        } else {
            res.status(400).json({ success: false, error: 'Payment not successful' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/orders', adminAuth, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.patch('/api/orders/:id/status', adminAuth, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status, updatedAt: new Date() },
            { new: true }
        );
        if (!order) return res.status(404).json({ error: 'Not found' });

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

app.get('/api/customers', adminAuth, async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        res.json({ success: true, customers });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/dashboard/stats', adminAuth, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const paidOrders = await Order.countDocuments({ status: 'paid' });
        const dispatchedOrders = await Order.countDocuments({ status: 'dispatched' });
        const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
        const preOrders = await Order.countDocuments({ isPreOrder: true });
        const totalCustomers = await Customer.countDocuments();

        const revenue = await Order.aggregate([
            { $match: { status: { $in: ['paid', 'dispatched', 'delivered'] } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        res.json({
            success: true,
            stats: {
                totalOrders, pendingOrders, paidOrders,
                dispatchedOrders, deliveredOrders, preOrders,
                totalCustomers, totalRevenue: revenue[0]?.total || 0
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// CRON
cron.schedule('0 8 * * *', async () => {
    try {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const pending = await Order.find({ status: 'pending', createdAt: { $lt: yesterday } });
        for (const order of pending) {
            await sendSMS(order.customerPhone, `Hi ${order.customerName}, your order ${order.reference} is still pending.`);
        }
    } catch (err) {
        console.error('Cron error:', err.message);
    }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

app.listen(PORT, () => {
    console.log(`🚀 AMEN+ SERVER RUNNING on port ${PORT}`);
});