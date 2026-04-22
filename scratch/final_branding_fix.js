const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
    let html = fs.readFileSync(f, 'utf8');

    // 1. Fix Viewport - allow user scaling and set initial-scale for forced desktop feel
    html = html.replace(
        /<meta name="viewport" content="width=1200[^"]*">/g,
        '<meta name="viewport" content="width=1200, initial-scale=1.0, user-scalable=yes">'
    );

    // 2. Fix Logo Structure on all pages
    const logoRegex = /<a href="index\.html" class="logo">([\s\S]*?)<\/a>/g;
    html = html.replace(logoRegex, (match, content) => {
        return `<a href="index.html" class="logo">
                <img src="assets/logo.png" alt="Amen+ Logo" class="logo-image">
                <div class="logo-text">
                    <span class="brand-name">AMEN<span class="plus">+</span></span>
                    <span class="slogan">Jesus is the <span class="plus-small">+</span></span>
                </div>
            </a>`;
    });

    // 3. Ensure "Jesus is the +" is in the Cart Sidebar too
    const cartHeaderRegex = /<div class="cart-header">([\s\S]*?)<h2>([\s\S]*?)<\/h2>/g;
    html = html.replace(cartHeaderRegex, (match, before, h2Content) => {
        if (!h2Content.includes('Jesus is the')) {
            return `<div class="cart-header">${before}<h2>${h2Content.trim()} <br><span class="slogan" style="display:block !important; font-size:0.5em; color:#D4AF37; margin-top:5px; font-weight:600;">Jesus is the <span class="plus-small">+</span></span></h2>`;
        }
        return match;
    });

    fs.writeFileSync(f, html);
    console.log(`Updated ${f}`);
});

// 4. Update style.css
let css = fs.readFileSync('style.css', 'utf8');

// Ensure slogan and plus-small are styled correctly
const finalStyles = `
/* Final Branding Polishes */
.plus-small {
    color: var(--gold-accent) !important;
    font-weight: 800 !important;
}

.logo .slogan {
    display: block !important;
    font-size: 0.85rem !important;
    color: var(--gold-accent) !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    letter-spacing: 1.5px !important;
    margin-top: -5px !important;
    font-family: 'Inter', sans-serif !important;
}

/* Fix for Button Visibility - OVERRIDE ALL */
.btn-primary, .checkout-btn, .add-to-cart-btn, .shop-now-btn, .shop-more-btn {
    color: white !important;
    text-decoration: none !important;
}

/* Viewport Fix: Allow zooming on all elements */
* {
    touch-action: manipulation !important;
}

/* Cart Footer Pinning & Scrolling */
.cart-sidebar {
    display: flex !important;
    flex-direction: column !important;
}
.cart-items {
    flex: 1 !important;
    overflow-y: auto !important;
}
.cart-footer {
    padding-bottom: env(safe-area-inset-bottom) !important;
}
`;

css += finalStyles;
fs.writeFileSync('style.css', css);
console.log('Final CSS polish applied');
