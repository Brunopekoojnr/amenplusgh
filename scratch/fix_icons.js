const fs = require('fs');

// Fix family emoji in contact.html - replace blue 👥 with a Font Awesome icon
let contact = fs.readFileSync('contact.html', 'utf8');
contact = contact.replace(
    '<h2>👥 Meet The Amen+ Family</h2>',
    '<h2><i class="fas fa-hands-holding-heart" style="color:#D4AF37;margin-right:12px;font-size:0.85em;"></i> Meet The Amen<span style="color:#D4AF37;">+</span> Family</h2>'
);
fs.writeFileSync('contact.html', contact);
console.log('Fixed family icon in contact.html');

// Also fix shop.html AMEN+ logo plus sign
const shopFiles = ['shop.html', 'index.html', 'delivery.html', 'about.html', 'contact.html', 'product.html'];
shopFiles.forEach(f => {
    let html = fs.readFileSync(f, 'utf8');
    // Make sure the logo span has the plus with gold color
    html = html.replace(
        /(<span>AMEN<span class="plus">)\+(<\/span><\/span>)/g,
        '$1+$2'
    );
    fs.writeFileSync(f, html);
});
console.log('Checked logo plus on all pages');
