// Configuration
const SPREADSHEET_ID = '1qtY7cqSQT243R-iQlzvQ-2d4z1KYM7M8krJ1zqY9-m0';
const ADMIN_EMAIL = 'ptulin@gmail.com';
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

// Get next password number
function getNextPasswordNumber() {
  const sheet = getSheet(SHEET_NAMES.PASSWORDS);
  const lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    return 1; // First password
  }
  
  // Get all password IDs and find the highest number
  const passwordRange = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  let maxNumber = 0;
  
  passwordRange.forEach(row => {
    const passwordID = row[0];
    if (passwordID && passwordID.startsWith('PT-')) {
      const number = parseInt(passwordID.replace('PT-', ''));
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

// POST handler
function doPost(e) {
  try {
    let data = {};
    let action = '';
    
    // Parse request data
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
        action = data.action || '';
      } catch (parseError) {
        Logger.log('JSON parse error: ' + parseError.toString());
        return createCorsResponse({ 
          success: false, 
          error: 'Invalid JSON: ' + parseError.toString() 
        });
      }
    } else {
      // Fallback to parameters
      data = e.parameter;
      action = e.parameter.action || '';
    }
    
    Logger.log('Received action: ' + action);
    Logger.log('Data keys: ' + Object.keys(data).join(', '));
    
    // Route to appropriate handler
    if (action === 'requestAccess') {
      return handleRequestAccess(data);
    } else if (action === 'verifyPassword') {
      return handleVerifyPassword(data);
    } else if (action === 'logAccess') {
      return handleLogAccess(data);
    }
    
    return createCorsResponse({ 
      success: false, 
      error: 'Invalid action: ' + action 
    });
  } catch (error) {
    Logger.log('doPost error: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    return createCorsResponse({ 
      success: false, 
      error: error.toString(),
      stack: error.stack 
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
  const requestPassword = data.requestPassword === true || data.requestPassword === 'true';
  
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

// Handle verify password
function handleVerifyPassword(data) {
  const passwordsSheet = getSheet(SHEET_NAMES.PASSWORDS);
  const accessLogSheet = getSheet(SHEET_NAMES.ACCESS_LOG);
  
  const password = data.password || '';
  const email = data.email || '';
  const timestamp = new Date();
  
  // Get user info
  const userAgent = ''; // Could be passed from frontend
  const ip = ''; // Could be passed from frontend
  
  // Check if password exists and is active
  const lastRow = passwordsSheet.getLastRow();
  let isValid = false;
  
  if (lastRow > 1) {
    const passwordData = passwordsSheet.getRange(2, 1, lastRow - 1, 6).getValues();
    
    for (let i = 0; i < passwordData.length; i++) {
      const row = passwordData[i];
      const passwordID = row[0];
      const active = row[3];
      
      if (passwordID === password && active === 'TRUE') {
        isValid = true;
        
        // Update DateUsed
        passwordsSheet.getRange(i + 2, 6).setValue(timestamp);
        break;
      }
    }
  }
  
  // Log access attempt
  accessLogSheet.appendRow([
    timestamp,
    password,
    email,
    isValid ? 'Success' : 'Failed',
    ip,
    userAgent
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

// Send password email
function sendPasswordEmail(email, firstName, passwordID) {
  const subject = 'Your Resume Access Code — Pawel Tulin';
  const body = `Hello ${firstName},

Your personal access code for the resume is:
${passwordID}

Use it here:
https://disruptiveexperience.com/portfolio/resume/index.html

Best,
Pawel`;
  
  GmailApp.sendEmail(email, subject, body);
}

// Send confirmation email
function sendConfirmationEmail(email, firstName) {
  const subject = 'Thank You for Reaching Out';
  const body = `Hello ${firstName},

Thanks for reaching out. Your message has been received.

Best,
Pawel`;
  
  GmailApp.sendEmail(email, subject, body);
}

// Daily cron job - send summary report
function sendDailyReport() {
  const accessLogSheet = getSheet(SHEET_NAMES.ACCESS_LOG);
  const requestsSheet = getSheet(SHEET_NAMES.REQUESTS);
  
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  // Get last 24 hours of access logs
  const lastRow = accessLogSheet.getLastRow();
  let accessCount = 0;
  let successCount = 0;
  let failedCount = 0;
  
  if (lastRow > 1) {
    const accessData = accessLogSheet.getRange(2, 1, lastRow - 1, 6).getValues();
    accessData.forEach(row => {
      const timestamp = new Date(row[0]);
      if (timestamp >= yesterday) {
        accessCount++;
        if (row[3] === 'Success') {
          successCount++;
        } else {
          failedCount++;
        }
      }
    });
  }
  
  // Get last 24 hours of requests
  const requestsLastRow = requestsSheet.getLastRow();
  let requestCount = 0;
  let passwordRequestCount = 0;
  
  if (requestsLastRow > 1) {
    const requestData = requestsSheet.getRange(2, 1, requestsLastRow - 1, 10).getValues();
    requestData.forEach(row => {
      const timestamp = new Date(row[0]);
      if (timestamp >= yesterday) {
        requestCount++;
        if (row[6] === 'Yes') {
          passwordRequestCount++;
        }
      }
    });
  }
  
  // Compose email
  const subject = 'Portfolio Daily Report - ' + Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const body = `Daily Portfolio Activity Report
Generated: ${Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss')}

ACCESS LOGS (Last 24 Hours):
- Total Access Attempts: ${accessCount}
- Successful: ${successCount}
- Failed: ${failedCount}

CONTACT REQUESTS (Last 24 Hours):
- Total Requests: ${requestCount}
- Password Requests: ${passwordRequestCount}
- General Inquiries: ${requestCount - passwordRequestCount}

---
This is an automated report from your portfolio website.`;
  
  GmailApp.sendEmail(ADMIN_EMAIL, subject, body);
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

