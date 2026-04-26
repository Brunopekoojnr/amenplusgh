// Shared mobile menu drawer controller

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger') || document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let menuOverlay = document.getElementById('menu-overlay');

    if (mobileMenu && !menuOverlay) {
        menuOverlay = document.createElement('div');
        menuOverlay.id = 'menu-overlay';
        menuOverlay.className = 'menu-overlay';
        document.body.appendChild(menuOverlay);
    }

    const setMenuState = (isOpen) => {
        if (mobileMenu) {
            mobileMenu.classList.toggle('active', isOpen);
            mobileMenu.classList.toggle('open', isOpen);
        }

        if (hamburger) {
            hamburger.classList.toggle('active', isOpen);
            hamburger.classList.toggle('open', isOpen);
        }

        if (menuOverlay) {
            menuOverlay.classList.toggle('active', isOpen);
            menuOverlay.classList.toggle('open', isOpen);
        }

        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    const openMenu = () => setMenuState(true);
    const closeMenu = () => setMenuState(false);
    const toggleMenu = () => setMenuState(!(mobileMenu && mobileMenu.classList.contains('active')));

    window.toggleMobileMenu = toggleMenu;
    window.closeMobileMenu = closeMenu;

    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    closeMenu();
});
