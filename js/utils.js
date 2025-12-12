/**
 * Shared utilities for portfolio website
 * Handles form submissions to Google Apps Script backend
 */

// Apps Script Web App URL - update this if the deployment changes
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyNQWEWnEUvBhVAnBImfHJlqeYKxMoJzwzqC3-UZJN7qL4kWoVnOM89nJzu3SAjMT72/exec';

/**
 * Submit form data to Apps Script using hidden iframe (avoids CORS issues)
 * @param {Object} data - Form data to submit
 * @param {string} action - Action name (requestAccess, verifyPassword, logAccess)
 * @param {Function} onSuccess - Callback on success
 * @param {Function} onError - Callback on error
 * @param {number} timeout - Timeout in ms (default: 1500)
 */
function submitToAppsScript(data, action, onSuccess, onError, timeout = 1500) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.name = `appsScriptFrame_${Date.now()}`;
    document.body.appendChild(iframe);

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = APPS_SCRIPT_URL;
    form.target = iframe.name;
    
    // Add action field
    const actionInput = document.createElement('input');
    actionInput.type = 'hidden';
    actionInput.name = 'action';
    actionInput.value = action;
    form.appendChild(actionInput);
    
    // Add data fields
    Object.keys(data).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data[key] || '';
        form.appendChild(input);
    });
    
    document.body.appendChild(form);
    
    let handled = false;
    const cleanup = () => {
        setTimeout(() => {
            if (form.parentNode) document.body.removeChild(form);
            if (iframe.parentNode) document.body.removeChild(iframe);
        }, 1000);
    };
    
    // Timeout fallback
    const timeoutId = setTimeout(() => {
        if (!handled) {
            handled = true;
            if (onSuccess) onSuccess({ success: true }); // Assume success if timeout
            cleanup();
        }
    }, timeout);
    
    // Handle iframe load
    iframe.onload = function() {
        if (handled) return;
        handled = true;
        clearTimeout(timeoutId);
        
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const responseText = iframeDoc.body ? iframeDoc.body.textContent : '';
            
            if (responseText) {
                try {
                    const result = JSON.parse(responseText);
                    if (result.success || result.valid) {
                        if (onSuccess) onSuccess(result);
                    } else {
                        if (onError) onError(result);
                    }
                } catch (e) {
                    // If response contains success indicators, assume success
                    if (responseText.includes('"success":true') || responseText.includes('"valid":true')) {
                        if (onSuccess) onSuccess({ success: true });
                    } else {
                        if (onError) onError({ error: 'Invalid response' });
                    }
                }
            } else {
                // No response text, assume success (CORS blocked)
                if (onSuccess) onSuccess({ success: true });
            }
        } catch (err) {
            // CORS error - can't read iframe, assume success
            if (onSuccess) onSuccess({ success: true });
        }
        
        cleanup();
    };
    
    // Handle iframe error
    iframe.onerror = function() {
        if (handled) return;
        handled = true;
        clearTimeout(timeoutId);
        if (onSuccess) onSuccess({ success: true }); // Assume success on error
        cleanup();
    };
    
    // Submit form
    form.submit();
}

