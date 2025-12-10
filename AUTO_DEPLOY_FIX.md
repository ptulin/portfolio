# Fixing Auto-Deployment

## The Issue

cPanel's auto-deployment uses **polling** (checks GitHub every few minutes) rather than **webhooks** (instant notifications). This causes a 2-5 minute delay normally, but **30+ minutes is NOT normal** and indicates a problem.

## How cPanel Auto-Deployment Actually Works

**Important:** cPanel's Git Version Control **does NOT have an "Auto Deploy" toggle** in the UI. Instead:
- When you push to GitHub, cPanel **polls** (checks) your repository periodically
- If cPanel detects a new commit, it automatically runs `.cpanel.yml`
- The polling interval is controlled **server-side** (you can't change it)

**30+ minute delays mean the polling isn't working properly.**

## Troubleshooting Steps

### Step 1: Verify `.cpanel.yml` Exists and is Correct

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

### Option 1: Set Up GitHub Webhook (Best Solution)

Since cPanel polling is unreliable, set up a GitHub webhook for instant deployment:

1. **Get Webhook URL from Hosting Company:**
   - Contact them and ask: **"What is the webhook URL for cPanel Git Version Control auto-deployment?"**
   - It's usually something like: `https://disruptiveexperience.com/cpanel/webhook` or similar
   - They may need to enable webhook support first

2. **Add Webhook in GitHub:**
   - Go to: `https://github.com/ptulin/portfolio/settings/hooks`
   - Click "Add webhook"
   - **Payload URL:** (use the URL from your hosting company)
   - **Content type:** `application/json`
   - **Events:** Select "Just the push event"
   - **Active:** ✅ Checked
   - Click "Add webhook"

3. **Test:**
   - Make a small change and push
   - Deployment should happen within seconds (not minutes)

### Option 2: Contact Your Hosting Company

**30+ minute delays are NOT normal.** Contact your hosting company and ask:

1. **"What is the polling interval for Git Version Control?"** (should be 2-5 minutes, not 30+)
2. **"Can you check the deployment logs for errors?"** (logs at `/home1/moose/.cpanel/logs/`)
3. **"Can you enable webhook support for instant deployments?"**
4. **"Is the Git polling service running on the server?"**

**Why contact them:**
- They control the polling interval (you can't change it)
- They can check server-side logs
- They can enable webhook support
- They can verify the Git polling service is running

### Option 3: Set Up Manual Cron Job (Advanced)

If webhooks aren't available, you could set up a cron job to check for updates every few minutes. This requires SSH access:

1. **SSH into your server**
2. **Create a deployment script:**
   ```bash
   #!/bin/bash
   cd /home1/moose/repositories/portfolio
   git fetch origin
   if [ $(git rev-parse HEAD) != $(git rev-parse origin/main) ]; then
       git pull origin main
       # Trigger .cpanel.yml deployment
       # (cPanel should auto-detect, or manually run deployment)
   fi
   ```

3. **Add to crontab:**
   ```bash
   */5 * * * * /path/to/deployment-script.sh
   ```

**Note:** This is more complex and may not be necessary if webhooks can be enabled.

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

