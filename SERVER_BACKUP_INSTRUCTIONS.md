# Server Backup & Cleanup Instructions

## 📍 Important: Two Different Directories

Your server has **TWO separate directories**:

1. **`/public_html/pawel/`** - **DEPLOYMENT directory** (your website files)
   - This is what visitors see
   - **THIS is what you need to clean**

2. **`/repositories/pawel/`** - **GIT REPOSITORY directory** (Git storage)
   - This is where cPanel Git Version Control stores the repository
   - **DO NOT TOUCH THIS** - It's managed by Git automatically

## ✅ What to Backup & Delete

### Backup: `/public_html/pawel/` directory ONLY

**Via cPanel File Manager:**

1. Navigate to `/public_html/pawel/` (NOT repositories)
2. Click **"Select All"** checkbox (this selects visible files)
3. **To include hidden/dot files:**
   - Click **Settings** (gear icon, top right)
   - Enable **"Show Hidden Files"**
   - Go back and select all again
4. Click **"Compress"** button
5. Choose **ZIP** format
6. Name it: `pawel-backup-2025-12-23.zip`
7. Click **Compress Files**
8. **Download the ZIP file** to your computer
9. **Keep this backup until deployment is verified!**

### Delete: `/public_html/pawel/` directory contents ONLY

**After backup is downloaded:**

1. Still in `/public_html/pawel/`
2. Make sure **"Show Hidden Files"** is enabled (Settings)
3. Click **"Select All"** checkbox
4. Click **"Delete"** button
5. Confirm deletion
6. **Directory should now be empty** ✅

**DO NOT DELETE:**
- ❌ `/repositories/pawel/` - Leave this alone!
- ❌ Any other directories outside `/public_html/pawel/`

## 🔄 What Happens Next

After you delete everything in `/public_html/pawel/`:

1. Go to **Git Version Control** in cPanel
2. Click **"Pull or Deploy"** for your repository
3. Select **`main`** branch
4. Click **"Update from Repository"**
5. cPanel will:
   - Pull from GitHub `main` branch
   - Copy files to `/public_html/pawel/` (deployment directory)
   - The `/repositories/pawel/` directory is updated automatically by Git

## 📁 What Will Be on Server After Deployment

**In `/public_html/pawel/` (your website):**
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

**In `/repositories/pawel/` (Git storage - don't touch):**
- This is managed automatically by Git
- Contains `.git` folder and repository data
- You don't need to worry about this

## ✅ Summary

1. **Backup:** Compress and download everything in `/public_html/pawel/` (including hidden files)
2. **Delete:** Delete everything in `/public_html/pawel/` (including hidden files)
3. **Deploy:** Pull from GitHub `main` branch via Git Version Control
4. **Leave alone:** `/repositories/pawel/` directory (Git manages this)

---

**The `repositories` directory is separate and should NOT be touched!**

