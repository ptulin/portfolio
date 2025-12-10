# Requests for Hosting Provider

## Quick List

Please provide the following to enable automated deployment:

1. **SSH Access**
   - Enable SSH access for my cPanel account
   - Provide SSH hostname/port
   - Confirm SSH key authentication is supported

2. **SSH Credentials**
   - cPanel username: `moose` (or confirm the correct username)
   - SSH hostname/domain
   - Port (usually 22)

3. **Git Webhook Support** (Optional but preferred)
   - Can you enable GitHub webhook support for cPanel Git Version Control?
   - This would allow instant deployments instead of polling (currently 30+ minute delays)

4. **Current Setup**
   - Repository path: `/home1/moose/repositories/portfolio/`
   - Deployment path: `/home1/moose/public_html/portfolio/`
   - Domain: `disruptiveexperience.com/portfolio`

---

## What I Need

**For SSH Deployment:**
- SSH hostname: `?`
- SSH username: `moose` (confirm)
- SSH port: `22` (confirm)
- SSH key authentication: `enabled?`

**For Webhook Deployment (better option):**
- Webhook URL for GitHub → cPanel integration
- Or instructions to set up webhook in cPanel

---

## Current Issue

cPanel auto-deployment is taking 30+ minutes instead of the expected 2-5 minutes. This is likely due to slow polling intervals. A webhook would solve this instantly.

