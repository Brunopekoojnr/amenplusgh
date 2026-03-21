// Enhanced Paystack with SMS Receipt Integration
// Note: Paystack SMS receipts require business account + verified phone

// SMS Gateway Integration (use any Ghana SMS API)
const SMS_GATEWAY_CONFIG = {
    apiKey: 'YOUR_SMS_API_KEY', // e.g. Twilio, Africa's Talking
    senderId: 'AMENPLUS',
    salesNumber: '0550987093', // Melanie
    deliveryNumber: '0530379533'
};

// Override Paystack callback for SMS
function paystackWithSMS(amount, metadata, customerPhone) {
    const handler = PaystackPop.setup({
        key: 'pk_test_802197895cbf5302a65ee707342b8e1930f2961a',
        email: metadata.customerEmail,
        amount: Math.round(amount * 100),
        currency: 'GHS',
        ref: 'AMEN-' + Math.floor(Math.random() * 1000000000),
        metadata: metadata,
        callback: function(response) {
            // 1. Send customer SMS receipt
            sendSMSReceipt(customerPhone, response, metadata);
            
            // 2. Send sales SMS
            sendSalesSMS(response, metadata);
            
            // 3. Show success + SMS confirmation
            showPaymentSuccess(response, metadata);
            
            // 4. Clear cart
            cart = [];
            saveCart();
        }
    });
    handler.openIframe();
}

// SMS Functions (implement with your SMS provider)
function sendSMSReceipt(phone, response, metadata) {
    const message = `AMEN+ Receipt\nRef: ${response.reference}\nAmount: ₵${metadata.total}\nOrder confirmed!\nSMS 0530379533 to process.`;
    
    // Replace with your SMS API call
    fetch('YOUR_SMS_ENDPOINT', {
        method: 'POST',
        body: JSON.stringify({
            to: phone,
            message: message
        })
    });
}

function sendSalesSMS(response, metadata) {
    const message = `NEW ORDER\nRef: ${response.reference}\nCustomer: ${metadata.customerName}\nPhone: ${metadata.customerPhone}\nItems: ${metadata.itemsCount}\nTotal: ₵${metadata.total}`;
    
    fetch('YOUR_SMS_ENDPOINT', {
        method: 'POST',
        body: JSON.stringify({
            to: SMS_CONFIG.salesNumber,
            message: message
        })
    });
}

// Update checkout function
function checkoutWithSMS() {
    // ... existing validation ...
    
    const metadata = { /* existing */ };
    metadata.customerPhone = customerPhone;
    
    paystackWithSMS(totalAmount, metadata, customerPhone);
}

// Export updated functions
window.checkoutWithSMS = checkoutWithSMS;

