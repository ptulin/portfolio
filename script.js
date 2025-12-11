// Homepage interactions
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuToggle && mobileMenu) {
        // Get existing overlay or create one
        let overlay = document.getElementById('menuOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'mobile-menu-overlay';
            overlay.id = 'menuOverlay';
            document.body.appendChild(overlay);
        }
        
        // Toggle menu
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking overlay
        overlay.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close menu when clicking a nav link (except current page)
        const navLinks = mobileMenu.querySelectorAll('.mobile-nav-link:not(.current)');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Detect current page and mark it
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPage || (currentPage === '' && linkPath === 'index.html')) {
                link.classList.add('current');
            }
        });
    }

    // Filter functionality (placeholder)
    const filterDropdowns = document.querySelectorAll('.filter-dropdown');
    filterDropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            // Add filter logic
            console.log('Filter changed:', this.value);
        });
    });
});

