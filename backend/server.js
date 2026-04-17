// server.js - Backend for Amen+ Orders
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from current directory

// ========== DATABASE SETUP ==========
const db = new sqlite3.Database('./database.sqlite');

// Create orders table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT UNIQUE,
        customer_name TEXT,
        customer_phone TEXT,
        customer_email TEXT,
        items TEXT,
        subtotal REAL,
        delivery_fee REAL,
        total REAL,
        delivery_zone TEXT,
        delivery_area TEXT,
        payment_ref TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Create products table for inventory
db.run(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        product_id INTEGER,
        product_name TEXT,
        stock_quantity INTEGER DEFAULT 0,
        reserved_quantity INTEGER DEFAULT 0
    )
`);

console.log('✅ Database initialized');

// ========== API ENDPOINTS ==========

// 1. Save order after payment
app.post('/api/order', (req, res) => {
    const {
        order_id,
        customer_name,
        customer_phone,
        customer_email,
        items,
        subtotal,
        delivery_fee,
        total,
        delivery_zone,
        delivery_area,
        payment_ref
    } = req.body;

    // Validate required fields
    if (!order_id || !customer_name || !customer_phone) {
        return res.status(400).json({ 
            success: false, 
            message: 'Missing required fields' 
        });
    }

    const itemsJson = JSON.stringify(items);

    db.run(
        `INSERT INTO orders (
            order_id, customer_name, customer_phone, customer_email,
            items, subtotal, delivery_fee, total, delivery_zone, delivery_area, payment_ref
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [order_id, customer_name, customer_phone, customer_email, itemsJson, 
         subtotal, delivery_fee, total, delivery_zone, delivery_area, payment_ref],
        function(err) {
            if (err) {
                console.error('Error saving order:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: err.message 
                });
            }
            
            console.log(`✅ Order saved: ${order_id}`);
            
            // Send SMS notification (you'll set this up later)
            // sendSMS('0530379533', `New order from ${customer_name}: ₵${total}`);
            
            res.json({ 
                success: true, 
                message: 'Order saved successfully',
                order_id: order_id
            });
        }
    );
});

// 2. Get all orders (for admin panel)
app.get('/api/orders', (req, res) => {
    db.all('SELECT * FROM orders ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, orders: rows });
    });
});

// 3. Get single order by ID
app.get('/api/order/:order_id', (req, res) => {
    const { order_id } = req.params;
    db.get('SELECT * FROM orders WHERE order_id = ?', [order_id], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, order: row });
    });
});

// 4. Update order status
app.put('/api/order/:order_id/status', (req, res) => {
    const { order_id } = req.params;
    const { status } = req.body;
    
    db.run('UPDATE orders SET status = ? WHERE order_id = ?', [status, order_id], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, message: 'Status updated' });
    });
});

// 5. Update product stock (for inventory management)
app.put('/api/product/:product_id/stock', (req, res) => {
    const { product_id } = req.params;
    const { stock_quantity } = req.body;
    
    db.run(
        `INSERT INTO products (product_id, stock_quantity) 
         VALUES (?, ?) 
         ON CONFLICT(product_id) DO UPDATE SET stock_quantity = excluded.stock_quantity`,
        [product_id, stock_quantity],
        function(err) {
            if (err) {
                return res.status(500).json({ success: false, message: err.message });
            }
            res.json({ success: true, message: 'Stock updated' });
        }
    );
});

// 6. Get product stock
app.get('/api/product/:product_id/stock', (req, res) => {
    const { product_id } = req.params;
    db.get('SELECT * FROM products WHERE product_id = ?', [product_id], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, stock: row || { stock_quantity: 0 } });
    });
});

// ========== START SERVER ==========
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📦 Admin panel: http://localhost:${PORT}/admin.html`);
});