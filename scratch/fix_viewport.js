const fs = require('fs');
const path = require('path');
const rootDir = path.join(__dirname, '..');
const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

files.forEach(f => {
    let content = fs.readFileSync(path.join(rootDir, f), 'utf8');
    
    // Replace all viewport meta tags
    content = content.replace(/<meta name="viewport" content="[^"]+">/g, '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">');
    
    // Remove the JS overrides
    content = content.replace(/\/\/ Set viewport to show full 1200px width[\s\S]*?viewport\.setAttribute\('content', 'width=1200, initial-scale=0\.7, user-scalable=yes'\);\n\s*}/g, '');
    
    fs.writeFileSync(path.join(rootDir, f), content);
    console.log('Fixed viewports in ' + f);
});
