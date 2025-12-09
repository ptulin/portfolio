# cPanel Automatic Deployment Setup

## The Issue
Your `.cpanel.yml` is configured correctly, but cPanel needs the Git repository to be set up on the server first. The deployment expects files at `/home1/moose/repositories/portfolio/` but that repository doesn't exist yet.

## Solution: Set Up Git Repository in cPanel

### Step 1: Access Git Version Control in cPanel

1. Log into your cPanel
2. Find **"Git Version Control"** (usually under "Files" section)
3. Click on it

### Step 2: Create New Repository

1. Click **"Create"** button
2. Fill in the details:
   - **Repository Name:** `portfolio`
   - **Repository Path:** `/home1/moose/repositories/portfolio` (or let cPanel auto-fill)
   - **Clone URL:** `https://github.com/ptulin/portfolio.git`
   - **Branch:** `main`
   - **Auto Deploy:** ✅ **Enable this** (this is key!)
3. Click **"Create"**

### Step 3: Initial Clone

cPanel will automatically:
- Clone your GitHub repository to `/home1/moose/repositories/portfolio/`
- Detect the `.cpanel.yml` file
- Set up automatic deployment

### Step 4: Verify Deployment

After setup:
1. Check that files appear in `/home1/moose/public_html/portfolio/`
2. Visit `https://disruptiveexperience.com/portfolio/`
3. The deployment should happen automatically on future pushes

## How It Works After Setup

1. **You push to GitHub** → Code goes to `github.com/ptulin/portfolio`
2. **cPanel detects the push** → Via webhook or polling
3. **cPanel pulls latest changes** → Updates `/home1/moose/repositories/portfolio/`
4. **`.cpanel.yml` runs** → Executes the rsync command
5. **Files deploy** → Synced to `/home1/moose/public_html/portfolio/`

## Troubleshooting

**Repository already exists?**
- Go to Git Version Control
- Find `portfolio` repository
- Click **"Manage"**
- Click **"Pull or Deploy"** to trigger manual deployment
- Or click **"Edit"** to verify settings

**Auto Deploy not working?**
- Verify `.cpanel.yml` is in the root of your repo (it is ✅)
- Check deployment path matches: `/home1/moose/public_html/portfolio/`
- Review cPanel deployment logs in File Manager: `~/.cpanel/logs/`

**Need to trigger manual deployment?**
- In Git Version Control, click **"Manage"** on your repository
- Click **"Pull or Deploy"** button

## Alternative: If Git Version Control Not Available

If you don't have Git Version Control in cPanel, you can:
1. Use SSH to connect to your server
2. Manually clone the repository:
   ```bash
   cd /home1/moose/repositories/
   git clone https://github.com/ptulin/portfolio.git
   cd portfolio
   ```
3. Set up a post-receive hook or cron job to run the deployment

But the cPanel Git Version Control method is much easier and fully automatic!

---

**Once this is set up, all future pushes to GitHub will automatically deploy to your server!** 🚀

