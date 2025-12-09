// Password modal logic for homepage
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('downloadResumeBtn');
    const modal = document.getElementById('passwordModal');
    const closeBtn = document.getElementById('closeModal');
    const passwordForm = document.getElementById('passwordForm');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('passwordError');

    // Open modal
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            modal.classList.add('active');
            passwordInput.focus();
        });
    }

    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
            passwordForm.reset();
            errorMessage.classList.remove('show');
        });
    }

    // Close on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            passwordForm.reset();
            errorMessage.classList.remove('show');
        }
    });

    // Form submission
    if (passwordForm) {
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
                    // Redirect to resume access page
                    window.location.href = 'resume/access.html';
                } else {
                    errorMessage.textContent = 'Invalid password. Please try again.';
                    errorMessage.classList.add('show');
                }
            } catch (error) {
                errorMessage.textContent = 'Error verifying password. Please try again.';
                errorMessage.classList.add('show');
            }
        });
    }
});

