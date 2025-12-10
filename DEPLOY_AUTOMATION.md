# Automated Deployment Setup

## Quick Deploy (Current - Manual)

Right now, the easiest way to deploy is:

```bash
./deploy.sh
```

This will:
1. Push your changes to GitHub
2. Remind you to deploy manually in cPanel

## Automated Deployment via SSH

To enable **automatic deployment** (no manual cPanel steps needed):

### Step 1: Set Up SSH Access

1. **Get your SSH credentials from your hosting provider:**
   - SSH hostname (usually your domain or a specific SSH host)
   - cPanel username
   - SSH key or password

2. **Set up SSH key authentication** (recommended):
   ```bash
   ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
   ssh-copy-id your-username@your-server.com
   ```

### Step 2: Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```
CPANEL_HOST=your-server.com
CPANEL_USER=your-cpanel-username
CPANEL_SSH_KEY=~/.ssh/id_rsa  # Optional, defaults to ~/.ssh/id_rsa
```

**Important:** `.env` is already in `.gitignore` - your credentials won't be committed!

### Step 3: Deploy Automatically

Now you can deploy with one command:

```bash
./deploy.sh
```

The script will:
1. ✅ Check for uncommitted changes
2. 📤 Push to GitHub
3. 🔌 Connect to your server via SSH
4. 📥 Pull latest changes
5. 🚀 Deploy files automatically
6. ✅ Set correct permissions

## Alternative: GitHub Actions (Advanced)

If you prefer GitHub Actions for deployment, we can set that up too. It would:
- Trigger on every push to `main`
- Deploy via SSH automatically
- No local setup needed

Would you like me to set up GitHub Actions instead?

## Current Status

Right now, the script works in "manual mode":
- ✅ Pushes to GitHub
- ⚠️  Requires manual deployment in cPanel

To enable full automation, set up SSH credentials as described above.

