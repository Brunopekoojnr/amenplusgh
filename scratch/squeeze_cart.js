const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

const index = css.indexOf('/* COMPACT CART FOR DESKTOP VIEW */');
if (index !== -1) {
    css = css.substring(0, index);
}

const squeeze = `
/* COMPACT CART FOR DESKTOP VIEW */
.cart-sidebar { width: 300px !important; }
.cart-header { padding: 10px !important; }
.cart-items { padding: 5px !important; }
.cart-item { margin-bottom: 5px !important; padding-bottom: 5px !important; }
.cart-item img { width: 50px !important; height: 50px !important; }
.cart-item-details h4 { font-size: 0.9rem !important; margin-bottom: 0px !important; }
.cart-footer { padding: 10px !important; }
.cart-summary div { margin-bottom: 2px !important; font-size: 0.85rem !important; }
.checkout-btn { padding: 8px !important; font-size: 0.95rem !important; margin-top: 5px !important; }
.cart-actions { margin-top: 5px !important; gap: 5px !important; }
.cart-actions a { padding: 5px !important; font-size: 0.8rem !important; }
`;

css += squeeze;
fs.writeFileSync('style.css', css);
console.log('Squeezed cart more');
