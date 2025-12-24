/**
 * Portfolio Website - Shared Utilities
 * 
 * Handles all form submissions to Google Apps Script backend using iframe method
 * to avoid CORS issues. This is the central integration point for all backend operations.
 * 
 * @file js/utils.js
 * @author Pawel Tulin
 * @version 1.0.0
 */

'use strict';

/**
 * Google Apps Script Web App URL
 * 
 * This URL is generated when deploying the Apps Script as a web app.
 * Update this if the Apps Script deployment changes or is redeployed.
 * 
 * @constant {string}
 */
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyNQWEWnEUvBhVAnBImfHJlqeYKxMoJzwzqC3-UZJN7qL4kWoVnOM89nJzu3SAjMT72/exec';

/**
 * Submit form data to Google Apps Script backend using hidden iframe method
 * 
 * This method avoids CORS issues by submitting a form to a hidden iframe.
 * The iframe receives the response from Apps Script, which we attempt to parse.
 * If parsing fails (due to CORS), we assume success for better UX.
 * 
 * @param {Object} data - Form data object to submit (key-value pairs)
 * @param {string} action - Action identifier for Apps Script routing:
 *                         - 'requestAccess': Contact form submission
 *                         - 'verifyPassword': Resume password verification
 *                         - 'logAccess': Resume access logging
 *                         - 'forgotPassword': Password retrieval request
 * @param {Function} onSuccess - Success callback function(result)
 * @param {Function} onError - Error callback function(error)
 * @param {number} timeout - Request timeout in milliseconds (default: 1500)
 * 
 * @example
 * submitToAppsScript(
 *   { email: 'user@example.com', message: 'Hello' },
 *   'requestAccess',
 *   (result) => console.log('Success:', result),
 *   (error) => console.error('Error:', error)
 * );
 */
function submitToAppsScript(data, action, onSuccess, onError, timeout = 1500) {
    try {
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
    } catch (error) {
        console.error('[submitToAppsScript] Error:', error);
        // On error, still call success callback for better UX
        if (onSuccess) {
            setTimeout(() => onSuccess({ success: true }), 100);
        }
    }
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.submitToAppsScript = submitToAppsScript;
    window.APPS_SCRIPT_URL = APPS_SCRIPT_URL;
}

