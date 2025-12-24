# Portfolio Website - Pure HTML/CSS/JS

A modern, performant portfolio website built with pure HTML, CSS, and JavaScript following industry best practices.

> **Note**: This project was created following the procedure documented in `../LOVABLE_TO_STATIC_PROCEDURE.md`. For details on the conversion process, see the project documentation.

## 🏗️ Project Structure

```
sandbox-pure/
├── index.html          # Main HTML document
├── styles.css          # Comprehensive stylesheet
├── script.js           # Application logic
├── server.js           # Development server
├── package.json        # Project dependencies
├── images/             # Image assets
│   ├── unsplash-*.jpg  # Project images
│   └── unsplash-*.png  # Project images
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser and navigate to:
```
http://localhost:5174
```

## 📁 Code Organization

### HTML (`index.html`)

- **Semantic HTML5**: Uses proper semantic elements (`<header>`, `<nav>`, `<section>`, `<article>`, `<footer>`)
- **Accessibility**: ARIA labels, roles, and proper heading hierarchy
- **SEO Optimized**: Comprehensive meta tags, Open Graph, and Twitter Card support
- **Performance**: Preconnect for fonts, deferred scripts

### CSS (`styles.css`)

- **CSS Custom Properties**: Design tokens for colors, spacing, typography
- **BEM-like Naming**: Consistent class naming conventions
- **Modular Organization**: Sections clearly commented and organized
- **Responsive Design**: Mobile-first approach with breakpoints
- **Performance**: Optimized selectors, minimal specificity

### JavaScript (`script.js`)

- **ES6+ Features**: Modern JavaScript syntax
- **JSDoc Comments**: Comprehensive documentation
- **Error Handling**: Try-catch blocks and null checks
- **XSS Protection**: HTML escaping for user-generated content
- **Modular Structure**: Organized into logical sections
- **Event Delegation**: Efficient event handling

## 🎨 Design System

### Color Palette

- **Background**: `hsl(220, 15%, 8%)` - Dark blue-gray
- **Foreground**: `hsl(45, 20%, 92%)` - Light cream
- **Primary**: `hsl(175, 70%, 50%)` - Teal accent
- **Secondary**: `hsl(220, 15%, 16%)` - Darker blue-gray

### Typography

- **Display Font**: Merriweather (serif) - Headings
- **Body Font**: Inter (sans-serif) - Body text

### Spacing Scale

- `--spacing-xs`: 0.25rem (4px)
- `--spacing-sm`: 0.5rem (8px)
- `--spacing-md`: 1rem (16px)
- `--spacing-lg`: 1.5rem (24px)
- `--spacing-xl`: 2rem (32px)
- `--spacing-2xl`: 3rem (48px)
- `--spacing-3xl`: 4rem (64px)

## 🔧 Best Practices

### Code Quality

1. **Consistent Naming**: BEM-like naming convention for CSS classes
2. **Comments**: Comprehensive comments explaining complex logic
3. **Error Handling**: All functions include error handling
4. **Accessibility**: WCAG 2.1 AA compliant
5. **Performance**: Lazy loading images, optimized selectors

### Security

- HTML escaping for all user-generated content
- `rel="noopener noreferrer"` for external links
- XSS protection in JavaScript

### Performance

- CSS custom properties for efficient theming
- Minimal DOM queries (cached selectors)
- Event delegation where appropriate
- Lazy loading for images
- Optimized font loading with preconnect

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Development Guidelines

### Adding New Projects

Edit the `PROJECTS` array in `script.js`:

```javascript
{
    company: "Company Name",
    title: "Project Title",
    features: ["Feature 1", "Feature 2"],
    image: "images/image-name.jpg"
}
```

### Adding New Expertise Areas

Edit the `EXPERTISE_AREAS` array in `script.js`:

```javascript
{
    icon: `<svg>...</svg>`,
    title: "Expertise Title",
    description: "Description text"
}
```

### Modifying Styles

1. Use CSS custom properties from `:root` when possible
2. Follow the existing naming conventions
3. Add comments for new sections
4. Test responsive behavior at all breakpoints

## 🐛 Troubleshooting

### Images Not Loading

- Check that image paths in `script.js` match files in `images/` directory
- Ensure server is running and serving static files correctly

### Styles Not Applying

- Clear browser cache
- Check browser console for CSS errors
- Verify `styles.css` is linked correctly in `index.html`

### JavaScript Errors

- Check browser console for error messages
- Verify all DOM elements exist before accessing them
- Ensure `script.js` is loaded with `defer` attribute

## 📄 License

This project is proprietary and confidential.

## 👤 Author

**Pawel Tulin**
- Portfolio: [Your Portfolio URL]
- Email: ptulin@gmail.com
- LinkedIn: [Your LinkedIn Profile]

---

*Last updated: 2025*

