/**
 * Portfolio Backend - Google Apps Script
 * Handles password management, logging, and email notifications
 */

// Configuration
const SPREADSHEET_ID = '1qtY7cqSQT243R-iQlzvQ-2d4z1KYM7M8krJ1zqY9-m0';
const ADMIN_EMAIL = 'ptulin@gmail.com';
const RESUME_URL = 'https://disruptiveexperience.com/portfolio/resume/index.html';
const SHEET_NAMES = {
  REQUESTS: 'Requests',
  PASSWORDS: 'Passwords',
  ACCESS_LOG: 'AccessLog'
};

// Initialize spreadsheet
function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getSheet(sheetName) {
  return getSpreadsheet().getSheetByName(sheetName);
}

/**
 * Get the next sequential password number
 * @return {number} Next password number
 */
function getNextPasswordNumber() {
  const sheet = getSheet(SHEET_NAMES.PASSWORDS);
  const lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    return 1;
  }
  
  // Get all password IDs and find the highest number
  const passwordRange = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  let maxNumber = 0;
  
  passwordRange.forEach(row => {
    const passwordID = String(row[0] || '');
    if (passwordID.startsWith('PT-')) {
      const number = parseInt(passwordID.replace('PT-', ''), 10);
      if (!isNaN(number) && number > maxNumber) {
        maxNumber = number;
      }
    }
  });
  
  return maxNumber + 1;
}

// Generate password
function generatePassword() {
  const nextNumber = getNextPasswordNumber();
  return 'PT-' + String(nextNumber).padStart(5, '0');
}

// Helper function to create CORS-enabled response
function createCorsResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// OPTIONS handler for CORS preflight
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

// GET handler (for testing/health checks)
function doGet(e) {
  return createCorsResponse({ 
    success: true, 
    message: 'Portfolio Backend API is running',
    timestamp: new Date().toISOString()
  });
}

/**
 * Parse request data from POST request
 * @param {Object} e - Event object from doPost
 * @return {Object} Parsed data and action
 */
function parseRequestData(e) {
  let data = {};
  let action = '';
  
  if (e.postData && e.postData.contents) {
    const contentType = e.postData.type || '';
    if (contentType.indexOf('application/json') !== -1) {
      // JSON request
      try {
        data = JSON.parse(e.postData.contents);
        action = data.action || '';
      } catch (parseError) {
        throw new Error('Invalid JSON: ' + parseError.toString());
      }
    } else {
      // Form data - parse URL-encoded
      const params = e.postData.contents.split('&');
      params.forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) {
          data[decodeURIComponent(key)] = decodeURIComponent(value);
        }
      });
      action = data.action || '';
    }
  } else {
    // Fallback to parameters
    data = e.parameter || {};
    action = e.parameter.action || '';
  }
  
  return { data, action };
}

/**
 * POST handler - routes requests to appropriate handlers
 */
function doPost(e) {
  try {
    const { data, action } = parseRequestData(e);
    
    Logger.log(`Received action: ${action}`);
    
    // Route to appropriate handler
    switch (action) {
      case 'requestAccess':
        return handleRequestAccess(data);
      case 'verifyPassword':
        return handleVerifyPassword(data);
      case 'logAccess':
        return handleLogAccess(data);
      case 'forgotPassword':
        return handleForgotPassword(data);
      default:
        return createCorsResponse({ 
          success: false, 
          error: `Invalid action: ${action}` 
        });
    }
  } catch (error) {
    Logger.log(`doPost error: ${error.toString()}`);
    Logger.log(`Stack: ${error.stack}`);
    return createCorsResponse({ 
      success: false, 
      error: error.toString()
    });
  }
}

// Handle request access
function handleRequestAccess(data) {
  const requestsSheet = getSheet(SHEET_NAMES.REQUESTS);
  const passwordsSheet = getSheet(SHEET_NAMES.PASSWORDS);
  
  const timestamp = new Date();
  const firstName = data.firstName || '';
  const lastName = data.lastName || '';
  const email = data.email || '';
  const phone = data.phone || '';
  const message = data.message || '';
  const requestPassword = data.requestPassword === true || data.requestPassword === 'true' || data.requestPassword === 'Yes';
  
  let assignedPassword = '';
  
  // Log request
  requestsSheet.appendRow([
    timestamp,
    firstName,
    lastName,
    email,
    phone,
    message,
    requestPassword ? 'Yes' : 'No',
    '', // AssignedPassword - will be filled if password requested
    'TRUE', // Active
    '' // Notes
  ]);
  
  // Generate password if requested
  if (requestPassword) {
    assignedPassword = generatePassword();
    
    // Update AssignedPassword in Requests sheet
    const lastRow = requestsSheet.getLastRow();
    requestsSheet.getRange(lastRow, 8).setValue(assignedPassword);
    
    // Add to Passwords sheet
    passwordsSheet.appendRow([
      assignedPassword,
      email,
      firstName + ' ' + lastName,
      'TRUE', // Active
      timestamp,
      '', // DateUsed - empty initially
    ]);
    
    // Send email with password
    sendPasswordEmail(email, firstName, assignedPassword);
  } else {
    // Send confirmation email without password
    sendConfirmationEmail(email, firstName);
  }
  
  return createCorsResponse({ success: true });
}

