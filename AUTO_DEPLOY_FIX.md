# Fixing Auto-Deployment

## The Issue

cPanel's auto-deployment uses **polling** (checks GitHub every few minutes) rather than **webhooks** (instant notifications). This causes a 2-5 minute delay normally, but **30+ minutes is NOT normal** and indicates a problem.

## Troubleshooting Steps

### Step 1: Verify Auto-Deploy is Actually Enabled

1. **In cPanel → Git Version Control:**
   - Click "Manage" on your `portfolio` repository
   - Look for an "Edit" button or settings icon
   - Check if "Auto Deploy" or "Deploy on Push" is **checked/enabled**
   - If it's disabled, enable it and save

### Step 2: Check Deployment Logs

1. **In cPanel → File Manager:**
   - Navigate to: `~/.cpanel/logs/` (or `/home1/moose/.cpanel/logs/`)
   - Look for files like `deploy-*.log` or `git-*.log`
   - Check for error messages

2. **In cPanel → Git Version Control:**
   - Click "Manage" on `portfolio`
   - Look for a "Logs" or "History" tab
   - Check for failed deployment attempts

### Step 3: Test the Deployment Script

The `.cpanel.yml` script should work, but let's verify:
- Make a small change (add a comment to `index.html`)
- Push to GitHub
- Wait 5 minutes
- Check if it auto-deploys

If it doesn't work after 5 minutes, **auto-deploy is likely broken**.

### Step 4: Check for Errors in `.cpanel.yml`

The current script uses `/bin/cp` commands. If any command fails, the whole deployment might stop. Check:
- Are all paths correct? (`/home1/moose/public_html/portfolio/`)
- Are permissions correct? (should be 644 for files, 755 for directories)

## Solutions

### Option 1: Contact Your Hosting Company (Recommended)

**30+ minute delays are NOT normal.** Contact your hosting company and ask:

1. **"Is auto-deploy actually enabled for my Git repository?"**
2. **"What is the polling interval for Git Version Control?"** (should be 2-5 minutes)
3. **"Are there any errors in the deployment logs?"**
4. **"Can you enable webhook support for instant deployments?"**

**Why contact them:**
- They can check server-side logs
- They can verify if auto-deploy is actually running
- They might be able to enable webhooks
- They can check if there are server-side issues

### Option 2: Enable GitHub Webhook (Best - if available)

1. **In cPanel → Git Version Control:**
   - Click "Manage" on your `portfolio` repository
   - Look for "Webhook" or "Auto Deploy" settings
   - Enable webhook if available
   - **Note the webhook URL** (cPanel will provide this)

2. **In GitHub:**
   - Go to: `https://github.com/ptulin/portfolio/settings/hooks`
   - Click "Add webhook"
   - Payload URL: (use the URL from cPanel)
   - Content type: `application/json`
   - Events: Select "Just the push event"
   - Save

This makes deployment instant (within seconds of pushing).

### Option 3: Use Manual Deployment (Current Workaround)

For immediate updates, manually trigger:
1. cPanel → Git Version Control
2. Manage → Update from Remote → Deploy HEAD Commit

Takes 10-30 seconds.

## Why Auto-Deploy Might Be Broken

Possible causes:
- **Auto-deploy not actually enabled** (most common)
- **Polling service not running** on the server
- **Deployment script errors** (`.cpanel.yml` failing silently)
- **Permission issues** preventing script execution
- **Server-side configuration** blocking auto-deployment

## Recommendation

1. **First:** Contact your hosting company to verify auto-deploy is working
2. **Second:** Ask if they can enable webhook support for instant deployments
3. **For now:** Use manual deployment (Update from Remote → Deploy HEAD Commit) - it's fast and reliable

**30+ minute delays are a server-side issue that your hosting company should fix.**

