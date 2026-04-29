/**
 * Universal Component Injection Library
 * Injects reusable UI components into the DOM at runtime
 * This eliminates copy-paste HTML across multiple pages
 */

/**
 * Injects the full-screen top-down mobile menu into the document body
 * Uses insertAdjacentHTML to add the menu after the opening <body> tag
 */
function injectMobileMenu() {
    const menuHTML = `
    <!-- Full-Screen Top-Down Mobile Menu -->
    <div class="ff-mobile-menu" id="mobile-menu">
        <!-- Menu Header -->
        <div class="ff-menu-header">
            <div class="ff-menu-logo">
                <img src="assets/logo.png" alt="Amen+ Logo" class="ff-logo-img">
                <span class="ff-menu-brand">AMEN+</span>
            </div>
            <button class="ff-menu-close" onclick="closeMobileMenu()" title="Close menu">
                <span>&times;</span>
            </button>
        </div>

        <!-- Menu Links -->
        <div class="ff-menu-links">
            <a href="index.html" onclick="closeMobileMenu()">Home</a>
            <a href="shop.html" onclick="closeMobileMenu()">Shop</a>
            <a href="delivery.html" onclick="closeMobileMenu()">Delivery</a>
            <a href="about.html" onclick="closeMobileMenu()">About</a>
            <a href="contact.html" onclick="closeMobileMenu()">Contact & Team</a>
        </div>

        <!-- Menu Footer -->
        <div class="ff-menu-footer">
            <a href="https://wa.me/233201686831" target="_blank" class="ff-whatsapp-cta">
                <i class="fab fa-whatsapp"></i> Chat on WhatsApp
            </a>
        </div>
    </div>`;

    // Insert after the opening <body> tag
    document.body.insertAdjacentHTML('afterbegin', menuHTML);
}
