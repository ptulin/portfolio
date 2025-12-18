# GitHub Deployment Guide

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

The repository will contain:
- `sandbox-new/` - Main project directory with all files
- `.gitignore` - Git ignore rules
- Documentation files

## Post-Deployment

### GitHub Pages Setup (Optional)

If you want to host the site on GitHub Pages:

1. Go to repository Settings
2. Navigate to "Pages"
3. Select source branch: `main`
4. Select folder: `/sandbox-new` (or root if you move files)
5. Click "Save"

**Note**: GitHub Pages serves from root or `/docs` folder. You may need to:
- Move files to root, or
- Use a custom domain with proper configuration

### Custom Domain Setup (Optional)

1. Add `CNAME` file in repository root:
   ```
   yourdomain.com
   ```

2. Configure DNS:
   - Type: CNAME
   - Name: @ or www
   - Value: YOUR_USERNAME.github.io

## File Organization Options

### Option 1: Keep sandbox-new folder
- Pros: Organized, clear structure
- Cons: GitHub Pages needs configuration

### Option 2: Move files to root
- Pros: Easier GitHub Pages setup
- Cons: Less organized

**Recommendation**: Keep `sandbox-new/` folder for organization. Use GitHub Pages with proper folder configuration or deploy to a custom hosting service.

## Continuous Deployment

### Manual Deployment
```bash
git add .
git commit -m "Update: Description of changes"
git push origin main
```

### Automated Deployment (Future)
- Set up GitHub Actions
- Configure deployment to hosting service
- Add automated testing

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

