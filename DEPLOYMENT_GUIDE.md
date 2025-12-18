# GitHub Deployment Guide

## ✅ Current Status

**Repository**: https://github.com/ptulin/portfolio  
**Live Site**: https://disruptiveexperience.com/portfolio/  
**Deployment**: Automatic via cPanel Git Version Control

## Pre-Deployment Checklist

### ✅ Files Ready for Deployment

- [x] All HTML pages
- [x] CSS and JavaScript files
- [x] Images and assets
- [x] Configuration files
- [x] Documentation files
- [x] SEO files (sitemap.xml, robots.txt)
- [x] 404 error page
- [x] .gitignore file created

### ⚠️ Notes

1. **Google Apps Script URL**: The `APPS_SCRIPT_URL` in `js/utils.js` is a public web app URL and is safe to commit. It's not a secret.

2. **Development Servers**: `server.js` and `server.py` are kept in the repository as they're useful for local development.

3. **No Sensitive Data**: No API keys, passwords, or secrets are in the codebase.

## Deployment Steps

### Step 1: Initialize Git Repository (if not done)

```bash
cd /Users/patu/Documents/Projects/portfolioRedesign
git init
```

### Step 2: Add All Files

```bash
git add .
```

### Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: Portfolio website with all features

- Homepage with projects and expertise sections
- About page with bio and companies
- Contact page with form and backend integration
- Case study pages (9 case studies configured)
- Resume pages with password protection
- SEO optimization (sitemap, robots.txt, structured data)
- Responsive design for all devices
- Accessibility features (skip links, ARIA labels)
- Complete documentation"
```

### Step 4: Create GitHub Repository

1. Go to GitHub.com
2. Click "New repository"
3. Name it (e.g., `portfolio-website` or `pawel-tulin-portfolio`)
4. **Do NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

### Step 5: Add Remote and Push

```bash
# Add remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Alternative: Using SSH

```bash
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## Repository Structure

The repository contains:
- `sandbox-new/` - Main project directory with all files (deployed to production)
- `.cpanel.yml` - cPanel deployment configuration
- `.gitignore` - Git ignore rules
- Documentation files (README.md, DEPLOYMENT_GUIDE.md, etc.)

## Branch Structure

- **`main`** - Production branch
  - Auto-deploys to https://disruptiveexperience.com/portfolio/
  - Protected branch (should be stable)
  
- **`develop`** - Development branch
  - For testing new features
  - Merge to main when ready for production

## Post-Deployment

### Current Deployment Setup

The site is deployed via **cPanel Git Version Control**:

1. **Repository**: https://github.com/ptulin/portfolio
2. **Deployment Path**: `/home1/moose/public_html/portfolio/`
3. **Auto-Deploy**: Enabled via `.cpanel.yml`
4. **Source**: Files from `sandbox-new/` directory
5. **Live URL**: https://disruptiveexperience.com/portfolio/

### Deployment Configuration

The `.cpanel.yml` file automatically:
- Copies files from `sandbox-new/` to deployment path
- Sets proper file permissions (644 for files, 755 for directories)
- Executes on every push to `main` branch

### Verifying Deployment

After pushing to `main`:
1. Wait 1-2 minutes for cPanel to process
2. Check https://disruptiveexperience.com/portfolio/
3. Verify all pages load correctly
4. Test forms and functionality

## File Organization Options

### Option 1: Keep sandbox-new folder
- Pros: Organized, clear structure
- Cons: GitHub Pages needs configuration

### Option 2: Move files to root
- Pros: Easier GitHub Pages setup
- Cons: Less organized

**Recommendation**: Keep `sandbox-new/` folder for organization. Use GitHub Pages with proper folder configuration or deploy to a custom hosting service.

## Continuous Deployment

### Current Workflow

**Development:**
```bash
# Work on develop branch
git checkout develop
# Make changes
git add .
git commit -m "Feature: Description"
git push origin develop
```

**Production:**
```bash
# Merge develop to main
git checkout main
git merge develop
git push origin main
# cPanel automatically deploys
```

### Automated Deployment

✅ **Currently Active**: cPanel Git Version Control
- Automatically deploys on push to `main` branch
- No manual steps required
- Deployment configured via `.cpanel.yml`

## Security Notes

✅ **Safe to Commit:**
- Google Apps Script public web app URL (it's public by design)
- All HTML, CSS, JavaScript files
- Images and assets
- Configuration files

❌ **Never Commit:**
- Private API keys
- Passwords
- Secret tokens
- `.env` files with secrets
- Private credentials

## Troubleshooting

### Authentication Issues
If you get authentication errors:
```bash
# Use GitHub CLI
gh auth login

# Or use personal access token
git remote set-url origin https://YOUR_TOKEN@github.com/USERNAME/REPO.git
```

### Large Files
If you have large image files:
- Consider using Git LFS
- Or optimize images before committing
- Or use CDN for images

## Next Steps

1. ✅ Initialize git repository
2. ✅ Create .gitignore
3. ⏭️ Add and commit files
4. ⏭️ Create GitHub repository
5. ⏭️ Push to GitHub
6. ⏭️ Configure GitHub Pages (optional)
7. ⏭️ Set up custom domain (optional)

---

**Ready for deployment!** 🚀

