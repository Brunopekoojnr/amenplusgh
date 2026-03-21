const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');
const Paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
const cron = require('node-cron');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../')));

// ========== MONGODB CONNECTION ==========
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// ========== ORDER SCHEMA ==========
const orderSchema = new mongoose.Schema({
  reference: { type: String, unique: true },
  customerName: String,
  customerPhone: String,
  customerEmail: String,
  items: Array,
  total: Number,
  deliveryZone: String,
  status: { type: String, default: 'pending' },
  momoTxId: String,
  smsSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// ========== ADMIN AUTH MIDDLEWARE ==========
const adminAuth = (req, res, next) => {
  if (req.headers['x-admin-key'] !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// ========== SMS HELPER (Arkesel) ==========
const sendSMS = async (phone, message) => {
  try {
    await axios.get('https://sms.arkesel.com/sms/api', {
      params: {
        action: 'send-sms',
        api_key: process.env.ARKESEL_API_KEY,
        to: phone,
        from: 'AmenPlus',
        sms: message
      }
    });
    console.log(`SMS sent to ${phone}`);
  } catch (err) {
    console.error('SMS failed:', err.message);
  }
};

// ========== ROUTES ==========

// Initialize payment
app.post('/api/initialize-payment', async (req, res) => {
  const { email, amount, cart, customerName, customerPhone, deliveryZone } = req.body;
  try {
    const response = await Paystack.transaction.initialize({
      email,
      amount: amount * 100,
      metadata: { customerName, customerPhone, deliveryZone, cart: JSON.stringify(cart) }
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify payment & save order
app.post('/api/verify-payment', async (req, res) => {
  const { reference } = req.body;
  try {
    const response = await Paystack.transaction.verify(reference);
    if (response.data.status === 'success') {
      const meta = response.data.metadata;

      // Prevent duplicate orders
      const existing = await Order.findOne({ reference });
      if (existing) {
        return res.json({ success: true, message: 'Order already exists' });
      }

      const order = await Order.create({
        reference,
        customerName: meta.customerName,
        customerPhone: meta.customerPhone,
        customerEmail: response.data.customer.email,
        items: JSON.parse(meta.cart || '[]'),
        total: response.data.amount / 100,
        deliveryZone: meta.deliveryZone,
      });

      // Send confirmation SMS
      await sendSMS(
        meta.customerPhone,
        `Hi ${meta.customerName}! Your Amen+ order of GHS ${order.total} has been confirmed. We'll contact you for delivery. Thank you!`
      );

      res.json({ success: true, message: 'Order confirmed!' });
    } else {
      res.status(400).json({ error: 'Payment not successful' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Verification failed', details: error.message });
  }
});

// Get all pending orders (admin only)
app.get('/api/pending-deliveries', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders (admin only)
app.get('/api/orders', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update delivery status (admin only)
app.post('/api/update-delivery', adminAuth, async (req, res) => {
  const { id, momoTxId, status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { momoTxId, status: status || 'dispatched' },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // SMS customer on dispatch
    if (status === 'dispatched') {
      await sendSMS(
        order.customerPhone,
        `Hi ${order.customerName}! Your Amen+ order is on its way! MoMo Tx: ${momoTxId}. Thank you for shopping with us!`
      );
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== DAILY SMS REMINDER (8AM) ==========
cron.schedule('0 8 * * *', async () => {
  try {
    const pendingOrders = await Order.find({ status: 'pending', smsSent: false });
    for (const order of pendingOrders) {
      await sendSMS(
        order.customerPhone,
        `Hi ${order.customerName}, your Amen+ order is being processed. We'll update you soon!`
      );
      await Order.findByIdAndUpdate(order._id, { smsSent: true });
    }
    console.log(`Reminder SMS sent to ${pendingOrders.length} customers`);
  } catch (err) {
    console.error('Cron error:', err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});