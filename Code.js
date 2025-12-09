// Configuration
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Replace with your Sheet ID
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

// POST /requestAccess
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || e.parameter.action;
    
    if (action === 'requestAccess' || e.parameter.action === 'requestAccess') {
      return handleRequestAccess(data);
    } else if (action === 'verifyPassword' || e.parameter.action === 'verifyPassword') {
      return handleVerifyPassword(data);
    } else if (action === 'logAccess' || e.parameter.action === 'logAccess') {
      return handleLogAccess(data);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Invalid action' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
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
  
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
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
  
  return ContentService.createTextOutput(JSON.stringify({ valid: isValid }))
    .setMimeType(ContentService.MimeType.JSON);
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
  
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
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

