const fs = require('fs');

const OLD_URL = 'https://amenplus-backend.onrender.com';
const NEW_URL = 'https://amenplusgh.onrender.com';

const files = ['admin.html', 'clients.html', 'js/cart.js'];

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    const updated = content.split(OLD_URL).join(NEW_URL);
    fs.writeFileSync(f, updated);
    console.log(`Updated ${f}`);
});
