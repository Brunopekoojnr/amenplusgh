const fs = require('fs');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

htmlFiles.forEach(f => {
    let html = fs.readFileSync(f, 'utf8');

    // 1. Remove "Jesus is the +" slogan from nav (it belongs as a tagline under logo, not in the nav bar)
    html = html.replace(/<span class="slogan">Jesus is the <span class="plus-small">\+<\/span><\/span>/g, '');

    fs.writeFileSync(f, html);
    console.log(`Fixed slogan in ${f}`);
});

// 2. Fix cart footer always visible + blue color fixes in style.css
let css = fs.readFileSync('style.css', 'utf8');

const fixes = `
/* ===== CRITICAL CART FIXES ===== */
/* Cart sidebar layout - ensure footer is ALWAYS visible */
.cart-sidebar {
    display: flex !important;
    flex-direction: column !important;
    max-height: 100vh !important;
    overflow: hidden !important;
}
.cart-items {
    flex: 1 !important;
    overflow-y: auto !important;
    min-height: 0 !important;
}
.cart-footer {
    flex-shrink: 0 !important;
    position: relative !important;
    background: white !important;
    border-top: 2px solid #f0e8e0 !important;
    padding: 15px !important;
    z-index: 10 !important;
}

/* ===== FIX ALL BLUE COLORS ===== */
/* Remove any blue from anywhere */
a { color: var(--deep-brown, #5C3A2D) !important; }
a:hover { color: var(--gold-accent, #D4AF37) !important; }
.logo { color: var(--deep-brown, #5C3A2D) !important; }
.logo span { color: var(--deep-brown, #5C3A2D) !important; }
.logo .plus { color: var(--gold-accent, #D4AF37) !important; }

/* Fix logo image blue tint if any */
.logo-image {
    filter: none !important;
}

/* Fix slogan display - hide from nav, only show on homepage hero */
.slogan {
    display: none !important;
}

/* ===== FIX PLUS SIGN ON ALL PAGES ===== */
.plus {
    color: var(--gold-accent, #D4AF37) !important;
    -webkit-text-fill-color: var(--gold-accent, #D4AF37) !important;
    font-weight: 800 !important;
}

/* ===== FIX FAMILY ICON COLOR ===== */
.team-section h2 .section-icon,
.team-section-title .icon,
h2 .section-emoji {
    color: var(--deep-brown, #5C3A2D) !important;
}

/* ===== DASHBOARD MOBILE FIX ===== */
.main {
    overflow-x: auto !important;
}
.stats-grid {
    min-width: 600px;
}
.table-card {
    overflow-x: auto !important;
}
`;

css += fixes;
fs.writeFileSync('style.css', css);
console.log('Applied all CSS fixes');
