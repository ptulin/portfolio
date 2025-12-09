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
                        // If we can't parse, check if it's a redirect or error
                        console.error('Could not parse response:', responseText);
                        errorMessage.textContent = 'Error verifying password. Please try again.';
                        errorMessage.classList.add('show');
                        document.body.removeChild(form);
                        document.body.removeChild(iframe);
                        return;
                    }
                    
                    if (result.valid) {
                        // Store password ID in sessionStorage for access page
                        sessionStorage.setItem('passwordID', password);
                        // Redirect to resume access page
                        window.location.href = 'resume/access.html';
                    } else {
                        errorMessage.textContent = 'Invalid password. Please try again.';
                        errorMessage.classList.add('show');
                    }
                } catch (err) {
                    // Cross-origin error - can't read iframe
                    // Try to check if we got redirected (which might indicate success)
                    // For now, show error
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
    }
});

