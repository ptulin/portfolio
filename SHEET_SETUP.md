# Google Sheet Setup Instructions

## Spreadsheet ID
`1qtY7cqSQT243R-iQIzvQ-2d4z1KYM7M8krJ1zqY9-m0`

## Step-by-Step Header Setup

### Tab 1: Requests
1. Click on the "Requests" tab
2. In Row 1, enter these headers (one per column):
   - Column A: `Timestamp`
   - Column B: `FirstName`
   - Column C: `LastName`
   - Column D: `Email`
   - Column E: `Phone`
   - Column F: `Message`
   - Column G: `RequestedPassword?`
   - Column H: `AssignedPassword`
   - Column I: `Active`
   - Column J: `Notes`

### Tab 2: Passwords
1. Click on the "Passwords" tab
2. In Row 1, enter these headers:
   - Column A: `PasswordID`
   - Column B: `AssignedToEmail`
   - Column C: `AssignedToName`
   - Column D: `Active`
   - Column E: `DateCreated`
   - Column F: `DateUsed`

### Tab 3: AccessLog
1. Click on the "AccessLog" tab
2. In Row 1, enter these headers:
   - Column A: `Timestamp`
   - Column B: `PasswordID`
   - Column C: `Email`
   - Column D: `Result`
   - Column E: `IP`
   - Column F: `UserAgent`

## Sharing Permissions

**You do NOT need to change sharing permissions** if:
- You're running the Apps Script as yourself ("Execute as: Me")
- The Google Sheet is owned by your Google account

The Apps Script will access the sheet using your account permissions automatically.

## Quick Copy-Paste Method

You can also copy-paste these directly into Row 1 of each tab:

**Requests tab (Row 1):**
```
Timestamp	FirstName	LastName	Email	Phone	Message	RequestedPassword?	AssignedPassword	Active	Notes
```

**Passwords tab (Row 1):**
```
PasswordID	AssignedToEmail	AssignedToName	Active	DateCreated	DateUsed
```

**AccessLog tab (Row 1):**
```
Timestamp	PasswordID	Email	Result	IP	UserAgent
```

---

Once headers are set up, proceed to Google Apps Script setup!

