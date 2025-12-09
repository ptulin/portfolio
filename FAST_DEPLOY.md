# Fast Deployment Guide

## Quick Manual Deployment

To speed up deployment, you can manually trigger it in cPanel:

1. **Go to cPanel → Git Version Control**
2. **Click "Manage" on your `portfolio` repository**
3. **Click "Update from Remote"** (pulls latest from GitHub)
4. **Click "Deploy HEAD Commit"** (deploys immediately)

This takes ~10-30 seconds instead of waiting 2-5 minutes for auto-deployment.

## Cache Busting

After deployment, if you still see old content:

1. **Hard refresh your browser:**
   - Windows/Linux: `Ctrl + Shift + R` or `Ctrl + F5`
   - Mac: `Cmd + Shift + R`

2. **Or clear browser cache:**
   - Chrome: Settings → Privacy → Clear browsing data → Cached images and files

## Auto-Deployment Speed

cPanel's auto-deployment typically takes 2-5 minutes because:
- It polls GitHub every few minutes
- It needs to detect the push
- Then run the deployment script

**Solution:** Use manual deployment for immediate updates, or wait for auto-deployment.

## Deployment Script Optimization

The `.cpanel.yml` script is optimized to:
- Copy files efficiently
- Set permissions correctly
- Include the new `js/` folder

If deployment seems slow, check cPanel logs at: `~/.cpanel/logs/`

