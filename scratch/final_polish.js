const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
    let html = fs.readFileSync(f, 'utf8');

    // 1. Fix Viewport - allow user scaling
    html = html.replace(
        /<meta name="viewport" content="width=1200">/g,
        '<meta name="viewport" content="width=1200, user-scalable=yes">'
    );

    // 2. Add "Jesus is the +" back to logo if it's missing
    // Find the logo link and add the slogan span back
    const logoRegex = /<a href="index\.html" class="logo">([\s\S]*?)<\/a>/g;
    html = html.replace(logoRegex, (match, content) => {
        if (!content.includes('Jesus is the')) {
            return `<a href="index.html" class="logo">
                ${content.trim()}
                <span class="slogan">Jesus is the <span class="plus-small">+</span></span>
            </a>`;
        }
        return match;
    });

    // 3. Add slogan to Cart Header if it's missing
    const cartHeaderRegex = /<div class="cart-header">([\s\S]*?)<h2>([\s\S]*?)<\/h2>/g;
    html = html.replace(cartHeaderRegex, (match, before, h2Content) => {
        if (!h2Content.includes('Jesus is the')) {
            return `<div class="cart-header">${before}<h2>${h2Content.trim()} <span class="slogan" style="display:inline-block !important; font-size:0.6em; margin-left:10px;">Jesus is the <span class="plus-small">+</span></span></h2>`;
        }
        return match;
    });

    fs.writeFileSync(f, html);
    console.log(`Updated ${f}`);
});

// 4. Fix style.css
let css = fs.readFileSync('style.css', 'utf8');

// Remove the aggressive slogan hiding and global a color
css = css.replace(/\.slogan \{\s+display: none !important;\s+\}/g, '');
css = css.replace(/a \{ color: var\(--deep-brown, #5C3A2D\) !important; \}/g, 'a { color: var(--deep-brown, #5C3A2D); }');
css = css.replace(/a:hover \{ color: var\(--gold-accent, #D4AF37\) !important; \}/g, 'a:hover { color: var(--gold-accent, #D4AF37); }');

// Add styles to ensure slogans are visible and buttons are correct
const extraStyles = `
/* Ensure slogan is visible but elegant */
.logo .slogan {
    display: block !important;
    font-size: 0.75rem !important;
    color: var(--gold-accent) !important;
    font-weight: 500 !important;
    margin-top: -2px !important;
    letter-spacing: 1px !important;
}

/* Fix button contrast - ensure white text stays white */
.btn-primary, .checkout-btn, .add-to-cart-btn, .shop-more-btn {
    color: white !important;
}
.btn-primary:hover, .checkout-btn:hover, .add-to-cart-btn:hover {
    color: white !important;
}

/* Cart Scrolling Fix for Mobile */
@media (max-width: 768px) {
    .cart-sidebar {
        width: 100% !important;
        right: -100% !important;
        height: 100vh !important;
        height: -webkit-fill-available !important;
    }
    .cart-sidebar.active {
        right: 0 !important;
    }
    .cart-items {
        max-height: calc(100vh - 250px) !important;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
    }
}
`;

css += extraStyles;
fs.writeFileSync('style.css', css);
console.log('Updated style.css');
