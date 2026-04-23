const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// Remove the "EMERGENCY RESTORE: CART SCROLLING" block to update it
css = css.replace(/\/\* =+[\s\S]*?EMERGENCY RESTORE: CART SCROLLING[\s\S]*$/g, '');

const finalCartFix = `
/* ============================================================
   FINAL CART FIX: NO PINNING, FULL SCROLLING, RELIABLE CLOSING
   ============================================================ */
.cart-sidebar {
    position: fixed !important;
    top: 0 !important;
    right: 0 !important;
    width: 450px !important;
    max-width: 90vw !important;
    height: 100vh !important;
    height: -webkit-fill-available !important;
    background: #fff !important;
    z-index: 100000 !important;
    box-shadow: -10px 0 50px rgba(0,0,0,0.3) !important;
    
    /* Animation & Hiding */
    transform: translateX(100%) !important;
    visibility: hidden !important;
    transition: transform 0.3s ease-in-out, visibility 0.3s !important;
    
    /* Scrolling Style: One long scrollable block (NO PINNING) */
    display: block !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    -webkit-overflow-scrolling: touch !important;
}

.cart-sidebar.active {
    transform: translateX(0) !important;
    visibility: visible !important;
}

.cart-header {
    padding: 20px !important;
    border-bottom: 1px solid #eee !important;
    background: #fff !important;
}

.cart-items {
    padding: 20px !important;
    min-height: 100px !important;
}

.cart-footer {
    padding: 25px 20px !important;
    background: #fdf6f0 !important;
    border-top: 1px solid #eee !important;
    /* Removed sticky/fixed/flex constraints to prevent pinning */
}

.checkout-btn {
    display: block !important;
    width: 100% !important;
    background: #5C3A2D !important;
    color: #fff !important;
    padding: 20px !important;
    border-radius: 8px !important;
    text-align: center !important;
    font-weight: 700 !important;
    margin-bottom: 15px !important;
    text-decoration: none !important;
    font-size: 1.1rem !important;
}

.continue-shopping {
    display: block !important;
    text-align: center !important;
    color: #5C3A2D !important;
    text-decoration: underline !important;
    font-weight: 600 !important;
}

.cart-overlay.active {
    opacity: 1 !important;
    visibility: visible !important;
}
`;

css += finalCartFix;
fs.writeFileSync('style.css', css);
console.log('Applied Final No-Pinning Cart Fix');
