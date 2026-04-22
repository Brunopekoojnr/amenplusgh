const fs = require('fs');
const path = require('path');
const rootDir = path.join(__dirname, '..');
const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

files.forEach(f => {
    let content = fs.readFileSync(path.join(rootDir, f), 'utf8');
    
    // Replace the responsive viewport with the locked 1200px desktop viewport
    content = content.replace(/<meta name="viewport" content="[^"]+">/g, '<meta name="viewport" content="width=1200">');
    
    fs.writeFileSync(path.join(rootDir, f), content);
    console.log('Fixed viewport to 1200px in ' + f);
});
