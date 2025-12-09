/**
 * Password verification for resume/index.html page
 */
document.addEventListener('DOMContentLoaded', function() {
    const passwordForm = document.getElementById('passwordForm');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('passwordError');

    if (!passwordForm) return;

    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = passwordInput.value.trim();
        if (!password) {
            errorMessage.textContent = 'Please enter a password.';
            errorMessage.classList.add('show');
            return;
        }

        errorMessage.classList.remove('show');
        errorMessage.textContent = '';

        // Use shared utility function
        submitToAppsScript(
            { password, email: '' },
            'verifyPassword',
            function(result) {
                // Success - store session data and redirect
                sessionStorage.setItem('resumeAccess', 'granted');
                sessionStorage.setItem('passwordID', password);
                window.location.href = 'access.html';
            },
            function(error) {
                // Error - show message
                errorMessage.textContent = 'Invalid password. Please try again.';
                errorMessage.classList.add('show');
            },
            1500 // 1.5 second timeout
        );
    });
});

