const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.pdf'));

async function parseAll() {
    for (const file of files) {
        try {
            const dataBuffer = fs.readFileSync(path.join(rootDir, file));
            const data = await pdf(dataBuffer);
            console.log('\n================================');
            console.log('FILE: ' + file);
            console.log('================================\n');
            console.log(data.text);
        } catch (err) {
            console.log(`Failed to parse ${file}: ${err.message}`);
        }
    }
}

parseAll();
