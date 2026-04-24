const fs = require('fs');

const finalPolish = `
/* ============================================================
   FINAL BRANDING & CART POLISH
   ============================================================ */

/* 1. Slogan & Plus Sign Branding */
.plus, .plus-small { 
    color: #D4AF37 !important; 
    font-weight: 800 !important;
}

.logo .slogan { 
    display: block !important; 
    font-size: 0.85rem !important; 
    color: #D4AF37 !important; 
    font-weight: 600 !important; 
    text-transform: uppercase !important; 
    margin-top: -5px !important;
    letter-spacing: 1.5px !important;
}

/* 2. Cart: No Pinning, One Long Scrollable Sidebar */
.cart-sidebar {
    position: fixed !important;
    top: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 450px !important;
    max-width: 90vw !important;
    height: 100vh !important;
    height: -webkit-fill-available !important;
    background: #fff !important;
    z-index: 100000 !important;
    display: block !important; /* Block instead of flex for full scrolling */
    overflow-y: auto !important;
    overflow-x: hidden !important;
    -webkit-overflow-scrolling: touch !important;
    transform: translateX(100%);
    visibility: hidden;
    transition: transform 0.3s ease-in-out, visibility 0.3s !important;
}

.cart-sidebar.active {
    transform: translateX(0) !important;
    visibility: visible !important;
}

.cart-items {
    height: auto !important;
    min-height: 200px !important;
    overflow: visible !important;
    padding: 20px !important;
}

.cart-footer {
    position: relative !important;
    padding: 25px 20px !important;
    background: #fdf6f0 !important;
    border-top: 1px solid #eee !important;
}

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
}

/* 3. Studio Look for Team */
.team-image {
    background: radial-gradient(circle at center, #ffffff 0%, #e8e8e8 100%) !important;
}

.team-image img {
    filter: brightness(1.02) contrast(1.05) saturate(1.1) !important;
    mix-blend-mode: multiply !important;
}
`;

fs.appendFileSync('style.css', finalPolish);
console.log('Applied final polish to style.css');
