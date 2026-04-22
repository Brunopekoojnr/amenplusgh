const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// 1. Remove all previous attempts at fixing the cart sidebar to avoid conflicts
// We look for common patterns I used
const patternsToRemove = [
    /\/\* ===== CRITICAL CART FIXES ===== \*\/[\s\S]*?\/\* ===== FIX ALL BLUE COLORS ===== \*\//g,
    /\/\* Cart Footer Pinning & Scrolling \*\/[\s\S]*?\/\* GLOBAL CART SCROLLING FIX \(Bypasses media queries\) \*\//g,
    /\/\* GLOBAL CART SCROLLING FIX \(Bypasses media queries\) \*\/[\s\S]*$/g
];

patternsToRemove.forEach(p => {
    css = css.replace(p, '');
});

// 2. Add the ULTIMATE cart fix
const ultimateFix = `
/* ============================================================
   ULTIMATE CART SCROLLING & PINNING FIX (MOBILE & DESKTOP)
   ============================================================ */
.cart-sidebar {
    position: fixed !important;
    top: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    height: 100% !important;
    width: 450px !important; /* Perfect "squeezed" width for 1200px viewport */
    background: #fff !important;
    display: flex !important;
    flex-direction: column !important;
    z-index: 100000 !important;
    box-shadow: -5px 0 30px rgba(0,0,0,0.2) !important;
    transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
    transform: translateX(100%);
    visibility: hidden;
}

.cart-sidebar.active {
    transform: translateX(0) !important;
    visibility: visible !important;
}

.cart-header {
    flex-shrink: 0 !important;
    padding: 20px !important;
    border-bottom: 1px solid #eee !important;
    background: #fff !important;
}

.cart-items {
    flex: 1 !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    -webkit-overflow-scrolling: touch !important;
    padding: 20px !important;
    min-height: 0 !important; /* CRITICAL for flex scrolling */
}

.cart-footer {
    flex-shrink: 0 !important;
    padding: 20px !important;
    background: #fff !important;
    border-top: 2px solid #f8f8f8 !important;
    box-shadow: 0 -10px 20px rgba(0,0,0,0.05) !important;
    z-index: 10 !important;
}

/* Ensure buttons are visible */
.checkout-btn {
    display: block !important;
    width: 100% !important;
    padding: 15px !important;
    background: #5C3A2D !important;
    color: #fff !important;
    text-align: center !important;
    font-weight: 700 !important;
    border-radius: 8px !important;
    margin-bottom: 10px !important;
    text-decoration: none !important;
}

.continue-shopping {
    display: block !important;
    text-align: center !important;
    color: #5C3A2D !important;
    font-weight: 600 !important;
    padding: 10px !important;
    text-decoration: underline !important;
}

/* Special fix for mobile "zoom" factor on 1200px site */
@media screen and (max-width: 1200px) {
    .cart-sidebar {
        width: 80% !important; /* Take up more room on phone if site is scaled */
        max-width: 500px !important;
    }
}
`;

css += ultimateFix;

// Also add back the slogan and branding polishes just in case they were in the deleted sections
css += `
.plus-small { color: #D4AF37 !important; font-weight: 800 !important; }
.logo .slogan { display: block !important; font-size: 0.85rem !important; color: #D4AF37 !important; font-weight: 600 !important; text-transform: uppercase !important; margin-top: -5px !important; }
.btn-primary, .shop-now-btn { color: white !important; }
`;

fs.writeFileSync('style.css', css);
console.log('Applied Ultimate Cart Fix');
