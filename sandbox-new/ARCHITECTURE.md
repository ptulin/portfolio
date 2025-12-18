# Portfolio Architecture Documentation

## Overview

This portfolio website is built with a modular, extensible architecture that supports multiple page types while maintaining clean separation of concerns.

## File Structure

```
sandbox-new/
├── index.html              # Homepage
├── about.html              # About page
├── contact.html            # Contact form page
├── case-study.html         # Case study page template (dynamic)
├── 404.html                # Custom error page
├── resume/
│   ├── index.html         # Resume password entry
│   └── access.html        # Resume display (protected)
├── common.css              # Unified stylesheet for all pages
├── common.js               # Unified JavaScript for all pages
├── config.js               # Configuration and routing
├── case_studies_data.js    # Case study content data
├── js/
│   └── utils.js           # Backend integration utilities
├── images/                 # Image assets
├── sitemap.xml             # SEO sitemap
├── robots.txt              # SEO robots file
├── server.js               # Node.js development server
├── server.py               # Python development server
├── prepare-production.js   # Production preparation script
├── ARCHITECTURE.md         # This file
├── OPTIMIZATION_SUMMARY.md # Optimization details
├── DEPLOYMENT_CHECKLIST.md # Deployment guide
├── PROJECT_SUCCESS_SUMMARY.md # Success summary
└── README.md               # Project overview
```

## Architecture Principles

### 1. Naming Conventions

**CSS Classes:**
- **Shared components**: Generic names (e.g., `.btn`, `.container`, `.navbar`)
- **Homepage-specific**: `.homepage-*` prefix (e.g., `.homepage-hero`, `.homepage-project-card`)
- **Case study-specific**: `.casestudy-*` prefix (e.g., `.casestudy-hero-section`, `.casestudy-overview-card`)
- **About page**: `.aboutpage-*` prefix (e.g., `.aboutpage-hero`, `.aboutpage-companies-section`)
- **Contact page**: `.contactpage-*` prefix (e.g., `.contactpage-form`, `.contactpage-btn-submit`)
- **Resume pages**: `.resumepage-*` and `.resumeaccess-*` prefixes
- **Future pages**: Use consistent prefix pattern (e.g., `.blogpage-*`)

**JavaScript Functions:**
- **Shared utilities**: Generic names (e.g., `escapeHtml`, `initSmoothScroll`, `setCurrentYear`)
- **Homepage-specific**: `homepage*` prefix (e.g., `homepageRenderProjects`, `homepageInit`)
- **Case study-specific**: `casestudy*` prefix (e.g., `casestudyRenderOverviewCards`, `casestudyInit`)
- **Backend integration**: `submitToAppsScript` in `js/utils.js` for Google Apps Script communication

**Data Structures:**
- **Homepage data**: `homepagePROJECTS`, `homepageEXPERTISE_AREAS`
- **Case study data**: `casestudyOverviewCards`, `casestudyProcessSteps`, etc.

### 2. Page Detection

Pages are identified by:
1. **Body class**: Primary method (e.g., `homepage-page`, `casestudy-page`, `aboutpage-page`, `contactpage-page`, `resumepage-page`, `resumeaccess-page`)
2. **DOM elements**: Fallback detection (e.g., `#projectsGrid` for homepage, `#overviewGrid` for case study)

### 3. Configuration System

The `config.js` file provides:
- **Case study routing**: Centralized case study definitions (9 case studies configured)
- **Navigation links**: Consistent navigation across pages
- **Contact information**: Reusable contact data
- **Site metadata**: SEO and social sharing data

### 4. Backend Integration

The `js/utils.js` file handles:
- **Google Apps Script integration**: Form submissions via iframe method (avoids CORS)
- **Contact form**: Submits to backend with action `requestAccess`
- **Resume password verification**: Validates access codes with action `verifyPassword`
- **Access logging**: Logs resume access with action `logAccess`
- **Password retrieval**: Handles forgot password requests with action `forgotPassword`

### 5. SEO & Discoverability

**Files:**
- `sitemap.xml`: Complete sitemap with all pages and case studies
- `robots.txt`: Search engine crawling configuration
- **Structured Data (JSON-LD)**: Added to homepage, about, and contact pages
  - Person schema on homepage and about page
  - ContactPage schema on contact page

### 6. Accessibility Features

**Implemented:**
- Skip-to-main-content links (visible on focus)
- Proper semantic HTML landmarks (`<main>`, `<nav>`, `<header>`, `<footer>`)
- ARIA labels and roles throughout
- Keyboard navigation support
- Focus management and visible focus states

### 7. Error Handling

**404 Page:**
- Custom `404.html` error page
- Professional design matching site aesthetic
- Navigation options (Home, Contact)
- Consistent user experience

**JavaScript:**
- Try-catch blocks in critical functions
- Graceful degradation
- User-friendly error messages
- Console logging for debugging

### 8. Production Tools

