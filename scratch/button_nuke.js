const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

const nukeButtons = `
/* ============================================================
   ULTIMATE BUTTON VISIBILITY NUKE
   ============================================================ */

/* Catch EVERY button-like element on the site */
.btn-primary, 
.btn-secondary, 
.quick-add, 
.view-product, 
.view-coverage-btn, 
.coverage-tab,
.view-delivery-info,
.checkout-btn,
.add-to-cart-btn,
.shop-now-btn,
.shop-more-btn,
.submit-btn,
.whatsapp-btn,
.whatsapp-btn-small,
button, 
.button,
[role="button"] {
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
    font-weight: 700 !important;
    text-decoration: none !important;
}

/* 1. DARK BACKGROUND BUTTONS -> WHITE TEXT */
.btn-secondary,
.checkout-btn,
.whatsapp-btn,
.whatsapp-btn-small,
.submit-btn,
.zone-card.kumasi-zone, /* if it acts as a button */
.view-product,
.view-delivery-info {
    background: #5C3A2D !important; /* Deep Brown */
    color: #ffffff !important;      /* PURE WHITE */
    border: none !important;
}

/* 2. GOLD BACKGROUND BUTTONS -> DARK BROWN TEXT */
.btn-primary,
.quick-add,
.shop-now-btn,
.coverage-tab.active,
.view-coverage-btn {
    background: #D4AF37 !important; /* Gold */
    color: #5C3A2D !important;      /* Deep Brown */
    border: none !important;
}

/* 3. TRANSPARENT/LIGHT BUTTONS -> DARK BROWN TEXT */
.coverage-tab {
    background: #fdf6f0 !important;
    color: #5C3A2D !important;
    border: 1px solid #D4AF37 !important;
}

/* Specific fix for Delivery Page Zones */
.zone-card h3, .zone-card .price {
    color: #5C3A2D !important;
}

/* Specific fix for View Product / Details on Shop */
.view-product {
    display: inline-block !important;
    background: #5C3A2D !important;
    color: #ffffff !important;
    padding: 10px 20px !important;
    border-radius: 5px !important;
    font-size: 0.9rem !important;
}

/* Ensure icons inside buttons are also the right color */
button i, .btn-primary i, .btn-secondary i, a i {
    color: inherit !important;
}

/* Global button shadow to make them pop */
button, .btn-primary, .btn-secondary, .quick-add, .view-product {
    box-shadow: 0 4px 10px rgba(0,0,0,0.1) !important;
}
`;

css += nukeButtons;
fs.writeFileSync('style.css', css);
console.log('Applied Ultimate Button Visibility Nuke');
