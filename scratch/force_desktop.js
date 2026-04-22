const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

// 1. Force all HTML to width=1200
files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/<meta name="viewport"[^>]*>/g, '<meta name="viewport" content="width=1200">');
    fs.writeFileSync(f, content);
});

// 2. Remove the custom mobile nav CSS
let css = fs.readFileSync('style.css', 'utf8');
css = css.replace(/\/\* ========================================\s*CUSTOM DESKTOP-STYLE MOBILE NAVIGATION[\s\S]*$/i, '');

// 3. Squeeze the cart CSS
const cartSqueeze = `
/* COMPACT CART FOR DESKTOP VIEW */
.cart-sidebar {
    width: 350px !important;
}
.cart-header {
    padding: 15px !important;
}
.cart-items {
    padding: 10px 15px !important;
}
.cart-item {
    margin-bottom: 8px !important;
    padding-bottom: 8px !important;
}
.cart-item img {
    width: 60px !important;
    height: 60px !important;
}
.cart-item-details h4 {
    font-size: 0.95rem !important;
    margin-bottom: 2px !important;
}
.cart-footer {
    padding: 15px !important;
}
.cart-summary div {
    margin-bottom: 5px !important;
    font-size: 0.9rem !important;
}
.checkout-btn {
    padding: 12px !important;
    font-size: 1.1rem !important;
    margin-top: 5px !important;
}
.cart-actions {
    margin-top: 10px !important;
    gap: 5px !important;
}
.cart-actions a {
    padding: 8px !important;
    font-size: 0.85rem !important;
}
`;
css += '\n' + cartSqueeze;
fs.writeFileSync('style.css', css);
console.log('Forced desktop view and compacted cart');
