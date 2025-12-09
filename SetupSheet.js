// Setup script to initialize Google Sheet headers
// Run this function once in Apps Script to set up all the sheet headers

function setupSheetHeaders() {
  const SPREADSHEET_ID = '1qtY7cqSQT243R-iQIzvQ-2d4z1KYM7M8krJ1zqY9-m0';
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Setup Requests sheet
  let requestsSheet = spreadsheet.getSheetByName('Requests');
  if (!requestsSheet) {
    requestsSheet = spreadsheet.insertSheet('Requests');
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
  let passwordsSheet = spreadsheet.getSheetByName('Passwords');
  if (!passwordsSheet) {
    passwordsSheet = spreadsheet.insertSheet('Passwords');
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
  let accessLogSheet = spreadsheet.getSheetByName('AccessLog');
  if (!accessLogSheet) {
    accessLogSheet = spreadsheet.insertSheet('AccessLog');
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

