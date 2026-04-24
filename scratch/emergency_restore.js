const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

const finalAdditions = `
/* ============================================================
   RESTORATION: FINAL CART & STUDIO FIXES
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
    overflow-y: auto !important;
    overflow-x: hidden !important;
    display: block !important;
    -webkit-overflow-scrolling: touch !important;
    transition: transform 0.3s ease-in-out !important;
}

.cart-sidebar.active {
    transform: translateX(0) !important;
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

.team-image {
    background: radial-gradient(circle at center, #ffffff 0%, #e8e8e8 100%) !important;
    position: relative !important;
    display: flex !important;
    align-items: flex-end !important;
    justify-content: center !important;
}

.team-image img {
    filter: brightness(1.02) contrast(1.05) saturate(1.1) !important;
    mix-blend-mode: multiply !important;
    object-fit: contain !important;
    width: 90% !important;
    height: 90% !important;
    margin: 0 auto !important;
}

.plus-small { color: #D4AF37 !important; font-weight: 800 !important; }
.logo .slogan { display: block !important; font-size: 0.85rem !important; color: #D4AF37 !important; font-weight: 600 !important; text-transform: uppercase !important; margin-top: -5px !important; }
`;

css += finalAdditions;
fs.writeFileSync('style.css', css);
console.log('Restored all styles and added final fixes');
