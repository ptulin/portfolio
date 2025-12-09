/**
 * Password modal logic for homepage
 * Handles password verification and redirects to resume page
 */
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('downloadResumeBtn');
    const modal = document.getElementById('passwordModal');
    const closeBtn = document.getElementById('closeModal');
    const passwordForm = document.getElementById('passwordForm');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('passwordError');

    if (!passwordForm || !modal) return;

    // Open modal
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            modal.classList.add('active');
            if (passwordInput) passwordInput.focus();
        });
    }

    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('active');
        passwordForm.reset();
        errorMessage.classList.remove('show');
    }

    // Form submission
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
                sessionStorage.setItem('passwordID', password);
                sessionStorage.setItem('resumeAccess', 'granted');
                window.location.href = 'resume/access.html';
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

