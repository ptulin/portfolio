# Fix Server Repository Branch Issue

## 🔍 Problem Identified

Your server's Git repository is on the **`pawel-deploy`** branch (old), but the production code is on the **`main`** branch.

**Current Server State:**
- Repository branch: `pawel-deploy` ❌
- HEAD commit: `75542cf` (Dec 22 - old, doesn't have GLG/TD Ameritrade)
- Deployment directory: Empty ✅ (you cleaned it)

**What You Need:**
- Repository branch: `main` ✅
- HEAD commit: `35c3868` (Dec 23 - has all fixes)
- Deployment directory: Will be populated from `main` branch

## ✅ Solution: Switch Repository to Main Branch

### Option 1: Via cPanel Git Version Control (Recommended)

1. **Log into cPanel**
2. **Go to Git Version Control**
3. **Find your repository** (`/home1/moose/repositories/pawel`)
4. **Click on the repository** to manage it
5. **Look for "Branch" or "Checkout" option**
6. **Select `main` branch**
7. **Click "Update" or "Checkout"**
8. **Then click "Pull or Deploy"**
9. **Select `main` branch**
10. **Click "Update from Repository"**

### Option 2: Via SSH (If you have access)

```bash
# Connect to server via SSH
ssh your-username@your-server

# Navigate to repository
cd /home1/moose/repositories/pawel

# Fetch latest from GitHub
git fetch origin

# Switch to main branch
git checkout main

# Pull latest code
git pull origin main

# Then deploy (cPanel will do this automatically, or run deployment script)
```

### Option 3: Re-create Repository Connection

If switching branches doesn't work:

1. **In cPanel Git Version Control:**
2. **Remove/Delete the current repository connection**
3. **Add new repository:**
   - Repository URL: `https://github.com/ptulin/portfolio.git`
   - Branch: `main` (IMPORTANT!)
   - Deployment path: `/home1/moose/public_html/pawel`
4. **Save and deploy**

## 🔍 How to Verify

After switching to `main` branch, check:

1. **In Git Version Control**, verify:
   - Currently checked-out branch: **`main`** ✅
   - HEAD commit should be: `35c3868` or newer
   - Commit message should mention "Fix: Update all beforeAfter.png references"

2. **After deployment**, verify:
   - Files appear in `/public_html/pawel/`
   - GLG case study works: https://disruptiveexperience.com/pawel/case-study.html?project=glg-expert-network
   - TD Ameritrade case study works: https://disruptiveexperience.com/pawel/case-study.html?project=td-ameritrade-ux-analysis

## 📋 Quick Checklist

- [ ] Repository switched to `main` branch
- [ ] HEAD commit is `35c3868` or newer
- [ ] Pull/Deploy from `main` branch
- [ ] Files deployed to `/public_html/pawel/`
- [ ] GLG case study works
- [ ] TD Ameritrade case study works

---

**The issue:** Server repository is on wrong branch (`pawel-deploy` instead of `main`)
**The fix:** Switch repository to `main` branch, then deploy

