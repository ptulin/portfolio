document.addEventListener('DOMContentLoaded', function() {
    const passwordForm = document.getElementById('passwordForm');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('passwordError');

    passwordForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const password = passwordInput.value.trim();
        const email = '';

        errorMessage.classList.remove('show');
        errorMessage.textContent = '';

        try {
            // Replace with your Apps Script Web App URL
            const response = await fetch('YOUR_APPS_SCRIPT_WEB_APP_URL/verifyPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password, email })
            });

            const result = await response.json();

            if (result.valid) {
                // Store password in sessionStorage for access.html
                sessionStorage.setItem('resumeAccess', 'granted');
                sessionStorage.setItem('passwordID', password);
                window.location.href = 'access.html';
            } else {
                errorMessage.textContent = 'Invalid password. Please try again.';
                errorMessage.classList.add('show');
            }
        } catch (error) {
            errorMessage.textContent = 'Error verifying password. Please try again.';
            errorMessage.classList.add('show');
        }
    });
});

