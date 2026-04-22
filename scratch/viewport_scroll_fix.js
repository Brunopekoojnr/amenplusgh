const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
    let html = fs.readFileSync(f, 'utf8');

    // Remove initial-scale to let browser scale 1200px to fit the screen by default
    html = html.replace(
        /<meta name="viewport" content="width=1200, initial-scale=1\.0, user-scalable=yes">/g,
        '<meta name="viewport" content="width=1200, user-scalable=yes">'
    );

    fs.writeFileSync(f, html);
    console.log(`Fixed viewport in ${f}`);
});

// Update style.css for global cart scrolling (since 1200px viewport bypasses mobile media queries)
let css = fs.readFileSync('style.css', 'utf8');

const scrollingFix = `
/* GLOBAL CART SCROLLING FIX (Bypasses media queries) */
.cart-sidebar {
    height: 100vh !important;
    height: -webkit-fill-available !important;
    max-height: 100vh !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;
    position: fixed !important;
    top: 0 !important;
    z-index: 9999 !important;
}
.cart-items {
    flex: 1 !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
    padding-bottom: 20px !important;
}
.cart-footer {
    flex-shrink: 0 !important;
    background: white !important;
    box-shadow: 0 -5px 15px rgba(0,0,0,0.05) !important;
}
`;

css += scrollingFix;
fs.writeFileSync('style.css', css);
console.log('Applied global cart scrolling fix');
