/**
 * Portfolio JavaScript
 * 
 * Main application logic for the portfolio website.
 * Handles dynamic content rendering, navigation, and user interactions.
 * 
 * @author Pawel Tulin
 * @version 1.0.0
 */

'use strict';

/* ==========================================================================
   DATA MODELS
   ========================================================================== */

/**
 * Project data structure
 * @typedef {Object} Project
 * @property {string} company - Company name
 * @property {string} title - Project title
 * @property {string[]} features - Array of feature descriptions
 * @property {string} image - Image path/URL
 */

/**
 * Expertise area data structure
 * @typedef {Object} ExpertiseArea
 * @property {string} icon - SVG icon markup
 * @property {string} title - Expertise title
 * @property {string} description - Expertise description
 */

/**
 * Portfolio projects data
 * @type {Project[]}
 */
const PROJECTS = [
    {
        company: "Fiserv",
        title: "CFO AI Office Automation",
        features: [
            "AI Report Generation",
            "Custom Workflows & Dashboards",
            "Agentic Framework",
            "Personal RAG"
        ],
        image: "images/unsplash-2.jpg"
    },
    {
        company: "Jobbot",
        title: "AI Email Automation Experiment",
        features: [
            "Custom Email Replies",
            "Custom Resume Generation",
            "Almost No Costs",
            "Built on Google + GPT APIs"
        ],
        image: "images/unsplash-6.jpg"
    },
    {
        company: "ADP/Global",
        title: "Customer Support Chatbots",
        features: [
            "IBM Watson-powered conversational AI",
            "90% of customer interactions automated",
            "70% reduction in support costs"
        ],
        image: "images/unsplash-5.jpg"
    },
    {
        company: "Lord Abbett",
        title: "Data & Users",
        features: [
            "Data Visualization",
            "UI Personalization",
            "Mission Critical Security",
            "Advanced Error Handling"
        ],
        image: "images/unsplash-20.png"
    },
    {
        company: "Pearson",
        title: "Online Education Platform",
        features: [
            "Personalized learning",
            "Trusted content",
            "Comprehensive assessment",
            "Data-driven insights"
        ],
        image: "images/unsplash-4.jpg"
    },
    {
        company: "G2A",
        title: "Global E-Commerce Platform",
        features: [
            "AI Product Recommenders",
            "Blockchain Loyalty Systems",
            "Service Design",
            "Team Building and Management"
        ],
        image: "images/unsplash-1.jpg"
    },
    {
        company: "Gerson Lehrman Group",
        title: "Expert Network Platform",
        features: [
            "Custom Search Engine",
            "Interactive Data Visualization",
            "Largest Expert Network",
            "Complex Compliance Workflows"
        ],
        image: "images/unsplash-3.jpg"
    },
    {
        company: "IBM",
        title: "Bluedot Intelligence",
        features: [
            "Custom research",
            "Rapid prototyping",
            "User Journeys and Personas",
            "Natural Language Processing"
        ],
        image: "images/unsplash-7.jpg"
    },
    {
        company: "TD Ameritrade",
        title: "UX Competitive Analysis & Heuristic Evaluation",
        features: [
            "Heuristic usability audit",
            "Comparative UX study"
        ],
        image: "images/unsplash-8.jpg"
    }
];

/**
 * Expertise areas data
 * @type {ExpertiseArea[]}
 */
const EXPERTISE_AREAS = [
    {
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>`,
        title: "AI & Machine Learning Design",
        description: "Designing intelligent interfaces that seamlessly integrate AI capabilities while maintaining human-centered experiences."
    },
    {
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>`,
        title: "UX Research & Strategy",
        description: "Deep user research and strategic thinking to uncover insights that drive product decisions and user experiences."
    },
    {
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>`,
        title: "Service Design",
        description: "End-to-end service design that connects touchpoints and creates cohesive experiences across digital and physical channels."
    },
    {
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>`,
        title: "Product Leadership",
        description: "Leading cross-functional teams to deliver products that balance business goals, technical constraints, and user needs."
    }
];

/* ==========================================================================
   UTILITY FUNCTIONS
   ========================================================================== */

/**
 * Safely escapes HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML string
 */
const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

/**
 * Creates a feature list item HTML string
 * @param {string} feature - Feature description
 * @returns {string} HTML string for feature item
 */
const createFeatureItem = (feature) => {
    const escapedFeature = escapeHtml(feature);
    return `
        <li>
            <span class="feature-dot" aria-hidden="true"></span>
            ${escapedFeature}
        </li>
    `;
};

/**
 * Creates a project card HTML string
 * @param {Project} project - Project data object
 * @returns {string} HTML string for project card
 */
