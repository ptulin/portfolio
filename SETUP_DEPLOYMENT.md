# Setup Automatic Deployment

## Current Issue
Files are on GitHub but not on your server. The cPanel auto-deployment isn't working because it expects files to be in a server-side git repository first.

## Solution: GitHub Actions FTP Deployment

I've created a GitHub Actions workflow that will automatically deploy your files to the server via FTP whenever you push to GitHub.

## Setup Steps

### 1. Get Your FTP Credentials

You need your FTP credentials from HostGator/cPanel:

1. Log into cPanel
2. Go to **"FTP Accounts"** or **"File Manager"**
3. Find your FTP credentials:
   - **FTP Server/Host:** Usually `ftp.disruptiveexperience.com` or `gator3005.hostgator.com`
   - **FTP Username:** Your cPanel username or FTP account username
   - **FTP Password:** Your FTP password

### 2. Add GitHub Secrets

1. Go to your GitHub repository: `https://github.com/ptulin/portfolio`
2. Click **"Settings"** → **"Secrets and variables"** → **"Actions"**
3. Click **"New repository secret"**
4. Add these three secrets:

   **Secret 1:**
   - Name: `FTP_SERVER`
   - Value: Your FTP server (e.g., `ftp.disruptiveexperience.com` or `gator3005.hostgator.com`)

   **Secret 2:**
   - Name: `FTP_USERNAME`
   - Value: Your FTP username

   **Secret 3:**
   - Name: `FTP_PASSWORD`
   - Value: Your FTP password

### 3. Trigger Deployment

Once secrets are added, you can:

**Option A: Automatic (Recommended)**
- Just push any change to the `main` branch
- GitHub Actions will automatically deploy

**Option B: Manual**
- Go to **"Actions"** tab in GitHub
- Select **"Deploy to Server"** workflow
- Click **"Run workflow"**

## What Gets Deployed

The workflow deploys all website files to `/public_html/portfolio/` but excludes:
- `.git` files
- `design/` folder (design mockups)
- `Code.js` (Google Apps Script - not needed on server)
- Documentation files (`.md` files)
- `.cpanel.yml` (deployment config)

## Verify Deployment

After deployment runs (takes 1-2 minutes):
1. Check GitHub Actions tab to see deployment status
2. Verify files appear in cPanel File Manager at `/public_html/portfolio/`
3. Visit `https://disruptiveexperience.com/portfolio/` to see your site

## Troubleshooting

**Deployment fails:**
- Verify FTP credentials are correct in GitHub Secrets
- Check FTP server allows connections (port 21)
- Ensure the `/public_html/portfolio/` directory exists on server

**Files not appearing:**
- Wait 1-2 minutes for deployment to complete
- Check GitHub Actions logs for errors
- Verify FTP path is correct (should be `/public_html/portfolio/`)

---

**Next:** Once files are deployed, complete the backend setup (Google Sheets + Apps Script) as described in `DEPLOYMENT.md`

