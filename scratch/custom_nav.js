const fs = require('fs');
const css = `
/* ========================================
   CUSTOM DESKTOP-STYLE MOBILE NAVIGATION 
   ======================================== */
@media (max-width: 900px) {
    /* Hide the hamburger menu forever */
    .hamburger {
        display: none !important;
    }
    
    /* Make the nav container stack cleanly */
    .nav {
        flex-direction: column !important;
        align-items: center !important;
        padding: 15px 10px 5px !important;
        height: auto !important;
    }
    
    /* Center the logo */
    .logo {
        margin-bottom: 15px !important;
    }
    
    .logo-image {
        height: 50px !important; /* Slightly smaller for mobile */
    }
    
    .logo span {
        font-size: 1.5rem !important;
    }
    
    /* Display the nav links horizontally, scrolling if needed */
    .nav-links {
        display: flex !important;
        flex-direction: row !important;
        position: static !important;
        width: 100vw !important;
        max-width: 100vw !important;
        background: transparent !important;
        justify-content: flex-start !important;
        gap: 15px !important;
        padding: 5px 20px 15px !important;
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch !important;
        white-space: nowrap !important;
        box-shadow: none !important;
        transform: none !important;
        margin-left: -20px !important;
    }
    
    /* Hide scrollbar for a cleaner look */
    .nav-links::-webkit-scrollbar {
        display: none !important;
    }
    
    /* Style the links like premium pills */
    .nav-links a {
        font-size: 0.95rem !important;
        padding: 8px 18px !important;
        background: rgba(212, 175, 55, 0.1) !important;
        border-radius: 20px !important;
        color: #5C3A2D !important;
        margin: 0 !important;
        border: 1px solid rgba(212, 175, 55, 0.3) !important;
        display: inline-block !important;
    }
    
    .nav-links a:hover,
    .nav-links a.active {
        background: #D4AF37 !important;
        color: white !important;
    }
    
    /* Reposition the cart icon */
    .nav-icons {
        position: absolute !important;
        top: 25px !important;
        right: 20px !important;
    }
    
    .main-header {
        height: auto !important;
    }
}
`;
fs.appendFileSync('style.css', css);
console.log('Appended custom mobile nav CSS');
