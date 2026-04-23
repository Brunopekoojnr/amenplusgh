const fs = require('fs');

// 1. Ensure all HTML files have the correct viewport (width=1200, user-scalable=yes)
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
htmlFiles.forEach(f => {
    let html = fs.readFileSync(f, 'utf8');
    html = html.replace(/<meta name="viewport" content="[^"]*">/g, '<meta name="viewport" content="width=1200, user-scalable=yes">');
    fs.writeFileSync(f, html);
});

// 2. Append the cart scroll fix to style.css
const cartFix = `
/* ============================================================
   EMERGENCY RESTORE: CART SCROLLING & VISIBILITY
   ============================================================ */
.cart-sidebar {
    position: fixed !important;
    top: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    height: 100vh !important;
    height: -webkit-fill-available !important;
    width: 450px !important;
    max-width: 90vw !important;
    background: #fff !important;
    display: flex !important;
    flex-direction: column !important;
    z-index: 100000 !important;
    box-shadow: -10px 0 50px rgba(0,0,0,0.3) !important;
    overflow: hidden !important; /* The container doesn't scroll, the children do */
}

.cart-items {
    flex: 1 !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
    padding: 20px !important;
    min-height: 0 !important; /* CRITICAL: allows flex child to shrink and scroll */
}

.cart-footer {
    flex-shrink: 0 !important;
    background: #fff !important;
    padding: 20px !important;
    border-top: 2px solid #f5f5f5 !important;
    box-shadow: 0 -10px 20px rgba(0,0,0,0.05) !important;
    z-index: 100 !important;
}

/* Ensure buttons are ALWAYS clickable */
.checkout-btn {
    display: block !important;
    width: 100% !important;
    background: #5C3A2D !important;
    color: #fff !important;
    padding: 18px !important;
    border-radius: 8px !important;
    text-align: center !important;
    font-weight: 700 !important;
    margin-bottom: 12px !important;
    text-decoration: none !important;
    cursor: pointer !important;
}

.continue-shopping {
    display: block !important;
    text-align: center !important;
    color: #5C3A2D !important;
    text-decoration: underline !important;
    font-weight: 500 !important;
}

/* Fix Branding Color Overrides */
.plus, .plus-small { color: #D4AF37 !important; }
.logo .slogan { color: #D4AF37 !important; display: block !important; font-size: 0.85rem !important; }
.btn-primary { color: white !important; }
`;

fs.appendFileSync('style.css', cartFix);
console.log('Restored styling and applied cart scroll fix.');
