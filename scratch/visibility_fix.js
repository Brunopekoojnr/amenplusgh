const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// 1. Remove the aggressive global overrides that are breaking colors
const blocksToRemove = [
    /\/\* Fix for Button Visibility - OVERRIDE ALL \*\/[\s\S]*?touch-action: manipulation !important;\s+\}/g,
    /\.btn-primary, \.checkout-btn, \.add-to-cart-btn, \.shop-now-btn, \.shop-more-btn \{[\s\S]*?color: white !important;[\s\S]*?\}/g
];

blocksToRemove.forEach(p => {
    css = css.replace(p, '');
});

const visibilityFixes = `
/* ============================================================
   BUTTON & FOOTER VISIBILITY FIXES
   ============================================================ */

/* High Contrast Buttons */
.btn-primary {
    background: #D4AF37 !important;
    color: #5C3A2D !important; /* Dark brown on Gold */
    font-weight: 700 !important;
}

.btn-primary:hover {
    background: #5C3A2D !important;
    color: #ffffff !important; /* White on Dark Brown */
}

.btn-secondary {
    background: transparent !important;
    color: #ffffff !important;
    border: 2px solid #ffffff !important;
}

.btn-secondary:hover {
    background: #ffffff !important;
    color: #5C3A2D !important;
}

.quick-add {
    background: #D4AF37 !important;
    color: #5C3A2D !important;
    font-weight: 700 !important;
}

.quick-add:hover {
    background: #5C3A2D !important;
    color: #ffffff !important;
}

.checkout-btn {
    background: #5C3A2D !important;
    color: #ffffff !important;
    font-weight: 700 !important;
}

/* Footer Clarity Fixes */
.footer {
    color: #ffffff !important;
}

.footer-section a {
    color: rgba(255, 255, 255, 0.95) !important;
    text-shadow: none !important;
    font-weight: 400 !important;
}

.footer-section a:hover {
    color: #D4AF37 !important;
}

.footer-bottom {
    color: #ffffff !important;
    opacity: 0.9 !important;
    border-top: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.social-links a {
    color: #ffffff !important;
    background: rgba(255, 255, 255, 0.15) !important;
    opacity: 1 !important;
}

.social-links a:hover {
    background: #D4AF37 !important;
    color: #5C3A2D !important;
}

/* Fix "Blurry" text by ensuring sharp rendering */
body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Ensure no text-shadow is making text look blurry */
.btn-primary, .btn-secondary, .footer-section a, .footer-bottom {
    text-shadow: none !important;
}
`;

css += visibilityFixes;
fs.writeFileSync('style.css', css);
console.log('Applied Visibility and Contrast Fixes');
