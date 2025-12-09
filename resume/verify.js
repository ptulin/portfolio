document.addEventListener('DOMContentLoaded', function() {
    const passwordForm = document.getElementById('passwordForm');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('passwordError');

    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = passwordInput.value.trim();
        const email = '';

        errorMessage.classList.remove('show');
        errorMessage.textContent = '';

        // Use hidden iframe approach to avoid CORS
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.name = 'passwordFrame';
        document.body.appendChild(iframe);

        // Create a form to submit to Apps Script
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://script.google.com/macros/s/AKfycbyNQWEWnEUvBhVAnBImfHJlqeYKxMoJzwzqC3-UZJN7qL4kWoVnOM89nJzu3SAjMT72/exec';
        form.target = 'passwordFrame';
        
        // Add form fields
        const actionInput = document.createElement('input');
        actionInput.type = 'hidden';
        actionInput.name = 'action';
        actionInput.value = 'verifyPassword';
        form.appendChild(actionInput);
        
        const passwordField = document.createElement('input');
        passwordField.type = 'hidden';
        passwordField.name = 'password';
        passwordField.value = password;
        form.appendChild(passwordField);
        
        const emailField = document.createElement('input');
        emailField.type = 'hidden';
        emailField.name = 'email';
        emailField.value = email;
        form.appendChild(emailField);
        
        document.body.appendChild(form);
        
        // Handle response via iframe load
        iframe.onload = function() {
            try {
                // Try to read the iframe response
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const responseText = iframeDoc.body ? iframeDoc.body.textContent : '';
                
                let result;
                try {
                    result = JSON.parse(responseText);
                } catch (e) {
                    // If we can't parse, show error
                    errorMessage.textContent = 'Error verifying password. Please try again.';
                    errorMessage.classList.add('show');
                    document.body.removeChild(form);
                    document.body.removeChild(iframe);
                    return;
                }
                
                if (result.valid) {
                    // Store password in sessionStorage for access.html
                    sessionStorage.setItem('resumeAccess', 'granted');
                    sessionStorage.setItem('passwordID', password);
                    window.location.href = 'access.html';
                } else {
                    errorMessage.textContent = 'Invalid password. Please try again.';
                    errorMessage.classList.add('show');
                }
            } catch (err) {
                // Cross-origin error - can't read iframe
                errorMessage.textContent = 'Error verifying password. Please try again.';
                errorMessage.classList.add('show');
            }
            
            // Cleanup
            setTimeout(() => {
                if (form.parentNode) document.body.removeChild(form);
                if (iframe.parentNode) document.body.removeChild(iframe);
            }, 1000);
        };
        
        // Submit form
        form.submit();
    });
});