**Build Script:**
- `prepare-production.js`: Automated validation script
  - Checks all core files exist
  - Validates file sizes
  - Provides optimization recommendations
  - Color-coded output for easy reading

## Pages Overview

### Homepage (`index.html`)
- Hero section with availability badge
- Featured projects grid (links to case studies)
- Expertise areas section
- Contact section with email and LinkedIn
- Smooth scrolling navigation

### About Page (`about.html`)
- Professional bio section
- Companies worked with section
- Contact CTA section

### Contact Page (`contact.html`)
- Contact form (name, email, phone, message)
- Resume password request checkbox
- Password retrieval link
- Form validation and submission via Google Apps Script

### Case Study Pages (`case-study.html?project=slug`)
- Dynamic content loading based on URL parameter
- Overview cards section
- Process steps section
- Results and impact section
- Challenges and insights section
- Back to portfolio link

### Resume Pages (`resume/`)
- **Password Entry** (`index.html`): Form to enter access code
- **Resume Display** (`access.html`): Protected resume view with session verification

## Adding a New Case Study

### Step 1: Add to Configuration

In `config.js`, add a new entry to `CASE_STUDIES`:

```javascript
const CASE_STUDIES = {
    'fiserv-cfo-ai-automation': { ... },
    'new-project-slug': {
        title: 'New Project Title',
        company: 'Company Name',
        slug: 'new-project-slug',
        category: 'Category',
        meta: {
            duration: 'X Months',
            teamSize: 'X Members',
            role: 'Your Role'
        }
    }
};
```

### Step 2: Add Content Data

In `case_studies_data.js`, add content for the new case study:

```javascript
'new-project-slug': {
    overview: [
        { title: '...', description: '...' },
        // ...
    ],
    process: [
        { step: 1, title: '...', description: '...' },
        // ...
    ],
    results: {
        stats: [
            { value: '...', label: '...' },
            // ...
        ],
        cards: [
            { title: '...', description: '...' },
            // ...
        ]
    },
    workedWell: [
        '...',
        // ...
    ],
    challenges: [
        '...',
        // ...
    ],
    insights: [
        { title: '...', description: '...' },
        // ...
    ]
}
```

**Note**: The system now uses dynamic content loading from `case_studies_data.js` based on URL parameters. All rendering functions accept data parameters.

### Step 3: Link from Homepage

In `common.js`, update `homepagePROJECTS` array:

```javascript
{
    company: "Company Name",
    title: "Project Title",
    features: [...],
    image: "images/project-image.jpg",
    caseStudySlug: "new-project-slug"  // Must match config.js slug
}
```

### Step 4: Test

1. Navigate to homepage
2. Click "View Case" on the project card
3. Verify case study page loads with correct data

## Adding a New Page Type

### Step 1: Create HTML File

Create `new-page.html` with:
- Body class: `newpage-page`
- Unique identifier element (e.g., `id="newpageContent"`)

### Step 2: Add CSS

In `common.css`, add styles with `.newpage-*` prefix:

```css
/* New Page Styles */
.newpage-hero-section { ... }
.newpage-content { ... }
```

### Step 3: Add JavaScript

In `common.js`:

1. **Add data structures** (if needed):
```javascript
const newpageData = [ ... ];
```

2. **Add rendering functions**:
```javascript
const newpageRenderContent = () => { ... };
```

3. **Add initialization**:
```javascript
const newpageInit = () => {
    try {
        newpageRenderContent();
        initSmoothScroll();
        setCurrentYear();
    } catch (error) {
        console.error('[newpageInit] Error:', error);
    }
};
```

4. **Update page detection** in `init()`:
```javascript
if (body.classList.contains('newpage-page') || document.getElementById('newpageContent')) {
    newpageInit();
    return;
}
```

## Performance Optimizations

### Implemented

1. **Resource Hints**: Preconnect to Google Fonts
2. **Deferred Scripts**: All scripts use `defer` attribute
3. **Lazy Loading**: Images use `loading="lazy"` (except hero images)
4. **CSS Organization**: Shared styles first, page-specific last
5. **JavaScript Organization**: Shared utilities first, page-specific last

### Recommended Future Enhancements

1. **Image Optimization**: 
   - Use WebP format with fallbacks
   - Implement responsive images with `srcset`
   - Add image compression

2. **Code Splitting**:
   - Split JavaScript by page type (if bundle grows)
   - Lazy load case study data

3. **Caching**:
   - Add service worker for offline support
   - Implement browser caching headers

4. **Minification**:
   - Minify CSS and JavaScript for production
   - Remove console.log statements in production

## Accessibility Features

### Implemented

