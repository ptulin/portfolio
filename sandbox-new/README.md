# Portfolio Website - Pawel Tulin

A modern, responsive portfolio website showcasing AI-driven product design work and case studies.

## 🚀 Quick Start

### Repository

**GitHub**: https://github.com/ptulin/portfolio  
**Live Site**: https://disruptiveexperience.com/pawel/

### Local Development

Navigate to the `sandbox-new` directory:

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
sandbox-new/
├── index.html              # Homepage
├── about.html              # About page
├── contact.html            # Contact form page
├── case-study.html         # Case study template (dynamic)
├── resume/
│   ├── index.html         # Resume password entry
│   └── access.html        # Resume display (protected)
├── common.css              # Unified stylesheet
├── common.js               # Unified JavaScript
├── config.js               # Configuration & routing
├── case_studies_data.js    # Case study content data
├── js/
│   └── utils.js           # Backend integration utilities
├── images/                 # Image assets
├── server.js               # Node.js dev server
├── server.py               # Python dev server
├── ARCHITECTURE.md         # Architecture documentation
├── OPTIMIZATION_SUMMARY.md  # Optimization details
└── README.md               # This file
```

## ✨ Features

### Pages

1. **Homepage** (`index.html`)
   - Hero section with availability badge
   - Featured projects grid
   - Expertise areas
   - Contact section
   - Smooth scrolling navigation

2. **About Page** (`about.html`)
   - Professional bio
   - Companies worked with
   - Contact CTA

3. **Contact Page** (`contact.html`)
   - Contact form with validation
   - Resume password request option
   - Password retrieval link
   - Google Apps Script backend integration

4. **Case Study Pages** (`case-study.html?project=slug`)
   - Dynamic content loading based on URL parameter
   - Overview cards
   - Process steps
   - Results and impact
   - Challenges and insights
   - Back to portfolio link

5. **Resume Pages** (`resume/`)
   - Password-protected access
   - Session-based authentication
   - Access logging
   - PDF download option

### Technical Features

- **Responsive Design**: Mobile-first, works on all devices
- **Dynamic Content**: Case studies loaded based on URL parameters
- **Form Handling**: Contact form and resume password verification via Google Apps Script
- **Smooth Scrolling**: Enhanced navigation experience
- **Accessibility**: WCAG compliant, semantic HTML, ARIA labels, skip links
- **Performance**: Optimized assets, lazy loading, deferred scripts
- **SEO**: Complete SEO optimization with sitemap, robots.txt, structured data (JSON-LD)
- **Error Handling**: Custom 404 page, graceful degradation
- **Form Validation**: Enhanced client-side validation with real-time feedback

## 🔧 Configuration

### Case Studies

Case studies are configured in `config.js`:

```javascript
const CASE_STUDIES = {
    'project-slug': {
        title: 'Project Title',
        company: 'Company Name',
        slug: 'project-slug',
        category: 'Category',
        meta: {
            duration: 'X Months',
            teamSize: 'X Members',
            role: 'Your Role'
        }
    }
};
```

Content for case studies is stored in `case_studies_data.js`.

### Backend Integration

The website integrates with Google Apps Script for:
- Contact form submissions
- Resume password verification
- Access logging

Configuration in `js/utils.js`:
```javascript
const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL';
```

## 📝 Adding New Content

### Adding a Case Study

1. **Add to Config** (`config.js`):
   ```javascript
   'new-project': {
       title: 'New Project',
       company: 'Company',
       slug: 'new-project',
       // ...
   }
   ```

2. **Add Content** (`case_studies_data.js`):
   ```javascript
   'new-project': {
       overview: [...],
       process: [...],
       results: [...],
       // ...
   }
   ```

3. **Link from Homepage** (`common.js`):
   ```javascript
   {
       company: "Company",
       title: "Project",
       caseStudySlug: "new-project"
   }
   ```

### Adding a New Page

1. Create HTML file with body class: `newpage-page`
2. Add CSS with `.newpage-*` prefix in `common.css`
3. Add JavaScript with `newpage*` prefix in `common.js`
4. Update page detection in `common.js` init function

See `ARCHITECTURE.md` for detailed instructions.

## 🎨 Design System

### CSS Naming Conventions

- **Shared**: Generic names (`.btn`, `.container`)
- **Page-specific**: Prefix pattern (`.homepage-*`, `.casestudy-*`, `.aboutpage-*`)

### JavaScript Naming

- **Shared utilities**: Generic names (`escapeHtml`, `initSmoothScroll`)
- **Page-specific**: Prefix pattern (`homepage*`, `casestudy*`, `aboutpage*`)

## 📚 Documentation

- **README.md**: This file - quick start and overview
- **ARCHITECTURE.md**: Detailed architecture and extensibility guide
- **OPTIMIZATION_SUMMARY.md**: Code optimizations and best practices
- **DEPLOYMENT_CHECKLIST.md**: Step-by-step deployment guide
- **PROJECT_SUCCESS_SUMMARY.md**: Complete summary of all enhancements

## 🚢 Deployment

### Pre-Deployment Checklist

- [ ] Minify CSS and JavaScript
- [ ] Optimize images (WebP format)
- [ ] Remove console.log statements
- [ ] Add sitemap.xml
- [ ] Add robots.txt
- [ ] Verify all links work
- [ ] Test forms and backend integration
- [ ] Test on multiple browsers
- [ ] Run Lighthouse audit (target: >90)
- [ ] Verify HTTPS is enabled
- [ ] Set up analytics

### Deployment Steps

1. **Build/Minify Assets** (if using build process)
2. **Upload Files** to hosting provider
3. **Configure Server**:
   - Enable gzip compression
   - Set cache headers
   - Configure HTTPS
4. **Verify**:
   - All pages load correctly
   - Forms submit successfully
   - Links work properly
   - Mobile responsiveness

## 🛠️ Production Preparation

### Run Production Checklist

```bash
node prepare-production.js
```

This script validates:
- All core files are present
- File sizes are within recommendations
- SEO files exist (sitemap.xml, robots.txt)
- Provides optimization recommendations

## 🧪 Testing

### Manual Testing Checklist

- [x] Homepage loads and displays correctly
- [x] Navigation links work on all pages
- [x] Case study pages load with correct content
- [x] Contact form submits successfully
- [x] Resume password verification works
- [x] Mobile menu functions correctly
- [x] Smooth scrolling works
- [x] All images load
- [x] Footer links work
- [x] Brand logo links to homepage
- [x] 404 error page works
- [x] Skip links work (keyboard navigation)
- [x] Form validation works

### Browser Testing

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Common Issues

**Links not working:**
- Check relative paths (use `../` for subdirectories)
- Verify file names match exactly
- Check for typos in href attributes

**Forms not submitting:**
- Verify `APPS_SCRIPT_URL` in `js/utils.js`
- Check browser console for errors
- Verify Google Apps Script is deployed as web app

**Case study not loading:**
- Check URL parameter: `?project=slug`
- Verify slug exists in `config.js`
- Check browser console for errors

**Styles not applying:**
- Verify CSS file path is correct
- Check for CSS conflicts
- Clear browser cache

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review browser console for errors
3. Verify file paths and configurations
4. Test in different browsers

## 📄 License

All rights reserved. This portfolio website is proprietary.

---

**Version**: 2.1.0  
**Last Updated**: 2025-01-XX  
**Author**: Pawel Tulin

