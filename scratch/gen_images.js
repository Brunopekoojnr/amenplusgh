const fs=require('fs'); 
const path=require('path'); 
const files=fs.readdirSync('../assets/images').filter(f=>f.endsWith('.jpeg')); 
let html = '<html><body><h1>Image Reference</h1>'; 
files.forEach(f=>{ 
    html += '<div style="margin-bottom: 20px; border-bottom: 2px solid #ccc; padding-bottom: 10px;">';
    html += '<h2>' + f + '</h2>';
    html += '<img src=\"../assets/images/' + f + '\" style=\"width:300px\">'; 
    html += '</div>';
}); 
html += '</body></html>'; 
fs.writeFileSync('images.html', html);