/**
 * Verify password and log access attempt
 * @param {Object} data - Request data containing password and email
 * @return {Object} Response with valid status
 */
function handleVerifyPassword(data) {
  const passwordsSheet = getSheet(SHEET_NAMES.PASSWORDS);
  const accessLogSheet = getSheet(SHEET_NAMES.ACCESS_LOG);
  
  const password = String(data.password || '').trim();
  const email = String(data.email || '').trim();
  const timestamp = new Date();
  
  Logger.log(`Verifying password: ${password}`);
  
  // Check if password exists and is active
  const lastRow = passwordsSheet.getLastRow();
  let isValid = false;
  let passwordRowIndex = -1;
  
  if (lastRow > 1) {
    const passwordData = passwordsSheet.getRange(2, 1, lastRow - 1, 6).getValues();
    
    // Use find instead of loop for better performance
    const foundIndex = passwordData.findIndex(row => {
      const passwordID = String(row[0] || '').trim();
      const active = String(row[3] || '').toUpperCase();
      return passwordID === password && (active === 'TRUE' || active === 'YES' || active === '1');
    });
    
    if (foundIndex !== -1) {
      isValid = true;
      passwordRowIndex = foundIndex + 2; // +2 because array is 0-indexed and we start at row 2
      passwordsSheet.getRange(passwordRowIndex, 6).setValue(timestamp);
      Logger.log('Password valid!');
    }
  }
  
  // Log access attempt
  accessLogSheet.appendRow([
    timestamp,
    password,
    email,
    isValid ? 'Success' : 'Failed',
    '', // IP
    ''  // UserAgent
  ]);
  
  return createCorsResponse({ valid: isValid });
}

// Handle log access
function handleLogAccess(data) {
  const accessLogSheet = getSheet(SHEET_NAMES.ACCESS_LOG);
  
  const passwordID = data.passwordID || '';
  const email = data.email || '';
  const timestamp = new Date();
  const ip = data.ip || '';
  const userAgent = data.userAgent || '';
  
  accessLogSheet.appendRow([
    timestamp,
    passwordID,
    email,
    'Success',
    ip,
    userAgent
  ]);
  
  return createCorsResponse({ success: true });
}

/**
 * Send password email to user
 * @param {string} email - Recipient email
 * @param {string} firstName - Recipient first name
 * @param {string} passwordID - Generated password
 */
function sendPasswordEmail(email, firstName, passwordID) {
  const subject = 'Your Resume Access Code — Pawel Tulin';
  const body = `Hello ${firstName},

Your personal access code for the resume is:
${passwordID}

Use it here:
${RESUME_URL}

Best,
Pawel`;
  
  try {
    GmailApp.sendEmail(email, subject, body);
    Logger.log(`Password email sent to ${email}`);
  } catch (error) {
    Logger.log(`Error sending password email: ${error.toString()}`);
  }
}

/**
 * Send confirmation email (without password)
 * @param {string} email - Recipient email
 * @param {string} firstName - Recipient first name
 */
function sendConfirmationEmail(email, firstName) {
  const subject = 'Thank You for Reaching Out';
  const body = `Hello ${firstName},

Thanks for reaching out. Your message has been received.

Best,
Pawel`;
  
  try {
    GmailApp.sendEmail(email, subject, body);
    Logger.log(`Confirmation email sent to ${email}`);
  } catch (error) {
    Logger.log(`Error sending confirmation email: ${error.toString()}`);
  }
}

/**
 * Handle forgot password request
 * Looks up password by email and sends it to the user
 * Also logs the request for analytics tracking
 * @param {Object} data - Request data containing email
 * @return {Object} Response with success status
 */
