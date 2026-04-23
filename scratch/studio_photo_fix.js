const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

const studioFix = `
/* ============================================================
   PROFESSIONAL TEAM PHOTO UNIFICATION (STUDIO LOOK)
   ============================================================ */
.team-image {
    background: radial-gradient(circle at center, #ffffff 0%, #e8e8e8 100%) !important;
    position: relative !important;
    display: flex !important;
    align-items: flex-end !important;
    justify-content: center !important;
}

.team-image img {
    /* Unify lighting and colors across different photos */
    filter: brightness(1.02) contrast(1.05) saturate(1.1) !important;
    mix-blend-mode: multiply !important; /* Helps blend subjects with the studio background if they have white backgrounds */
    object-fit: contain !important; /* Ensures heads are not cut off */
    width: 90% !important;
    height: 90% !important;
    margin: 0 auto !important;
    transition: all 0.5s ease !important;
}

.team-card:hover .team-image img {
    transform: scale(1.05) translateY(-5px) !important;
}

/* Fallback for photos that already have backgrounds */
.team-image img.has-bg {
    object-fit: cover !important;
    width: 100% !important;
    height: 100% !important;
    mix-blend-mode: normal !important;
}
`;

css += studioFix;
fs.writeFileSync('style.css', css);

// Suggest the user uses background removal
console.log('Applied Studio Photo Enhancement styles');
