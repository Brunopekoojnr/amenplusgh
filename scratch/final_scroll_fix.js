const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// Remove the "Ultimate Fix" block to start fresh
css = css.replace(/\/\* =+[\s\S]*?ULTIMATE CART SCROLLING[\s\S]*$/g, '');

const finalAttempt = `
/* ============================================================
   FINAL CART FIX: NO LOCKING, FULL SCROLLING
   ============================================================ */
.cart-sidebar {
    position: fixed !important;
    top: 0 !important;
    right: 0 !important;
    width: 450px !important;
    height: 100vh !important;
    height: -webkit-fill-available !important;
    background: #fff !important;
    z-index: 100000 !important;
    box-shadow: -5px 0 30px rgba(0,0,0,0.2) !important;
    overflow-y: auto !important; /* THE WHOLE SIDEBAR SCROLLS */
    overflow-x: hidden !important;
    display: block !important; /* NO FLEX LOCKING */
    -webkit-overflow-scrolling: touch !important;
    transition: transform 0.3s ease-in-out !important;
}

.cart-items {
    height: auto !important;
    min-height: 100px !important;
    padding: 20px !important;
    overflow: visible !important;
}

.cart-footer {
    position: relative !important;
    bottom: auto !important;
    left: auto !important;
    width: 100% !important;
    padding: 20px !important;
    background: #fdf6f0 !important;
    border-top: 1px solid #eee !important;
}

.checkout-btn {
    display: block !important;
    width: 100% !important;
    padding: 18px !important;
    background: #5C3A2D !important;
    color: #fff !important;
    font-weight: 700 !important;
    border-radius: 8px !important;
    text-align: center !important;
    margin-top: 15px !important;
    text-decoration: none !important;
}

@media screen and (max-width: 1200px) {
    .cart-sidebar {
        width: 85% !important;
    }
}

/* Slogan & Plus Sign */
.plus-small { color: #D4AF37 !important; font-weight: 800 !important; }
.logo .slogan { display: block !important; font-size: 0.85rem !important; color: #D4AF37 !important; font-weight: 600 !important; text-transform: uppercase !important; margin-top: -5px !important; }
`;

css += finalAttempt;
fs.writeFileSync('style.css', css);
console.log('Applied Final Scroll Fix');