function handleForgotPassword(data) {
  try {
    const email = data.email ? data.email.trim().toLowerCase() : '';
    
    if (!email) {
      return createCorsResponse({ 
        success: false, 
        error: 'Email is required' 
      });
    }
    
    // Get password from Passwords sheet
    const passwordsSheet = getSheet(SHEET_NAMES.PASSWORDS);
    
    if (!passwordsSheet) {
      Logger.log('Password sheet not found');
      logForgotPasswordRequest(email, false);
      return createCorsResponse({ 
        success: true, 
        message: 'If an account exists with this email, your password has been sent.' 
      });
    }
    
    // Get all data from the sheet (same approach as verifyPassword)
    const lastRow = passwordsSheet.getLastRow();
    if (lastRow <= 1) {
      logForgotPasswordRequest(email, false);
      return createCorsResponse({ 
        success: true, 
        message: 'If an account exists with this email, your password has been sent.' 
      });
    }
    
    const passwordData = passwordsSheet.getRange(2, 1, lastRow - 1, 6).getValues();
    
    // Passwords sheet structure:
    // Column A (index 0): PasswordID (e.g., "PT-00001")
    // Column B (index 1): AssignedToEmail
    // Column C (index 2): AssignedToName
    // Column D (index 3): Active
    // Column E (index 4): DateCreated
    // Column F (index 5): DateUsed
    
    const passwordIDColumnIndex = 0; // Column A - PasswordID
    const emailColumnIndex = 1; // Column B - AssignedToEmail
    const nameColumnIndex = 2; // Column C - AssignedToName
    const activeColumnIndex = 3; // Column D - Active
    
    // Search for matching email
    let password = null;
    let firstName = '';
    
    for (let i = 0; i < passwordData.length; i++) {
      const rowEmail = passwordData[i][emailColumnIndex] ? passwordData[i][emailColumnIndex].toString().trim().toLowerCase() : '';
      const active = String(passwordData[i][activeColumnIndex] || '').toUpperCase();
      const isActive = active === 'TRUE' || active === 'YES' || active === '1';
      
      if (rowEmail === email && isActive) {
        password = passwordData[i][passwordIDColumnIndex] ? passwordData[i][passwordIDColumnIndex].toString().trim() : null;
        const assignedToName = passwordData[i][nameColumnIndex] ? passwordData[i][nameColumnIndex].toString() : '';
        firstName = assignedToName ? assignedToName.split(' ')[0] : '';
        break;
      }
    }
    
    // Log the request for analytics (regardless of whether email exists)
    logForgotPasswordRequest(email, !!password);
    
    // Always return success message (security: don't reveal if email exists)
    // But only send email if password exists
    if (password) {
      sendPasswordEmail(email, firstName || 'User', password);
    }
    
    // Return success (same message whether email exists or not)
    return createCorsResponse({ 
      success: true, 
      message: 'If an account exists with this email, your password has been sent.' 
    });
    
  } catch (error) {
    Logger.log('Forgot password error: ' + error.toString());
    return createCorsResponse({ 
      success: false, 
      error: 'An error occurred' 
    });
  }
}

/**
 * Log forgot password request for analytics
 * Tracks: email, timestamp, whether password was found
 * Uses existing AccessLog structure
 * @param {string} email - Email address that requested password
 * @param {boolean} passwordFound - Whether password was found
 */
function logForgotPasswordRequest(email, passwordFound) {
  try {
    // Log to existing AccessLog tab (same structure as verifyPassword)
    const accessLogSheet = getSheet(SHEET_NAMES.ACCESS_LOG);
    
    // AccessLog columns: Timestamp, PasswordID, Email, Result, IP, UserAgent
    accessLogSheet.appendRow([
      new Date(),
      '', // PasswordID - empty for forgot password requests
      email,
      passwordFound ? 'ForgotPassword-Success' : 'ForgotPassword-NotFound',
      '', // IP
      ''  // UserAgent
    ]);
    
  } catch (error) {
    Logger.log('Error logging forgot password request: ' + error.toString());
    // Don't fail the request if logging fails
  }
}

/**
 * Daily cron job - send summary report
 * Analyzes last 24 hours of activity and emails report
 */
function sendDailyReport() {
  const accessLogSheet = getSheet(SHEET_NAMES.ACCESS_LOG);
  const requestsSheet = getSheet(SHEET_NAMES.REQUESTS);
  
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const timeZone = Session.getScriptTimeZone();
  
  // Analyze access logs
  const accessStats = analyzeAccessLogs(accessLogSheet, yesterday);
  
  // Analyze contact requests
  const requestStats = analyzeContactRequests(requestsSheet, yesterday);
  
  // Compose and send email
  const subject = `Portfolio Daily Report - ${Utilities.formatDate(now, timeZone, 'yyyy-MM-dd')}`;
  const body = `Daily Portfolio Activity Report
Generated: ${Utilities.formatDate(now, timeZone, 'yyyy-MM-dd HH:mm:ss')}

ACCESS LOGS (Last 24 Hours):
- Total Access Attempts: ${accessStats.total}
- Successful: ${accessStats.successful}
- Failed: ${accessStats.failed}

CONTACT REQUESTS (Last 24 Hours):
- Total Requests: ${requestStats.total}
- Password Requests: ${requestStats.passwordRequests}
- General Inquiries: ${requestStats.generalInquiries}

---
This is an automated report from your portfolio website.`;
  
  try {
    GmailApp.sendEmail(ADMIN_EMAIL, subject, body);
    Logger.log('Daily report sent successfully');
  } catch (error) {
    Logger.log(`Error sending daily report: ${error.toString()}`);
  }
}

