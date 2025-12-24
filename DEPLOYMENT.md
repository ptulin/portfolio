# Deployment Guide

## 🚀 Production Deployment Process

### Prerequisites
- GitHub repository access
- cPanel access with Git Version Control enabled
- Backup of current production files (if updating existing site)

### Step-by-Step Deployment

#### 1. Archive Current Branch (One-Time Setup)

```bash
# From project root
cd /Users/patu/Documents/Projects/portfolioRedesign

# Commit any pending changes
git add .
git commit -m "Final commit before production cleanup"

# Create archive branch
git checkout -b archive/prototype-v1
git push origin archive/prototype-v1

# Return to main branch
git checkout main
```

#### 2. Prepare Production Branch

```bash
# Create new main branch from production folder
git checkout -b main-production

# Copy production files to root (temporary)
cp -r production/* .

# Stage all production files
git add .

# Commit production-ready code
git commit -m "Production-ready portfolio website

- Clean, optimized codebase
- Standardized file naming conventions
- Professional documentation
- All case studies with custom themes
- SEO optimized
- Performance optimized"

# Push to GitHub
git push origin main-production
```

#### 3. Update Main Branch

```bash
# Switch to main
git checkout main

# Merge production branch
git merge main-production

# Force push (if needed, after review)
git push origin main --force
```

#### 4. Deploy via cPanel

1. Log into cPanel
2. Navigate to **Git Version Control**
3. Click **Pull or Deploy** for your repository
4. Select `main` branch
5. Click **Update from Repository**
6. Files will be deployed to your public_html directory

#### 5. Verify Deployment

- [ ] Homepage loads: https://disruptiveexperience.com/pawel/
- [ ] All case studies accessible
- [ ] Images load correctly
- [ ] Forms work (contact, resume)
- [ ] Mobile responsive
- [ ] SEO files accessible (sitemap.xml, robots.txt)

## 📋 Post-Deployment Checklist

- [ ] Test all navigation links
- [ ] Verify all images load
- [ ] Test contact form submission
- [ ] Test resume password access
- [ ] Check mobile responsiveness
- [ ] Verify SEO meta tags
- [ ] Test 404 error page
- [ ] Check browser console for errors
- [ ] Run Lighthouse audit (target: >90)

## 🔄 Future Updates

For future updates:

1. Make changes in `production/` folder
2. Test locally
3. Commit and push to `main` branch
4. Pull via cPanel Git Version Control

## 🆘 Rollback Procedure

If something goes wrong:

```bash
# Revert to previous commit
git revert HEAD

# Or restore from backup
# Use backup script: ./backup-current-state.sh
```

## 📞 Support

For issues or questions, refer to:
- `docs/ARCHITECTURE.md` - Technical architecture
- `docs/DEPLOYMENT_CHECKLIST.md` - Detailed checklist
- `README.md` - Project overview

