const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/<meta name="viewport" content="width=1200">/g, '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">');
    fs.writeFileSync(f, content);
});
console.log('Restored fully responsive viewports');
