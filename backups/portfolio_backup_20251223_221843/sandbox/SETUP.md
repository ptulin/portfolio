# Quick Setup Guide

## If you encounter npm permission errors:

1. Fix npm cache permissions:
```bash
sudo chown -R $(whoami) ~/.npm
```

2. Or use a different approach - clear npm cache:
```bash
npm cache clean --force
```

3. Then install:
```bash
npm install
```

## Alternative: Use yarn instead of npm

If npm continues to have issues, you can use yarn:

```bash
# Install yarn if you don't have it
npm install -g yarn

# Then use yarn instead
yarn install
yarn dev
```

## Running the project

Once dependencies are installed:

```bash
npm run dev
```

The site will be available at http://localhost:5173

## What's included

✅ All React components (Navigation, Hero, Work, Contact, Footer)
✅ Tailwind CSS configuration matching the original
✅ All 8 Unsplash images downloaded and organized
✅ Google Fonts (Syne, DM Sans) configured
✅ Exact styling and layout matching the original website
✅ Responsive design for mobile and desktop

## Project is ready to use!

All files are in the `/sandbox` directory, completely isolated from your main production project.

