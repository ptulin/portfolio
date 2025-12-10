# Fixing Auto-Deployment

## The Issue

cPanel's auto-deployment uses **polling** (checks GitHub every few minutes) rather than **webhooks** (instant notifications). This causes a 2-5 minute delay.

## Solutions

### Option 1: Enable GitHub Webhook (Best - if available)

1. **In cPanel → Git Version Control:**
   - Click "Manage" on your `portfolio` repository
   - Look for "Webhook" or "Auto Deploy" settings
   - Enable webhook if available

2. **In GitHub:**
   - Go to your repository: `https://github.com/ptulin/portfolio`
   - Settings → Webhooks → Add webhook
   - Payload URL: (cPanel will provide this, usually something like `https://yourdomain.com/cpanel/webhook`)
   - Content type: `application/json`
   - Events: Select "Just the push event"
   - Save

This makes deployment instant (within seconds of pushing).

### Option 2: Check Auto-Deploy Settings

1. **In cPanel → Git Version Control:**
   - Click "Manage" on `portfolio`
   - Click "Edit" or check settings
   - Verify "Auto Deploy" is enabled
   - Check "Deploy on Push" or similar option

### Option 3: Use Manual Deployment (Current Workaround)

For immediate updates, manually trigger:
1. cPanel → Git Version Control
2. Manage → Update from Remote → Deploy HEAD Commit

Takes 10-30 seconds.

## Why Auto-Deploy is Slow

cPanel's Git Version Control typically:
- Polls GitHub every 2-5 minutes
- Doesn't use webhooks by default
- Has a delay between push and detection

**Note:** Some cPanel versions support webhooks, but it depends on your hosting provider's configuration.

## Recommendation

For now, use **manual deployment** for immediate updates. It's fast and reliable. Auto-deployment will still work for background updates.

