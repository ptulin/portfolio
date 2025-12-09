# Portfolio Website Deployment Guide

## ✅ Files Created

All frontend and backend files have been generated. Here's what you have:

### Frontend Structure
```
/portfolio
├── index.html              ✅ Homepage with modal
├── about.html              ✅ About page
├── contact.html            ✅ Contact form
├── styles.css              ✅ Main stylesheet
├── script.js               ✅ Homepage scripts
├── Code.js                 ✅ Google Apps Script (backend)
├── /assets
│   ├── /images            ✅ (empty, ready for images)
│   └── /pdf
│       └── resume.pdf     ✅ Placeholder (replace with actual PDF)
├── /resume
│   ├── index.html         ✅ Password entry page
│   ├── verify.js          ✅ Password verification
│   ├── access.html        ✅ Resume display page
│   └── access.css         ✅ Resume page styles
├── /case-studies
│   └── template.html      ✅ Case study template
└── /auth
    └── modal.js           ✅ Modal logic
```

## 🚀 Deployment Steps

### 1. Google Sheets Setup

1. Create a new Google Sheet
2. Create 3 tabs with these exact names:
   - **Requests**
   - **Passwords**
   - **AccessLog**

3. **Requests Sheet Headers** (Row 1):
   | Timestamp | FirstName | LastName | Email | Phone | Message | RequestedPassword? | AssignedPassword | Active | Notes |

4. **Passwords Sheet Headers** (Row 1):
   | PasswordID | AssignedToEmail | AssignedToName | Active | DateCreated | DateUsed |

5. **AccessLog Sheet Headers** (Row 1):
   | Timestamp | PasswordID | Email | Result | IP | UserAgent |

6. Copy the **Spreadsheet ID** from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - The ID is the long string between `/d/` and `/edit`

### 2. Google Apps Script Setup

1. Go to [script.google.com](https://script.google.com)
2. Click **"New Project"**
3. Delete the default `Code.gs` content
4. Copy the entire contents of `Code.js` from this project
5. Paste into the Apps Script editor
6. **Replace** `YOUR_SPREADSHEET_ID` with your actual Spreadsheet ID (line 2)
7. Click **"Deploy"** → **"New deployment"**
8. Click the gear icon ⚙️ next to "Select type" → **"Web app"**
9. Configure:
   - **Execute as:** Me
   - **Who has access:** Anyone
10. Click **"Deploy"**
11. **Copy the Web App URL** (you'll need this for frontend)

### 3. Setup Daily Report Trigger

1. In Apps Script editor, select `setupDailyTrigger` function
2. Click **"Run"** ▶️
3. Authorize permissions when prompted
4. This creates a daily trigger at 9 AM

### 4. Frontend Configuration

You need to replace `YOUR_APPS_SCRIPT_WEB_APP_URL` in these files:

1. **auth/modal.js** (line ~47)
2. **resume/verify.js** (line ~18)
3. **resume/access.html** (line ~67)
4. **contact.html** (line ~77)

Replace with your actual Web App URL from step 2.

**Example:**
```javascript
// Before:
const response = await fetch('YOUR_APPS_SCRIPT_WEB_APP_URL/verifyPassword', {

// After:
const response = await fetch('https://script.google.com/macros/s/AKfycby.../exec/verifyPassword', {
```

**Note:** The Apps Script `doPost` function handles routing. You can use:
- `YOUR_URL/requestAccess`
- `YOUR_URL/verifyPassword`
- `YOUR_URL/logAccess`

Or pass `action` in the JSON body.

### 5. Upload to Web Server

1. Upload all files to your web server under `/portfolio/` directory
2. Ensure all paths are relative (they already are)
3. Replace `assets/pdf/resume.pdf` with your actual resume PDF
4. Test all pages load correctly

### 6. Testing Checklist

- [ ] Homepage loads and displays correctly
- [ ] "Download Resume" button opens modal
- [ ] Modal password form works
- [ ] Contact form submits (check Apps Script logs)
- [ ] Password generation works (check Passwords sheet)
- [ ] Email sends when password requested
- [ ] Password verification works
- [ ] Resume access page loads after valid password
- [ ] Daily report trigger is set (check Apps Script triggers)

## 🔧 Troubleshooting

### Apps Script Errors
- Check execution logs: **View** → **Execution log**
- Ensure Spreadsheet ID is correct
- Verify sheet names match exactly (case-sensitive)
- Check Gmail permissions are granted

### Frontend Errors
- Check browser console for JavaScript errors
- Verify Web App URL is correct in all 4 files
- Ensure CORS is enabled (Apps Script Web Apps handle this automatically)
- Check that paths are relative and work under `/portfolio/`

### Email Not Sending
- Verify Gmail permissions in Apps Script
- Check spam folder
- Verify email addresses are valid

## 📝 Next Steps

1. Replace placeholder resume content in `resume/access.html`
2. Add actual case study content
3. Add real resume PDF to `assets/pdf/resume.pdf`
4. Customize email templates if needed
5. Test the complete flow end-to-end

## 🎯 Key Features Implemented

✅ Password-protected resume access  
✅ Sequential password generation (PT-00001, PT-00002, etc.)  
✅ Contact form with password request option  
✅ Google Sheets backend integration  
✅ Email notifications  
✅ Access logging  
✅ Daily automated reports  
✅ Responsive design matching your design mockup  

---

**Ready to deploy!** Follow the steps above and your portfolio will be live with full password management.

