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
            // Apps Script Web App URL
            const response = await fetch('https://script.google.com/macros/s/AKfycbyNQWEWnEUvBhVAnBImfHJlqeYKxMoJzwzqC3-UZJN7qL4kWoVnOM89nJzu3SAjMT72/exec?action=verifyPassword', {
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

