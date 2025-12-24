# Portfolio Website - Pawel Tulin

A modern, responsive portfolio website showcasing AI-driven product design work and case studies.

## 🌐 Live Site & Repository

**Live Website**: https://disruptiveexperience.com/pawel/  
**GitHub Repository**: https://github.com/ptulin/portfolio

## 🚀 Quick Start

### Local Development

Navigate to the `sandbox-new` directory and start a local server:

**Option 1: Node.js Server**
```bash
cd sandbox-new
node server.js
```
Access at: http://localhost:5177

**Option 2: Python Server**
```bash
cd sandbox-new
python3 server.py
```
Access at: http://localhost:5177

## 📁 Project Structure

```
portfolioRedesign/
├── sandbox-new/          # Main project directory (deployed to production)
│   ├── index.html        # Homepage
│   ├── about.html        # About page
│   ├── contact.html      # Contact form page
│   ├── case-study.html   # Case study template
│   ├── 404.html          # Error page
│   ├── resume/           # Resume pages
│   ├── common.css        # Unified stylesheet
│   ├── common.js         # Unified JavaScript
│   ├── config.js         # Configuration
│   └── ...               # See sandbox-new/README.md for full structure
├── .cpanel.yml           # cPanel deployment configuration
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🔀 Git Branches

- **`main`** - Production branch (auto-deploys to https://disruptiveexperience.com/pawel/)
- **`develop`** - Development branch (for testing and new features)

## 🚢 Deployment

The site is automatically deployed via cPanel Git Version Control:

1. Push changes to GitHub: `git push origin main`
2. cPanel automatically pulls and deploys via `.cpanel.yml`
3. Files sync to `/home1/moose/public_html/portfolio/`

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

## 📚 Documentation

All detailed documentation is in the `sandbox-new` directory:

- **sandbox-new/README.md** - Complete project overview and quick start
- **sandbox-new/ARCHITECTURE.md** - Architecture and extensibility guide
- **sandbox-new/OPTIMIZATION_SUMMARY.md** - Code optimizations
- **sandbox-new/DEPLOYMENT_CHECKLIST.md** - Deployment guide
- **sandbox-new/PROJECT_SUCCESS_SUMMARY.md** - Feature summary
- **sandbox-new/RESPONSIVE_DESIGN_CHECKLIST.md** - Responsive design details
- **DEPLOYMENT_GUIDE.md** - GitHub deployment instructions

## ✨ Features

- **Responsive Design**: Mobile-first, works on all devices
- **Dynamic Content**: Case studies loaded based on URL parameters
- **Form Handling**: Contact form and resume password verification
- **SEO Optimized**: Sitemap, robots.txt, structured data
- **Accessibility**: WCAG compliant with skip links and ARIA labels
- **Performance**: Optimized assets, lazy loading, deferred scripts

## 🔧 Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Flexbox, Grid
- **JavaScript (ES6+)**: Vanilla JS, no frameworks
- **Backend**: Google Apps Script integration
- **No Build Tools**: Pure static files

## 📝 License

All rights reserved. This portfolio website is proprietary.

---

**Version**: 2.1.0  
**Author**: Pawel Tulin  
**Status**: ✅ Production Ready
