// Homepage interactions
document.addEventListener('DOMContentLoaded', function() {
    // Menu toggle (if needed)
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            // Add menu functionality if needed
            console.log('Menu clicked');
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

