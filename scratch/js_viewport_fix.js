const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/viewport\.setAttribute\('content',\s*'width=1200, initial-scale=0\.7, user-scalable=yes'\);/g, "viewport.setAttribute('content', 'width=1200');");
    fs.writeFileSync(f, content);
});
console.log('Fixed JS viewports');
