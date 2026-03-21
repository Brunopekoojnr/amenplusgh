const express = require('express');
const cors = require('cors');
require('body-parser');
const bodyParser = require('body-parser');
require('dotenv').config();
const Paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MOMONUMBER = '0530379533'; // User's MoMo

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('../')); // Serve frontend

// Pending deliveries file
const DELIVERIES_FILE = path.join(__dirname, 'deliveries.json');

// Load deliveries
let pendingDeliveries = [];
try {
  pendingDeliveries = JSON.parse(fs.readFileSync(DELIVERIES_FILE, 'utf8')) || [];
} catch (e) {
  fs.writeFileSync(DELIVERIES_FILE, '[]');
}

// Phase 1: Paystack verify & store delivery
app.post('/api/verify-payment', async (req, res) => {
  const { reference } = req.body;
  try {
    const response = await Paystack.transaction.verify(reference);
    if (response.data.status === 'success') {
      const orderData = response.data.metadata; // cart, customer, delivery info from frontend
      pendingDeliveries.push({
        id: Date.now().toString(),
        reference,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        items: orderData.items,
        total: response.data.amount / 100,
        deliveryZone: orderData.deliveryZone,
        status: 'pending',
        createdAt: new Date().toISOString(),
        phase1: true // Flag for Phase 1
      });
      fs.writeFileSync(DELIVERIES_FILE, JSON.stringify(pendingDeliveries, null, 2));
      res.json({ success: true, message: 'Order confirmed. Delivery details saved for dispatch.' });
    } else {
      res.status(400).json({ error: 'Payment not successful' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Verification failed', details: error.message });
  }
});

// Phase 2: Get pending deliveries for MoMo split (manual dispatch)
app.get('/api/pending-deliveries', (req, res) => {
  const phase1Deliveries = pendingDeliveries.filter(d => d.phase1 && d.status === 'pending');
  res.json(phase1Deliveries);
});

// Update delivery status after MoMo (manual)
app.post('/api/update-delivery', (req, res) => {
  const { id, momoTxId, status } = req.body;
  const delivery = pendingDeliveries.find(d => d.id === id);
  if (delivery) {
    delivery.momoTxId = momoTxId;
    delivery.status = status || 'dispatched';
    delivery.phase2Complete = true;
    fs.writeFileSync(DELIVERIES_FILE, JSON.stringify(pendingDeliveries, null, 2));
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Delivery not found' });
  }
});

// Auto SMS reminder (cron every day 8AM)
cron.schedule('0 8 * * *', () => {
  // TODO: integrate SMS API (e.g. MSG91 or local gateway)
  console.log('Daily SMS reminder sent to pending deliveries');
});

// Frontend proxy for Paystack initialize (optional)
app.post('/api/initialize-payment', (req, res) => {
  const { email, amount, cart, customerName, customerPhone, deliveryZone } = req.body;
  const paystackPayload = {
    email,
    amount: amount * 100,
    metadata: { cart: JSON.stringify(cart), customerName, customerPhone, deliveryZone }
  };
  Paystack.transaction.initialize(paystackPayload)
    .then(response => res.json(response))
    .catch(error => res.status(500).json({ error: error.message }));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MoMo for deliveries: ${MOMONUMBER}`);
});

