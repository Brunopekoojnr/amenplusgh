// Shared mobile menu drawer controller

document.addEventListener('DOMContentLoaded', () => {
    // STEP 1: Inject the mobile menu component into the DOM
    // This allows us to use a single menu template across all pages
    if (typeof injectMobileMenu === 'function') {
        injectMobileMenu();
    }

    // STEP 2: Set up menu toggle logic (now that the menu HTML is injected)
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

    // STEP 3: Active nav link highlighting
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkFile = link.getAttribute('href');
        if (linkFile === currentPath || (currentPath === '' && linkFile === 'index.html')) {
            link.classList.add('active');
        }
    });

    // STEP 4: Scroll-reveal via IntersectionObserver
    const scrollFadeEls = document.querySelectorAll('.scroll-fade');
    if (scrollFadeEls.length > 0 && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );
        scrollFadeEls.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback: make all visible immediately for older browsers
        scrollFadeEls.forEach(el => el.classList.add('visible'));
    }
});

