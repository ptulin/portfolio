# Server Cleanup & Fresh Deployment Guide

## 🎯 Goal
Clean server with only production files from GitHub `main` branch.

## ⚠️ Important: Backup First!

Before deleting anything, **backup your current server files**:

### Option 1: Via cPanel File Manager
1. Log into cPanel
2. Go to **File Manager**
3. Navigate to `/public_html/pawel/` (or your deployment directory)
4. Select all files
5. Click **Compress** → Create a ZIP file
6. Download the ZIP file to your computer
7. **Keep this backup until deployment is verified!**

### Option 2: Via FTP
1. Connect via FTP client
2. Download entire `/public_html/pawel/` directory
3. Save locally as backup

## 🧹 Clean Deployment Strategy

### Recommended Approach: Clean Slate

Since you want a **completely clean server**, here's the best approach:

#### Step 1: Backup Current Server (5 minutes)
- Create ZIP backup via cPanel File Manager
- Download to your computer

#### Step 2: Delete Everything on Server (2 minutes)
**Via cPanel File Manager:**
1. Navigate to `/public_html/pawel/`
2. Select **ALL files and folders**
3. Click **Delete**
4. Confirm deletion
5. **Server is now empty** ✅

**OR via SSH (if you have access):**
```bash
cd /home1/moose/public_html/pawel
rm -rf *
rm -rf .[^.]*
```

#### Step 3: Fresh Pull from GitHub (1 minute)
1. Go to **Git Version Control** in cPanel
2. Select your repository
3. Click **Pull or Deploy**
4. Select **`main`** branch
5. Click **Update from Repository**
6. All production files will be deployed fresh ✅

#### Step 4: Verify Deployment (5 minutes)
- [ ] Homepage loads: https://disruptiveexperience.com/pawel/
- [ ] All case studies accessible
- [ ] Images load correctly
- [ ] Contact form works
- [ ] No broken links
- [ ] Mobile responsive

## 🔍 What Will Be on Server After Deployment

**Clean production files only:**
```
pawel/
├── index.html
├── about.html
├── contact.html
├── case-study.html
├── 404.html
├── common.css
├── common.js
├── config.js
├── case_studies_data.js
├── robots.txt
├── sitemap.xml
├── README.md
├── DEPLOYMENT.md
├── images/ (all case study images)
├── js/utils.js
├── resume/ (password-protected)
└── docs/ (documentation)
```

**NO sandbox folders**
**NO development files**
**NO old prototype code**
**ONLY production-ready code**

## ✅ Benefits of Clean Deployment

1. **No confusion** - Only production files
2. **Faster** - No old files to process
3. **Cleaner** - Professional structure
4. **Easier maintenance** - Clear what's production
5. **Better performance** - No unnecessary files

## 🆘 If Something Goes Wrong

1. **Restore from backup** (the ZIP you downloaded)
2. **Or** pull from `archive/prototype-v1` branch temporarily
3. **Or** contact me for help

## 📋 Quick Checklist

- [ ] Backup current server files (ZIP download)
- [ ] Delete everything in `/public_html/pawel/`
- [ ] Pull from GitHub `main` branch via cPanel
- [ ] Verify homepage loads
- [ ] Test case studies
- [ ] Test contact form
- [ ] Verify images load
- [ ] Check mobile responsive
- [ ] **Keep backup until everything verified!**

---

**Recommendation:** Delete everything and do a fresh pull. This gives you the cleanest, most professional setup.