1. **Semantic HTML**: Proper use of `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
2. **ARIA Labels**: Comprehensive `aria-label` and `aria-labelledby` attributes
3. **Role Attributes**: Proper `role` attributes for navigation and lists
4. **Alt Text**: All images have descriptive `alt` attributes
5. **Keyboard Navigation**: All interactive elements are keyboard accessible
6. **Focus Management**: Proper focus states for all interactive elements

### Best Practices Followed

- Use semantic HTML5 elements
- Provide text alternatives for images
- Ensure sufficient color contrast
- Make all functionality keyboard accessible
- Use proper heading hierarchy (h1 → h2 → h3)

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Features Used**: CSS Custom Properties, ES6+, Flexbox, Grid
- **Fallbacks**: Graceful degradation for older browsers

## Development Workflow

### Repository & Deployment

**GitHub**: https://github.com/ptulin/portfolio  
**Live Site**: https://disruptiveexperience.com/portfolio/  
**Branches**: `main` (production), `develop` (development)

### Local Development

1. **Clone Repository**:
   ```bash
   git clone https://github.com/ptulin/portfolio.git
   cd portfolio
   ```

2. **Start Development Server**:
   ```bash
   cd sandbox-new
   node server.js
   # OR
   python3 server.py
   ```
   Access at: http://localhost:5177

3. **Work on Develop Branch**:
   ```bash
   git checkout develop
   # Make changes
   git add .
   git commit -m "Description"
   git push origin develop
   ```

4. **Deploy to Production**:
   ```bash
   git checkout main
   git merge develop
   git push origin main
   # cPanel automatically deploys
   ```

### File Organization

- **HTML**: Page structure and content
- **CSS**: All styles in `common.css` (organized by section)
- **JavaScript**: All logic in `common.js` (organized by page type)
- **Config**: Centralized configuration in `config.js`

## Code Quality Standards

### HTML

- Semantic markup
- Consistent indentation (4 spaces)
- Comprehensive comments for major sections
- Accessibility attributes

### CSS

- BEM-like naming convention
- CSS Custom Properties for design tokens
- Mobile-first responsive design
- Organized by component/page type

### JavaScript

- JSDoc comments for all functions
- Error handling with try-catch
- Console logging for debugging
- Strict mode enabled
- Consistent naming conventions

## Recent Updates (Phase 2 & 3)

### Completed Features

1. ✅ **Dynamic Case Study Loading**: Case studies now load content from `case_studies_data.js` based on URL parameters
2. ✅ **Contact Form**: Functional contact form with Google Apps Script backend integration
3. ✅ **About Page**: Professional bio and companies section
4. ✅ **Resume Pages**: Password-protected resume access with session management
5. ✅ **Navigation Links**: All header and footer links properly connected across all pages
6. ✅ **Code Cleanup**: Removed old unused files (case-study.css, case-study.js, script.js, styles.css)
7. ✅ **Link Fixes**: All internal links verified and fixed for proper navigation
8. ✅ **Documentation**: Comprehensive README, updated architecture docs
9. ✅ **SEO Optimization**: Sitemap.xml, robots.txt, structured data (JSON-LD) on all key pages
10. ✅ **Accessibility**: Skip links, proper landmarks, enhanced keyboard navigation
11. ✅ **Error Handling**: Custom 404 page, improved error handling throughout
12. ✅ **Form Enhancements**: Enhanced validation, loading states, better user feedback
13. ✅ **Production Tools**: Build preparation script for validation and recommendations
14. ✅ **Analytics Ready**: Google Analytics placeholder code added

### Link Structure

All pages now use consistent relative paths:
- **Homepage sections**: `#work`, `#expertise`, `#contact` (on homepage)
- **Cross-page links**: `index.html#work`, `index.html#expertise` (from other pages)
- **Page links**: `about.html`, `contact.html`, `resume/index.html`
- **Case study links**: `case-study.html?project=slug`
- **Brand logo**: Links to `index.html` (or `../index.html` from subdirectories)

## Future Enhancements

### Recommended Additions

1. **Search Functionality**: Search across projects and case studies
2. **Blog Section**: Add blog page type with article listing
3. **Analytics**: Add analytics tracking (Google Analytics 4)
4. **SEO Enhancements**: Dynamic meta tags based on page content, structured data (JSON-LD)
5. **Internationalization**: Multi-language support
6. **Dark/Light Mode**: Theme switcher
7. **Image Optimization**: WebP format with fallbacks, responsive images
8. **Performance Monitoring**: Lighthouse CI, Web Vitals tracking

### Technical Debt

- Consider splitting large CSS file if it exceeds 2000 lines
- Consider code splitting JavaScript if bundle size grows
- Add unit tests for critical functions
- Add E2E tests for user flows

## Maintenance

### Regular Tasks

1. **Update Dependencies**: Keep fonts and external resources updated
2. **Review Accessibility**: Regular accessibility audits
3. **Performance Monitoring**: Monitor page load times
4. **Content Updates**: Keep portfolio content current
5. **Browser Testing**: Test in multiple browsers regularly

### Version Control

- Use semantic versioning for releases
- Document breaking changes
- Keep changelog updated

## Support

For questions or issues:
- Review this documentation
- Check code comments
- Review browser console for errors
- Test in different browsers/devices

---

**Last Updated**: 2025-01-XX  
**Version**: 2.1.0  
**Author**: Pawel Tulin  
**Status**: ✅ Production Ready