const createProjectCard = (project) => {
    const escapedCompany = escapeHtml(project.company);
    const escapedTitle = escapeHtml(project.title);
    const featuresHtml = project.features.map(createFeatureItem).join('');
    
    return `
        <article class="project-card" role="listitem">
            <div class="project-image-wrapper">
                <img 
                    src="${escapeHtml(project.image)}" 
                    alt="${escapedTitle}" 
                    class="project-image"
                    loading="lazy"
                >
                <div class="project-image-overlay" aria-hidden="true"></div>
            </div>
            <div class="project-content">
                <span class="project-company">${escapedCompany}</span>
                <h3 class="project-title">${escapedTitle}</h3>
                <ul class="project-features">
                    ${featuresHtml}
                </ul>
                <div class="project-links">
                    <a href="#work" class="project-link" aria-label="View case study for ${escapedTitle}">
                        View Case
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </a>
                    <a href="#" class="project-link secondary" aria-label="Download PDF for ${escapedTitle}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                        </svg>
                        PDF
                    </a>
                </div>
            </div>
        </article>
    `;
};

/**
 * Creates an expertise card HTML string
 * @param {ExpertiseArea} area - Expertise area data object
 * @returns {string} HTML string for expertise card
 */
const createExpertiseCard = (area) => {
    const escapedTitle = escapeHtml(area.title);
    const escapedDescription = escapeHtml(area.description);
    
    return `
        <div class="expertise-card" role="listitem">
            <div class="expertise-icon" aria-hidden="true">
                ${area.icon}
            </div>
            <h3 class="expertise-title">${escapedTitle}</h3>
            <p class="expertise-description">${escapedDescription}</p>
        </div>
    `;
};

/* ==========================================================================
   RENDERING FUNCTIONS
   ========================================================================== */

/**
 * Renders all projects to the projects grid
 * @throws {Error} If projects grid element is not found
 */
const renderProjects = () => {
    const grid = document.getElementById('projectsGrid');
    
    if (!grid) {
        console.error('Projects grid element not found');
        return;
    }
    
    try {
        grid.innerHTML = PROJECTS.map(createProjectCard).join('');
    } catch (error) {
        console.error('Error rendering projects:', error);
        grid.innerHTML = '<p>Unable to load projects. Please refresh the page.</p>';
    }
};

/**
 * Renders all expertise areas to the expertise grid
 * @throws {Error} If expertise grid element is not found
 */
const renderExpertise = () => {
    const grid = document.getElementById('expertiseGrid');
    
    if (!grid) {
        console.error('Expertise grid element not found');
        return;
    }
    
    try {
        grid.innerHTML = EXPERTISE_AREAS.map(createExpertiseCard).join('');
    } catch (error) {
        console.error('Error rendering expertise areas:', error);
        grid.innerHTML = '<p>Unable to load expertise areas. Please refresh the page.</p>';
    }
};

/* ==========================================================================
   NAVIGATION FUNCTIONS
   ========================================================================== */

/**
 * Initializes mobile menu toggle functionality
 */
const initMobileMenu = () => {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!toggle || !navLinks) {
        return;
    }
    
    toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        const newState = !isExpanded;
        
        toggle.setAttribute('aria-expanded', String(newState));
        navLinks.style.display = newState ? 'flex' : 'none';
        
        // Add mobile menu styles if needed
        if (newState) {
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '80px';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.backgroundColor = 'var(--color-background)';
            navLinks.style.padding = '1rem';
            navLinks.style.borderTop = '1px solid var(--color-border)';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!navLinks.contains(event.target) && !toggle.contains(event.target)) {
            toggle.setAttribute('aria-expanded', 'false');
            navLinks.style.display = 'none';
        }
    });
};

/**
 * Initializes smooth scrolling for anchor links
 */
const initSmoothScroll = () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function (event) {
            const href = this.getAttribute('href');
            
            // Skip empty hash or just '#'
            if (!href || href === '#') {
                return;
            }
            
            event.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without triggering scroll
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
            }
        });
    });
};

/* ==========================================================================
   INITIALIZATION FUNCTIONS
   ========================================================================== */

/**
 * Sets the current year in the footer copyright
 */
const setCurrentYear = () => {
    const yearElement = document.getElementById('currentYear');
    
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
};

/**
 * Main initialization function
 * Runs when DOM is fully loaded
 */
const init = () => {
    try {
        renderProjects();
        renderExpertise();
        initMobileMenu();
        initSmoothScroll();
        setCurrentYear();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
};

/* ==========================================================================
   EVENT LISTENERS
   ========================================================================== */

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM is already ready
    init();
}
