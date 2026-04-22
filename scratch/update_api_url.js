const fs = require('fs');

// After Render deploys, replace this URL with your actual Render backend URL
// e.g. https://amenplus-backend.onrender.com
const RENDER_URL = 'https://amenplus-backend.onrender.com';

// Update admin.html
let admin = fs.readFileSync('admin.html', 'utf8');
admin = admin.replace(
    "const API_URL = 'http://localhost:3000/api';",
    `const API_URL = '${RENDER_URL}/api';`
);
fs.writeFileSync('admin.html', admin);
console.log('Updated admin.html');

// Update cart.js
let cart = fs.readFileSync('js/cart.js', 'utf8');
// Replace any localhost backend URL
cart = cart.replace(
    /['"`]http:\/\/localhost:\d+\/api['"`]/g,
    `'${RENDER_URL}/api'`
);
fs.writeFileSync('js/cart.js', cart);
console.log('Updated cart.js');