/**
 * Analyze access logs for the last 24 hours
 * @param {Sheet} sheet - Access log sheet
 * @param {Date} since - Start date for analysis
 * @return {Object} Statistics object
 */
function analyzeAccessLogs(sheet, since) {
  const stats = { total: 0, successful: 0, failed: 0 };
  const lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) return stats;
  
  const accessData = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
  accessData.forEach(row => {
    const timestamp = new Date(row[0]);
    if (timestamp >= since) {
      stats.total++;
      if (row[3] === 'Success') {
        stats.successful++;
      } else {
        stats.failed++;
      }
    }
  });
  
  return stats;
}

/**
 * Analyze contact requests for the last 24 hours
 * @param {Sheet} sheet - Requests sheet
 * @param {Date} since - Start date for analysis
 * @return {Object} Statistics object
 */
function analyzeContactRequests(sheet, since) {
  const stats = { total: 0, passwordRequests: 0, generalInquiries: 0 };
  const lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) return stats;
  
  const requestData = sheet.getRange(2, 1, lastRow - 1, 10).getValues();
  requestData.forEach(row => {
    const timestamp = new Date(row[0]);
    if (timestamp >= since) {
      stats.total++;
      if (row[6] === 'Yes') {
        stats.passwordRequests++;
      } else {
        stats.generalInquiries++;
      }
    }
  });
  
  return stats;
}

// Setup function - create trigger for daily report
function setupDailyTrigger() {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'sendDailyReport') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Create new trigger for 9 AM daily
  ScriptApp.newTrigger('sendDailyReport')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();
}

// Setup function - initialize Google Sheet headers
// Run this function once in Apps Script to set up all the sheet headers
function setupSheetHeaders() {
  const spreadsheet = getSpreadsheet();
  
  // Setup Requests sheet
  let requestsSheet = spreadsheet.getSheetByName(SHEET_NAMES.REQUESTS);
  if (!requestsSheet) {
    requestsSheet = spreadsheet.insertSheet(SHEET_NAMES.REQUESTS);
  }
  requestsSheet.clear();
  requestsSheet.getRange(1, 1, 1, 10).setValues([[
    'Timestamp',
    'FirstName',
    'LastName',
    'Email',
    'Phone',
    'Message',
    'RequestedPassword?',
    'AssignedPassword',
    'Active',
    'Notes'
  ]]);
  requestsSheet.getRange(1, 1, 1, 10).setFontWeight('bold');
  requestsSheet.setFrozenRows(1);
  
  // Setup Passwords sheet
  let passwordsSheet = spreadsheet.getSheetByName(SHEET_NAMES.PASSWORDS);
  if (!passwordsSheet) {
    passwordsSheet = spreadsheet.insertSheet(SHEET_NAMES.PASSWORDS);
  }
  passwordsSheet.clear();
  passwordsSheet.getRange(1, 1, 1, 6).setValues([[
    'PasswordID',
    'AssignedToEmail',
    'AssignedToName',
    'Active',
    'DateCreated',
    'DateUsed'
  ]]);
  passwordsSheet.getRange(1, 1, 1, 6).setFontWeight('bold');
  passwordsSheet.setFrozenRows(1);
  
  // Setup AccessLog sheet
  let accessLogSheet = spreadsheet.getSheetByName(SHEET_NAMES.ACCESS_LOG);
  if (!accessLogSheet) {
    accessLogSheet = spreadsheet.insertSheet(SHEET_NAMES.ACCESS_LOG);
  }
  accessLogSheet.clear();
  accessLogSheet.getRange(1, 1, 1, 6).setValues([[
    'Timestamp',
    'PasswordID',
    'Email',
    'Result',
    'IP',
    'UserAgent'
  ]]);
  accessLogSheet.getRange(1, 1, 1, 6).setFontWeight('bold');
  accessLogSheet.setFrozenRows(1);
  
  Logger.log('Sheet headers set up successfully!');
  return 'Sheet headers set up successfully!';
}

// Simple test to verify authorization
function testAuth() {
  try {
    // Try to access Drive first (simpler)
    const test = DriveApp.getRootFolder();
    Logger.log('Drive access: OK');
    
    // Then try SpreadsheetApp
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const name = ss.getName();
    Logger.log('Spreadsheet access: OK - Name: ' + name);
    return 'Success! Spreadsheet: ' + name;
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    Logger.log('Full error: ' + JSON.stringify(error));
    return 'Error: ' + error.toString();
  }
}

