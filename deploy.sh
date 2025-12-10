#!/bin/bash

# Portfolio Deployment Script
# This script automates deployment to cPanel server via SSH

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Portfolio Deployment Script${NC}"
echo ""

# Check if SSH credentials are configured
if [ -z "$CPANEL_HOST" ] || [ -z "$CPANEL_USER" ]; then
    echo -e "${YELLOW}⚠️  SSH credentials not configured.${NC}"
    echo ""
    echo "To enable automatic deployment, set these environment variables:"
    echo "  export CPANEL_HOST='your-server.com'"
    echo "  export CPANEL_USER='your-cpanel-username'"
    echo ""
    echo "Or create a .env file with:"
    echo "  CPANEL_HOST=your-server.com"
    echo "  CPANEL_USER=your-cpanel-username"
    echo ""
    echo -e "${YELLOW}For now, pushing to GitHub. Please deploy manually in cPanel.${NC}"
    echo ""
    
    # Push to GitHub
    echo "📤 Pushing to GitHub..."
    git push origin main
    
    echo ""
    echo -e "${GREEN}✅ Code pushed to GitHub!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Go to cPanel → Git Version Control"
    echo "2. Click 'Manage' on your portfolio repository"
    echo "3. Click 'Update from Remote'"
    echo ""
    exit 0
fi

# Load .env file if it exists
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Configuration
REPO_PATH="/home1/moose/repositories/portfolio"
DEPLOY_PATH="/home1/moose/public_html/portfolio"
SSH_KEY="${CPANEL_SSH_KEY:-~/.ssh/id_rsa}"

echo "📋 Configuration:"
echo "   Host: $CPANEL_HOST"
echo "   User: $CPANEL_USER"
echo "   Repo: $REPO_PATH"
echo "   Deploy: $DEPLOY_PATH"
echo ""

# Check if we have uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes.${NC}"
    echo "Please commit and push your changes first."
    exit 1
fi

# Push to GitHub first
echo "📤 Pushing to GitHub..."
git push origin main

# Deploy via SSH
echo ""
echo "🔌 Connecting to server..."
ssh -i "$SSH_KEY" ${CPANEL_USER}@${CPANEL_HOST} << EOF
    set -e
    echo "📥 Pulling latest changes..."
    cd $REPO_PATH
    git pull origin main
    
    echo "🚀 Deploying files..."
    # The .cpanel.yml will handle deployment, but we can also run it manually
    cd $REPO_PATH
    
    # Copy files
    /bin/cp -f index.html $DEPLOY_PATH/index.html
    /bin/cp -f about.html $DEPLOY_PATH/about.html
    /bin/cp -f contact.html $DEPLOY_PATH/contact.html
    /bin/cp -f styles.css $DEPLOY_PATH/styles.css
    /bin/cp -f script.js $DEPLOY_PATH/script.js
    /bin/cp -rf assets $DEPLOY_PATH/ 2>/dev/null || true
    /bin/cp -rf auth $DEPLOY_PATH/ 2>/dev/null || true
    /bin/cp -rf resume $DEPLOY_PATH/ 2>/dev/null || true
    /bin/cp -rf case-studies $DEPLOY_PATH/ 2>/dev/null || true
    /bin/cp -rf js $DEPLOY_PATH/ 2>/dev/null || true
    
    # Set permissions
    chmod -R 755 $DEPLOY_PATH
    find $DEPLOY_PATH -type f -exec chmod 644 {} \;
    find $DEPLOY_PATH -type d -exec chmod 755 {} \;
    
    echo "✅ Deployment complete!"
EOF

echo ""
echo -e "${GREEN}✅ Deployment successful!${NC}"
echo ""
echo "🌐 Your site should be live at: https://disruptiveexperience.com/portfolio/"
echo ""
echo "💡 Tip: Hard refresh (Cmd+Shift+R) to clear cache if needed."

