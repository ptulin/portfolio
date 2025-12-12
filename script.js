/**
 * Homepage interactions and mobile menu functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initFilters();
});

/**
 * Initialize mobile menu toggle and navigation
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!menuToggle || !mobileMenu) return;
    
    // Get or create overlay
    let overlay = document.getElementById('menuOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        overlay.id = 'menuOverlay';
        document.body.appendChild(overlay);
    }
    
    // Toggle menu function
    const toggleMenu = (isOpen) => {
        menuToggle.classList.toggle('active', isOpen);
        mobileMenu.classList.toggle('active', isOpen);
        overlay.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };
    
    // Open/close menu
    menuToggle.addEventListener('click', () => {
        const isOpen = !mobileMenu.classList.contains('active');
        toggleMenu(isOpen);
    });
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', () => toggleMenu(false));
    
    // Close menu when clicking nav link
    const navLinks = mobileMenu.querySelectorAll('.mobile-nav-link:not(.current)');
    navLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });
    
    // Mark current page in navigation
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPage || (currentPage === '' && linkPath === 'index.html')) {
            link.classList.add('current');
        }
    });
}

/**
 * Initialize filter dropdowns (placeholder for future functionality)
 */
function initFilters() {
    const filterDropdowns = document.querySelectorAll('.filter-dropdown');
    filterDropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            // Filter logic to be implemented
            console.log('Filter changed:', this.value);
        });
    });
}

