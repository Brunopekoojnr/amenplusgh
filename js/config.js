// js/config.js
// Smart URL switcher - works locally AND on live server
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : 'https://amenplus-api.onrender.com';

console.log('🔗 API Connected:', API_URL);