/**
 * Unified Portfolio JavaScript
 * 
 * Combined JavaScript for homepage and case study pages.
 * Uses naming prefixes to avoid conflicts between page-specific code.
 * 
 * Architecture:
 * - Shared utilities: Generic names (e.g., escapeHtml, initSmoothScroll, setCurrentYear)
 * - Homepage-specific: homepage* prefix (e.g., homepageRenderProjects, homepageInit)
 * - Case study-specific: casestudy* prefix (e.g., casestudyRenderOverviewCards, casestudyInit)
 * 
 * Dependencies:
 * - config.js: Provides configuration and case study routing
 * 
 * Extensibility:
 * - To add a new page type, create a new prefix (e.g., blogpage*) and corresponding init function
 * - Update the init() function to detect and initialize the new page type
 * - Follow the same naming convention pattern for consistency
 * 
 * @author Pawel Tulin
 * @version 2.1.0
 * @requires config.js
 */

'use strict';

/* ==========================================================================
   SHARED UTILITY FUNCTIONS
   ========================================================================== */

/**
 * Safely escapes HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML string
 */
const escapeHtml = (text) => {
    if (typeof text !== 'string') {
        console.warn('[escapeHtml] Non-string value provided, converting to string.');
        text = String(text);
    }
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

/**
 * Initializes smooth scrolling for anchor links
 * @returns {void}
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

/**
 * Sets the current year in the footer copyright
 * @returns {void}
 */
const setCurrentYear = () => {
    const yearElement = document.getElementById('currentYear');
    
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
};

/* ==========================================================================
   HOMEPAGE-SPECIFIC CODE
   ========================================================================== */

/**
 * Project data structure
 * @typedef {Object} Project
 * @property {string} company - Company name
 * @property {string} title - Project title
 * @property {string[]} features - Array of feature descriptions
 * @property {string} image - Image path/URL
 * @property {string} [caseStudySlug] - Optional case study URL slug
 */

/**
 * Expertise area data structure
 * @typedef {Object} ExpertiseArea
 * @property {string} icon - SVG icon markup
 * @property {string} title - Expertise title
 * @property {string} description - Expertise description
 */

/**
 * Homepage projects data
 * @type {Project[]}
 */
const homepagePROJECTS = [
    {
        company: "Fiserv",
        title: "CFO AI Office Automation",
        features: [
            "AI Report Generation",
            "Custom Workflows & Dashboards",
            "Agentic Framework",
            "Personal RAG"
        ],
        image: "images/unsplash-2.jpg",
        caseStudySlug: "fiserv-cfo-ai-automation"
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
        image: "images/unsplash-6.jpg",
        caseStudySlug: "jobbot-email-automation"
    },
    {
        company: "ADP/Global",
        title: "Customer Support Chatbots",
        features: [
            "IBM Watson-powered conversational AI",
            "90% of customer interactions automated",
            "70% reduction in support costs"
        ],
        image: "images/unsplash-5.jpg",
        caseStudySlug: "adp-customer-support-chatbots"
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
        image: "images/unsplash-20.png",
        caseStudySlug: "lord-abbett-data-users"
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
        image: "images/unsplash-4.jpg",
        caseStudySlug: "pearson-online-education"
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
        image: "images/unsplash-1.jpg",
        caseStudySlug: "g2a-global-ecommerce"
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
        image: "images/unsplash-3.jpg",
        caseStudySlug: "glg-expert-network"
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
        image: "images/unsplash-7.jpg",
        caseStudySlug: "ibm-bluedot-intelligence"
    },
    {
        company: "TD Ameritrade",
        title: "UX Competitive Analysis & Heuristic Evaluation",
        features: [
            "Heuristic usability audit",
            "Comparative UX study"
        ],
        image: "images/unsplash-8.jpg",
        caseStudySlug: "td-ameritrade-ux-analysis"
    }
];

/**
 * Homepage expertise areas data
 * @type {ExpertiseArea[]}
 */
const homepageEXPERTISE_AREAS = [
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

/**
 * Creates a homepage feature list item HTML string
 * @param {string} feature - Feature description
 * @returns {string} HTML string for feature item
 */
const homepageCreateFeatureItem = (feature) => {
    const escapedFeature = escapeHtml(feature);
    return `
        <li>
            <span class="homepage-feature-dot" aria-hidden="true"></span>
            ${escapedFeature}
        </li>
    `;
};

/**
 * Creates a homepage project card HTML string
 * @param {Project} project - Project data object
 * @returns {string} HTML string for project card
 */
const homepageCreateProjectCard = (project) => {
    const escapedCompany = escapeHtml(project.company);
    const escapedTitle = escapeHtml(project.title);
    const featuresHtml = project.features.map(homepageCreateFeatureItem).join('');
    
    // Generate case study link if caseStudySlug exists
    const caseStudyLink = project.caseStudySlug 
        ? `case-study.html?project=${escapeHtml(project.caseStudySlug)}`
        : '#work';
    
    return `
        <article class="homepage-project-card" role="listitem">
            <div class="homepage-project-image-wrapper">
                <img 
                    src="${escapeHtml(project.image)}" 
                    alt="${escapedTitle}" 
                    class="homepage-project-image"
                    loading="lazy"
                >
                <div class="homepage-project-image-overlay" aria-hidden="true"></div>
            </div>
            <div class="homepage-project-content">
                <span class="homepage-project-company">${escapedCompany}</span>
                <h3 class="homepage-project-title">${escapedTitle}</h3>
                <ul class="homepage-project-features">
                    ${featuresHtml}
                </ul>
                <div class="homepage-project-links">
                    <a href="${caseStudyLink}" class="homepage-project-link" aria-label="View case study for ${escapedTitle}">
                        View Case
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </a>
                    <a href="#" class="homepage-project-link secondary" aria-label="Download PDF for ${escapedTitle}">
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
 * Creates a homepage expertise card HTML string
 * @param {ExpertiseArea} area - Expertise area data object
 * @returns {string} HTML string for expertise card
 */
const homepageCreateExpertiseCard = (area) => {
    const escapedTitle = escapeHtml(area.title);
    const escapedDescription = escapeHtml(area.description);
    
    return `
        <div class="homepage-expertise-card" role="listitem">
            <div class="homepage-expertise-icon" aria-hidden="true">
                ${area.icon}
            </div>
            <h3 class="homepage-expertise-title">${escapedTitle}</h3>
            <p class="homepage-expertise-description">${escapedDescription}</p>
        </div>
    `;
};

/**
 * Renders all homepage projects to the projects grid
 * @returns {void}
 */
const homepageRenderProjects = () => {
    const grid = document.getElementById('projectsGrid');
    
    if (!grid) {
        return; // Not on homepage
    }
    
    try {
        grid.innerHTML = homepagePROJECTS.map(homepageCreateProjectCard).join('');
    } catch (error) {
        console.error('[homepageRenderProjects] Error rendering projects:', error);
        grid.innerHTML = '<p>Unable to load projects. Please refresh the page.</p>';
    }
};

/**
 * Renders all homepage expertise areas to the expertise grid
 * @returns {void}
 */
const homepageRenderExpertise = () => {
    const grid = document.getElementById('expertiseGrid');
    
    if (!grid) {
        return; // Not on homepage
    }
    
    try {
        grid.innerHTML = homepageEXPERTISE_AREAS.map(homepageCreateExpertiseCard).join('');
    } catch (error) {
        console.error('[homepageRenderExpertise] Error rendering expertise areas:', error);
        grid.innerHTML = '<p>Unable to load expertise areas. Please refresh the page.</p>';
    }
};

/**
 * Shared mobile menu initialization function
 * Works on all pages with mobile menu toggle
 * @returns {void}
 */
const initMobileMenu = () => {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!toggle || !navLinks) {
        return; // Mobile menu not present
    }
    
    // Remove any existing listeners by cloning the element
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    
    newToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = newToggle.getAttribute('aria-expanded') === 'true';
        const newState = !isExpanded;
        
        newToggle.setAttribute('aria-expanded', String(newState));
        
        if (newState) {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.backgroundColor = 'var(--color-background)';
            navLinks.style.padding = '1.5rem';
            navLinks.style.borderTop = '1px solid var(--color-border)';
            navLinks.style.zIndex = '1000';
            navLinks.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navLinks.style.display = 'none';
        }
    });
    
    // Close menu when clicking outside or on a link
    const closeMenu = (event) => {
        if (!navLinks.contains(event.target) && !newToggle.contains(event.target)) {
            newToggle.setAttribute('aria-expanded', 'false');
            navLinks.style.display = 'none';
        }
    };
    
    // Close on link click
    navLinks.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            setTimeout(() => {
                newToggle.setAttribute('aria-expanded', 'false');
                navLinks.style.display = 'none';
            }, 100);
        }
    });
    
    // Close on outside click
    document.addEventListener('click', closeMenu);
    
    // Close on window resize if menu is open and window becomes larger
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            newToggle.setAttribute('aria-expanded', 'false');
            navLinks.style.display = '';
            navLinks.style.flexDirection = '';
            navLinks.style.position = '';
            navLinks.style.top = '';
            navLinks.style.left = '';
            navLinks.style.right = '';
            navLinks.style.backgroundColor = '';
            navLinks.style.padding = '';
            navLinks.style.borderTop = '';
            navLinks.style.zIndex = '';
            navLinks.style.boxShadow = '';
        }
    });
};

/**
 * Initializes homepage mobile menu toggle functionality
 * @returns {void}
 * @deprecated Use initMobileMenu() instead - kept for backward compatibility
 */
const homepageInitMobileMenu = () => {
    initMobileMenu();
};

/**
 * Homepage initialization function
 * @returns {void}
 */
const homepageInit = () => {
    try {
        homepageRenderProjects();
        homepageRenderExpertise();
        homepageInitMobileMenu();
        initSmoothScroll();
        setCurrentYear();
    } catch (error) {
        console.error('[homepageInit] Error during initialization:', error);
    }
};

/* ==========================================================================
   CASE STUDY-SPECIFIC CODE
   ========================================================================== */

/**
 * @typedef {Object} CasestudyOverviewCard
 * @property {string} icon - SVG icon string
 * @property {string} title - Card title
 * @property {string} description - Card description
 */

/**
 * @typedef {Object} CasestudyProcessStep
 * @property {string} number - Step number (e.g., "01")
 * @property {string} title - Step title
 * @property {string} description - Step description
 */

/**
 * @typedef {Object} CasestudyResultStat
 * @property {string} value - Statistic value
 * @property {string} label - Statistic label
 * @property {string} description - Statistic description
 */

/**
 * @typedef {Object} CasestudyResultCard
 * @property {string} title - Card title
 * @property {string} description - Card description
 */

/**
 * @typedef {Object} CasestudyInsightCard
 * @property {string} title - Card title
 * @property {string} description - Card description
 */

/**
 * Case study overview cards data
 * @type {CasestudyOverviewCard[]}
 */
const casestudyOverviewCards = [
    {
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>`,
        title: "The Challenge",
        description: "Financial teams spent 60+ hours weekly on manual data entry, reconciliation, and report generation, leading to delays and human errors."
    },
    {
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>`,
        title: "The Approach",
        description: "Designed an AI-powered automation system that intelligently processes financial data, automates workflows, and generates real-time insights."
    },
    {
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>`,
        title: "The Outcome",
        description: "Achieved 70% reduction in manual workload, 95% accuracy improvement, and enabled real-time financial visibility across the organization."
    },
    {
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>`,
        title: "Key Innovation",
        description: "Implemented smart anomaly detection that flags potential issues before they become problems, ensuring compliance and reducing risk."
    }
];

/**
 * Case study process steps data
 * @type {CasestudyProcessStep[]}
 */
const casestudyProcessSteps = [
    {
        number: "01",
        title: "Discovery & Research",
        description: "Conducted extensive user research with CFO teams across 12 organizations to understand pain points, workflows, and automation opportunities."
    },
    {
        number: "02",
        title: "AI Architecture Design",
        description: "Designed the machine learning pipeline for document processing, data extraction, and intelligent categorization of financial transactions."
    },
    {
        number: "03",
        title: "Interface Prototyping",
        description: "Created high-fidelity prototypes focusing on dashboard visualization, workflow automation triggers, and exception handling interfaces."
    },
    {
        number: "04",
        title: "Iterative Testing",
        description: "Ran 6 rounds of usability testing with real CFO teams, continuously refining the AI models and user experience based on feedback."
    }
];

/**
 * Case study result statistics data
 * @type {CasestudyResultStat[]}
 */
const casestudyResultStats = [
    {
        value: "70%",
        label: "Reduction in Manual Work",
        description: "Automated repetitive tasks"
    },
    {
        value: "95%",
        label: "Accuracy Rate",
        description: "AI-powered validation"
    },
    {
        value: "3x",
        label: "Faster Reporting",
        description: "Real-time analytics"
    },
    {
        value: "$2.4M",
        label: "Annual Savings",
        description: "Operational efficiency"
    }
];

/**
 * Case study result cards data
 * @type {CasestudyResultCard[]}
 */
const casestudyResultCards = [
    {
        title: "User Satisfaction",
        description: "92% of CFO teams reported significantly improved work-life balance due to reduced overtime requirements."
    },
    {
        title: "Compliance Improvement",
        description: "Zero compliance violations post-implementation, compared to an average of 3 per quarter previously."
    },
    {
        title: "Scalability",
        description: "System successfully scaled to handle 5x transaction volume during peak periods without performance degradation."
    }
];

/**
 * Case study worked well items
 * @type {string[]}
 */
const casestudyWorkedWellItems = [
    "Early involvement of end-users in AI model training",
    "Progressive disclosure of automation complexity",
    "Real-time feedback loops for continuous improvement",
    "Human-in-the-loop for critical financial decisions"
];

/**
 * Case study challenges items
 * @type {string[]}
 */
const casestudyChallengesItems = [
    "Initial resistance to AI-driven processes",
    "Legacy system integration complexities",
    "Balancing automation with user control"
];

/**
 * Case study insights cards data
 * @type {CasestudyInsightCard[]}
 */
const casestudyInsightsCards = [
    {
        title: "Trust Through Transparency",
        description: "Users adopted AI features faster when they understood how decisions were made. We added explainability features that showed the reasoning behind each automated action."
    },
    {
        title: "Gradual Autonomy",
        description: "Instead of full automation from day one, we designed a progressive system that increased autonomy as users gained confidence in the AI's accuracy."
    },
    {
        title: "Exception-First Design",
        description: "Focusing on how the system handles exceptions—not just happy paths—was crucial for building trust and ensuring adoption in high-stakes financial contexts."
    }
];

/**
 * Renders case study overview cards
 * 
 * @param {Array} [data] - Optional array of overview cards. If not provided, uses default casestudyOverviewCards
 * @returns {void}
 */
const casestudyRenderOverviewCards = (data = null) => {
    const grid = document.getElementById('overviewGrid');
    if (!grid) {
        return; // Not on case study page
    }

    try {
        // Use provided data or fallback to default
        const cards = data || casestudyOverviewCards;
        
        // Icon mapping for overview cards
        const iconMap = {
            'The Challenge': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>`,
            'The Approach': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>`,
            'The Outcome': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>`,
            'Key Innovation': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>`
        };
        
        grid.innerHTML = cards.map((card, index) => {
            const cardId = `casestudy-overview-card-${index}`;
            const titleId = `overview-title-${card.title.replace(/\s+/g, '-').toLowerCase()}`;
            // Use icon from card if available, otherwise use iconMap
            const icon = card.icon || iconMap[card.title] || iconMap['The Challenge'];
            
            return `
                <article 
                    class="casestudy-overview-card" 
                    id="${cardId}"
                    aria-labelledby="${titleId}" 
                    tabindex="0"
                    role="listitem"
                >
                    <div class="casestudy-overview-card-icon" aria-hidden="true">
                        ${icon}
                    </div>
                    <h3 id="${titleId}" class="casestudy-overview-card-title">
                        ${escapeHtml(card.title)}
                    </h3>
                    <p class="casestudy-overview-card-description">
                        ${escapeHtml(card.description)}
                    </p>
                </article>
            `;
        }).join('');
    } catch (error) {
        console.error('[casestudyRenderOverviewCards] Error rendering overview cards:', error);
    }
};

/**
 * Renders case study process steps
 * 
 * @param {Array} [data] - Optional array of process steps. If not provided, uses default casestudyProcessSteps
 * @returns {void}
 */
const casestudyRenderProcessSteps = (data = null) => {
    const container = document.getElementById('processSteps');
    if (!container) {
        return; // Not on case study page
    }

    try {
        // Use provided data or fallback to default
        const steps = data || casestudyProcessSteps;
        
        container.innerHTML = steps.map((step, index) => {
            const stepId = `casestudy-process-step-${index}`;
            
            return `
                <div class="casestudy-process-step" id="${stepId}" role="listitem">
                    <div class="casestudy-process-step-number" aria-label="Step ${step.number}">
                        <span>${escapeHtml(step.number)}</span>
                    </div>
                    <div class="casestudy-process-step-content">
                        <h3>${escapeHtml(step.title)}</h3>
                        <p>${escapeHtml(step.description)}</p>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('[casestudyRenderProcessSteps] Error rendering process steps:', error);
    }
};

/**
 * Renders case study result statistics
 * 
 * @param {Array} [data] - Optional array of result stats. If not provided, uses default casestudyResultStats
 * @returns {void}
 */
const casestudyRenderResultStats = (data = null) => {
    const container = document.getElementById('resultsStats');
    if (!container) {
        return; // Not on case study page
    }

    try {
        // Use provided data or fallback to default
        const stats = data || casestudyResultStats;
        
        if (!stats || stats.length === 0) {
            container.innerHTML = ''; // Clear if no stats
            return;
        }
        
        container.innerHTML = stats.map((stat, index) => {
            const statId = `casestudy-result-stat-${index}`;
            
            return `
                <div class="casestudy-result-stat" id="${statId}" role="listitem">
                    <div class="casestudy-result-stat-value" aria-label="${escapeHtml(stat.value)}">
                        ${escapeHtml(stat.value)}
                    </div>
                    <div class="casestudy-result-stat-label">
                        ${escapeHtml(stat.label)}
                    </div>
                    <div class="casestudy-result-stat-description">
                        ${escapeHtml(stat.description)}
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('[casestudyRenderResultStats] Error rendering result stats:', error);
    }
};

/**
 * Renders case study result cards
 * 
 * @param {Array} [data] - Optional array of result cards. If not provided, uses default casestudyResultCards
 * @returns {void}
 */
const casestudyRenderResultCards = (data = null) => {
    const container = document.getElementById('resultsCards');
    if (!container) {
        return; // Not on case study page
    }

    try {
        // Use provided data or fallback to default
        const cards = data || casestudyResultCards;
        
        if (!cards || cards.length === 0) {
            container.innerHTML = ''; // Clear if no cards
            return;
        }
        
        container.innerHTML = cards.map((card, index) => {
            const cardId = `casestudy-result-card-${index}`;
            
            return `
                <div class="casestudy-result-card" id="${cardId}" role="listitem">
                    <h4>${escapeHtml(card.title)}</h4>
                    <p>${escapeHtml(card.description)}</p>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('[casestudyRenderResultCards] Error rendering result cards:', error);
    }
};

/**
 * Renders case study worked well list
 * 
 * @param {Array} [data] - Optional array of worked well items. If not provided, uses default casestudyWorkedWellItems
 * @returns {void}
 */
const casestudyRenderWorkedWellList = (data = null) => {
    const list = document.getElementById('workedWellList');
    if (!list) {
        return; // Not on case study page
    }

    try {
        // Use provided data or fallback to default
        const items = data || casestudyWorkedWellItems;
        
        if (!items || items.length === 0) {
            list.innerHTML = ''; // Clear if no items
            return;
        }
        
        list.innerHTML = items.map((item, index) => `
            <li role="listitem" id="worked-well-item-${index}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span>${escapeHtml(item)}</span>
            </li>
        `).join('');
    } catch (error) {
        console.error('[casestudyRenderWorkedWellList] Error rendering worked well list:', error);
    }
};

/**
 * Renders case study challenges list
 * 
 * @param {Array} [data] - Optional array of challenge items. If not provided, uses default casestudyChallengesItems
 * @returns {void}
 */
const casestudyRenderChallengesList = (data = null) => {
    const list = document.getElementById('challengesList');
    if (!list) {
        return; // Not on case study page
    }

    try {
        // Use provided data or fallback to default
        const items = data || casestudyChallengesItems;
        
        if (!items || items.length === 0) {
            list.innerHTML = ''; // Clear if no items
            return;
        }
        
        list.innerHTML = items.map((item, index) => `
            <li role="listitem" id="challenge-item-${index}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lessons-icon-challenge" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>${escapeHtml(item)}</span>
            </li>
        `).join('');
    } catch (error) {
        console.error('[casestudyRenderChallengesList] Error rendering challenges list:', error);
    }
};

/**
 * Renders case study insights cards
 * 
 * @param {Array} [data] - Optional array of insight cards. If not provided, uses default casestudyInsightsCards
 * @returns {void}
 */
const casestudyRenderInsightsCards = (data = null) => {
    const grid = document.getElementById('insightsGrid');
    if (!grid) {
        return; // Not on case study page
    }

    try {
        // Use provided data or fallback to default
        const cards = data || casestudyInsightsCards;
        
        if (!cards || cards.length === 0) {
            grid.innerHTML = ''; // Clear if no cards
            return;
        }
        
        grid.innerHTML = cards.map((card, index) => {
            const cardId = `casestudy-insight-card-${index}`;
            
            return `
                <div class="casestudy-insight-card" id="${cardId}" role="listitem">
                    <h4>${escapeHtml(card.title)}</h4>
                    <p>${escapeHtml(card.description)}</p>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('[casestudyRenderInsightsCards] Error rendering insights cards:', error);
    }
};

/**
 * Renders testimonial section with dynamic content
 * 
 * @param {Object} testimonialData - Testimonial data object with quote, author_name, author_title
 * @returns {void}
 */
const casestudyRenderTestimonial = (testimonialData = null) => {
    const quoteElement = document.querySelector('.casestudy-testimonial-quote');
    const authorElement = document.querySelector('.casestudy-testimonial-author');
    
    if (!quoteElement || !authorElement) {
        return; // Not on case study page
    }
    
    try {
        if (testimonialData && testimonialData.quote) {
            // Extract text from quote (remove quotes if present)
            let quoteText = testimonialData.quote.replace(/^["']|["']$/g, '');
            
            // Add gradient to a key word (find a word like "transformed", "quickly", "never", etc.)
            const gradientWords = ['transformed', 'quickly', 'never', 'always', 'custom', 'tailored'];
            for (const word of gradientWords) {
                if (quoteText.toLowerCase().includes(word.toLowerCase())) {
                    const regex = new RegExp(`(${word})`, 'gi');
                    quoteText = quoteText.replace(regex, `<span class="text-gradient">$1</span>`);
                    break; // Only highlight one word
                }
            }
            
            quoteElement.innerHTML = `"${quoteText}"`;
            
            // Update author info if provided
            if (testimonialData.author_name) {
                const authorNameElement = authorElement.querySelector('.casestudy-author-name');
                const authorTitleElement = authorElement.querySelector('.casestudy-author-title');
                const authorAvatarElement = authorElement.querySelector('.casestudy-author-avatar');
                
                if (authorNameElement) {
                    authorNameElement.textContent = testimonialData.author_name;
                }
                if (authorTitleElement) {
                    authorTitleElement.textContent = testimonialData.author_title || '';
                }
                if (authorAvatarElement && testimonialData.author_name) {
                    // Set initials for avatar
                    const names = testimonialData.author_name.split(' ');
                    const initials = names.length >= 2 
                        ? (names[0][0] + names[names.length - 1][0]).toUpperCase()
                        : testimonialData.author_name.substring(0, 2).toUpperCase();
                    authorAvatarElement.textContent = initials;
                }
            }
        }
    } catch (error) {
        console.error('[casestudyRenderTestimonial] Error rendering testimonial:', error);
    }
};

/**
 * Gets case study data by slug from CASE_STUDY_DATA
 * Falls back to default Fiserv data if slug not found or data not available
 * 
 * @param {string} slug - Case study slug from URL parameter
 * @returns {Object|null} Case study data object or null if not found
 */
const getCaseStudyData = (slug) => {
    try {
        // Check if CASE_STUDY_DATA is available (loaded from case_studies_data.js)
        if (typeof CASE_STUDY_DATA !== 'undefined' && CASE_STUDY_DATA[slug]) {
            console.debug(`[getCaseStudyData] Loaded data for: ${slug}`);
            return CASE_STUDY_DATA[slug];
        }
        
        // Fallback to default Fiserv data if available
        if (slug === 'fiserv-cfo-ai-automation') {
            console.warn('[getCaseStudyData] CASE_STUDY_DATA not available, using default data');
            return {
                overview_cards: casestudyOverviewCards,
                process_steps: casestudyProcessSteps,
                result_stats: casestudyResultStats,
                result_cards: casestudyResultCards,
                worked_well: casestudyWorkedWellItems,
                challenges: casestudyChallengesItems,
                insights: casestudyInsightsCards
            };
        }
        
        console.warn(`[getCaseStudyData] Case study not found: ${slug}`);
        return null;
    } catch (error) {
        console.error('[getCaseStudyData] Error loading case study data:', error);
        return null;
    }
};

/**
 * Updates case study hero section with dynamic content
 * 
 * @param {Object} data - Case study data object
 * @returns {void}
 */
const casestudyUpdateHero = (data) => {
    try {
        if (!data) return;
        
        // Update title
        const titleElement = document.getElementById('hero-title');
        if (titleElement && data.title) {
            // Extract the gradient part if it exists in the title
            const titleParts = data.title.split(' ');
            if (titleParts.length > 1) {
                // Find a word to highlight (usually the last significant word)
                const lastWord = titleParts[titleParts.length - 1];
                const beforeLast = titleParts.slice(0, -1).join(' ');
                titleElement.innerHTML = `${beforeLast} <span class="text-gradient">${lastWord}</span>`;
            } else {
                titleElement.textContent = data.title;
            }
        }
        
        // Update description
        const descElement = document.querySelector('.casestudy-hero-description');
        if (descElement && data.description) {
            descElement.textContent = data.description;
        }
        
        // Update meta information
        if (data.meta) {
            // Map meta labels to data keys
            const metaMapping = {
                'Duration': 'Duration',
                'Team Size': 'Team Size',
                'My Role': 'My Role'
            };
            
            const metaItems = document.querySelectorAll('.casestudy-meta-item');
            metaItems.forEach((item) => {
                const labelElement = item.querySelector('.casestudy-meta-label');
                const valueElement = item.querySelector('.casestudy-meta-value');
                
                if (labelElement && valueElement) {
                    const labelText = labelElement.textContent.trim();
                    const dataKey = metaMapping[labelText] || labelText;
                    
                    if (data.meta[dataKey]) {
                        valueElement.textContent = data.meta[dataKey];
                    }
                }
            });
        }
        
        // Update page title
        if (data.title) {
            document.title = `${data.title} | Case Study`;
        }
        
        // Update hero image based on case study slug
        const urlParams = new URLSearchParams(window.location.search);
        const projectSlug = urlParams.get('project') || 'fiserv-cfo-ai-automation';
        const heroImage = document.querySelector('.casestudy-hero-image');
        
        if (heroImage) {
            // Set image based on case study slug
            if (projectSlug === 'fiserv-cfo-ai-automation') {
                heroImage.src = 'images/fiserv/dashboard.png';
            } else if (projectSlug === 'jobbot-email-automation') {
                heroImage.src = 'images/jobbot/dashboard.png';
                heroImage.width = 1536;
                heroImage.height = 1024;
            } else if (projectSlug === 'adp-customer-support-chatbots') {
                heroImage.src = 'images/adp/dashboard.png';
                heroImage.width = 1536;
                heroImage.height = 1024;
            } else if (projectSlug === 'lord-abbett-data-users') {
                heroImage.src = 'images/lord-abbett/dashboard.png';
                heroImage.width = 1536;
                heroImage.height = 1024;
            } else if (projectSlug === 'pearson-online-education') {
                heroImage.src = 'images/pearson/dashboard.png';
                heroImage.width = 1536;
                heroImage.height = 1024;
            } else if (projectSlug === 'g2a-global-ecommerce') {
                heroImage.src = 'images/g2a/dashboard.png';
                heroImage.width = 1536;
                heroImage.height = 1024;
            } else if (projectSlug === 'ibm-bluedot-intelligence') {
                heroImage.src = 'images/ibm/dashboard.png';
                heroImage.width = 1536;
                heroImage.height = 1024;
            } else if (projectSlug === 'glg-expert-network') {
                heroImage.src = 'images/glg/dashboard.png';
                heroImage.alt = 'GLG Expert Network Platform dashboard showing expert search, project management, and industry insights';
                heroImage.width = 1536;
                heroImage.height = 1024;
                console.debug('[casestudyUpdateHero] Set GLG hero image to images/glg/dashboard.png');
            } else if (projectSlug === 'td-ameritrade-ux-analysis') {
                heroImage.src = 'images/td-ameritrade/dashboard.png';
                heroImage.alt = 'thinkorswim by Charles Schwab trading platform showing multi-device trading interface with charts and market data';
                heroImage.width = 1536;
                heroImage.height = 1024;
                console.debug('[casestudyUpdateHero] Set TD Ameritrade hero image to images/td-ameritrade/dashboard.png');
            } else {
                // Default image for other case studies
                heroImage.src = 'images/case-study-hero-D8N--dk8.jpg';
            }
        }
    } catch (error) {
        console.error('[casestudyUpdateHero] Error updating hero:', error);
    }
};

/**
 * Case study initialization function
 * Loads case study data based on URL parameter and renders all sections
 * 
 * @returns {void}
 */
const casestudyInit = () => {
    try {
        // Get case study slug from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const projectSlug = urlParams.get('project') || 'fiserv-cfo-ai-automation'; // Default to Fiserv
        
        console.debug(`[casestudyInit] Loading case study: ${projectSlug}`);
        
        /**
         * Apply case study-specific theme and images dynamically
         * 
         * Each case study can have its own color theme and custom images:
         * - Fiserv: Orange/Brown theme
         * - JobBot: Blue/Cyan theme
         * - ADP: Red/Black theme
         * - Lord Abbett: Green/Blue-Green theme
         * - Pearson: Dark Blue/Light Blue theme
         * - G2A: Orange/White theme
         * - IBM: Dark Blue/Glowing Blue theme
         * - GLG: Dark Blue/Light Blue theme
         * - TD Ameritrade: Dark Gray/Green theme
         * 
         * Themes are applied via CSS classes on the body element.
         * Images are set dynamically based on the project slug.
         */
        const heroImage = document.querySelector('.casestudy-hero-image');
        const processImage = document.querySelector('.casestudy-process-image');
        const resultsImage = document.querySelector('.casestudy-results-image');
        
        /**
         * Helper function to remove all theme classes
         * Ensures clean theme switching without conflicts
         */
        const removeAllThemes = () => {
            document.body.classList.remove('fiserv-theme', 'jobbot-theme', 'adp-theme', 'lordabbett-theme', 'pearson-theme', 'g2a-theme', 'ibm-theme', 'glg-theme', 'td-ameritrade-theme');
        };
        
        // Fiserv Case Study: Orange/Brown theme with custom images
        if (projectSlug === 'fiserv-cfo-ai-automation') {
            removeAllThemes();
            document.body.classList.add('fiserv-theme');
            if (heroImage) {
                heroImage.src = 'images/fiserv/dashboard.png';
            }
            if (processImage) {
                processImage.src = 'images/fiserv/process.png';
                processImage.alt = 'Data Compass home page showcasing AI-powered analytics dashboard';
                processImage.width = 1024;
                processImage.height = 1024;
            }
            if (resultsImage) {
                resultsImage.src = 'images/fiserv/before-after.png';
                resultsImage.alt = 'Before and after comparison showing transformation from manual spreadsheets to automated dashboard';
                resultsImage.width = 2454;
                resultsImage.height = 1276;
            }
        // JobBot Case Study: Blue/Cyan theme with custom images
        } else if (projectSlug === 'jobbot-email-automation') {
            removeAllThemes();
            document.body.classList.add('jobbot-theme');
            if (heroImage) {
                heroImage.src = 'images/jobbot/dashboard.png';
                heroImage.alt = 'Job automation dashboard showing email processing and resume generation interface';
                heroImage.width = 1536;
                heroImage.height = 1024;
                console.debug('[casestudyInit] Set JobBot hero image to images/jobbot/dashboard.png');
            }
            if (processImage) {
                processImage.src = 'images/jobbot/process.png';
                processImage.alt = 'JobBot automation workflow showing email scanning, AI analysis, and draft creation process';
                processImage.width = 1024;
                processImage.height = 1024;
            }
            if (resultsImage) {
                resultsImage.src = 'images/jobbot/before-after.png';
                resultsImage.alt = 'Before and after comparison showing transformation from manual email processing to automated JobBot dashboard';
                resultsImage.width = 1536;
                resultsImage.height = 1024;
            }
        // ADP Case Study: Red/Black theme with custom images
        } else if (projectSlug === 'adp-customer-support-chatbots') {
            removeAllThemes();
            document.body.classList.add('adp-theme');
            if (heroImage) {
                heroImage.src = 'images/adp/dashboard.png';
                heroImage.alt = 'Customer Support Chatbots dashboard showing AI-powered conversation automation';
                heroImage.width = 1536;
                heroImage.height = 1024;
            }
            if (processImage) {
                processImage.src = 'images/adp/process.png';
                processImage.alt = 'ADP chatbot development process: Support Volume Analysis, Conversation Design, Interface Prototyping, and Training & Optimization';
                processImage.width = 1024;
                processImage.height = 1024;
            }
            if (resultsImage) {
                resultsImage.src = 'images/adp/before-after.png';
                resultsImage.alt = 'Before and after comparison showing transformation from manual ticket management to AI-powered customer support chatbots';
                resultsImage.width = 1536;
                resultsImage.height = 1024;
            }
        // Lord Abbett Case Study: Green/Blue-Green theme with custom hero image
        } else if (projectSlug === 'lord-abbett-data-users') {
            removeAllThemes();
            document.body.classList.add('lordabbett-theme');
            if (heroImage) {
                heroImage.src = 'images/lord-abbett/dashboard.png';
                heroImage.alt = 'Lord Abbett data analysis dashboard showing user interviews and data visualizations';
                heroImage.width = 1536;
                heroImage.height = 1024;
            }
            if (processImage) {
                processImage.src = 'images/lord-abbett/process.png';
                processImage.alt = 'Lord Abbett user research and personas process: User Research, Data Visualization Design, UI Personalization System, and Error Handling & Security';
                processImage.width = 1024;
                processImage.height = 1024;
            }
            if (resultsImage) {
                resultsImage.src = 'images/lord-abbett/before-after.png';
                resultsImage.alt = 'Before and after comparison showing transformation from text-heavy interface to modern Lord Abbett dashboard with data visualizations';
                resultsImage.width = 1536;
                resultsImage.height = 1024;
            }
        // Pearson Case Study: Dark Blue/Light Blue theme with custom hero image
        } else if (projectSlug === 'pearson-online-education') {
            removeAllThemes();
            document.body.classList.add('pearson-theme');
            if (heroImage) {
                heroImage.src = 'images/pearson/dashboard.png';
                heroImage.alt = 'Pearson Online Education Platform dashboard showing learning progression, personalized reports, assessments, and grade banding';
                heroImage.width = 1536;
                heroImage.height = 1024;
            }
            // Pearson process image: 4-step educational workflow
            if (processImage) {
                processImage.src = 'images/pearson/process.png';
                processImage.alt = 'Pearson online education process: User Research, Personalized Learning, Assessment Tools, and Educational Content';
                processImage.width = 1024;
                processImage.height = 1024;
            }
            // Pearson results image: Before/After comparison
            if (resultsImage) {
                resultsImage.src = 'images/pearson/beforeAfter.png';
                resultsImage.alt = 'Before and after comparison showing transformation from cluttered light-themed interface to modern dark-themed Pearson educational platform with improved navigation and data visualization';
                resultsImage.width = 1536;
                resultsImage.height = 1024;
            }
        // G2A Case Study: Orange/White theme with custom hero image
        } else if (projectSlug === 'g2a-global-ecommerce') {
            removeAllThemes();
            document.body.classList.add('g2a-theme');
            if (heroImage) {
                heroImage.src = 'images/g2a/dashboard.png';
                heroImage.alt = 'G2A Global E-Commerce Platform dashboard showing sales analytics, revenue tracking, top selling products, and payment preferences';
                heroImage.width = 1536;
                heroImage.height = 1024;
            }
            // G2A process image: 4-step service design workflow
            if (processImage) {
                processImage.src = 'images/g2a/process.png';
                processImage.alt = 'G2A service design process: Service Design & Research, AI Recommender System, Blockchain Loyalty Design, and Team Building & Scaling';
                processImage.width = 1024;
                processImage.height = 1024;
            }
            // G2A results image: Before/After comparison showing KPI improvements
            if (resultsImage) {
                resultsImage.src = 'images/g2a/beforeAfter.png';
                resultsImage.alt = 'Before and after comparison showing G2A platform improvements: Revenue Growth (18% to 52%), Customer Loyalty (+22% to +63%), Daily Orders (8,900 to 17,500), and Refunds Declined (2,100 to 8,400)';
                resultsImage.width = 1536;
                resultsImage.height = 1024;
            }
        // IBM Case Study: Dark Blue/Glowing Blue theme with custom images
        } else if (projectSlug === 'ibm-bluedot-intelligence') {
            removeAllThemes();
            document.body.classList.add('ibm-theme');
            if (heroImage) {
                heroImage.src = 'images/ibm/dashboard.png';
                heroImage.alt = 'IBM Bluedot Intelligence Dashboard showing intelligence-driven research platform with NLP entities, intelligence briefs, opportunities tracker, and market development funnel';
                heroImage.width = 1536;
                heroImage.height = 1024;
            }
            // IBM process image: 4-step intelligence platform workflow
            if (processImage) {
                processImage.src = 'images/ibm/process.png';
                processImage.alt = 'IBM Bluedot Intelligence process: User Research & Personas, Natural Language Processing, Rapid Prototyping, and User Journey Mapping';
                processImage.width = 1024;
                processImage.height = 1024;
            }
            // IBM results image: Before/After comparison
            if (resultsImage) {
                resultsImage.src = 'images/ibm/beforeAfter.png';
                resultsImage.alt = 'Before and after comparison showing transformation from traditional Rational Software Architect interface to modern IBM Bluedot Intelligence-driven research dashboard';
                resultsImage.width = 1536;
                resultsImage.height = 1024;
            }
        // GLG Case Study: Dark Blue/Light Blue theme with custom hero image
        } else if (projectSlug === 'glg-expert-network') {
            removeAllThemes();
            document.body.classList.add('glg-theme');
            if (heroImage) {
                heroImage.src = 'images/glg/dashboard.png';
                heroImage.alt = 'GLG Expert Network Platform dashboard showing expert search, project management, and industry insights';
                heroImage.width = 1536;
                heroImage.height = 1024;
            }
            // GLG process image: Expert network workflow
            if (processImage) {
                processImage.src = 'images/glg/process.png';
                processImage.alt = 'GLG Expert Network Platform process: Service Design & Research, AI Recommender System, Blockchain Loyalty Design, and Team Building & Scaling';
                processImage.width = 1024;
                processImage.height = 1024;
            }
            // GLG results image: Before/After comparison
            if (resultsImage) {
                resultsImage.src = 'images/glg/beforeAfter.png';
                resultsImage.alt = 'Before and after comparison showing transformation from traditional GLG Research interface to modern GLG Expert Network Platform with interactive data visualizations and network graphs';
                resultsImage.width = 1536;
                resultsImage.height = 1024;
            }
        // TD Ameritrade Case Study: Dark Gray/Green theme with custom hero image
        } else if (projectSlug === 'td-ameritrade-ux-analysis') {
            removeAllThemes();
            document.body.classList.add('td-ameritrade-theme');
            if (heroImage) {
                heroImage.src = 'images/td-ameritrade/dashboard.png';
                heroImage.alt = 'thinkorswim by Charles Schwab trading platform showing multi-device trading interface with charts and market data';
                heroImage.width = 1536;
                heroImage.height = 1024;
            }
            // TD Ameritrade process image: thinkorswim development cycle
            if (processImage) {
                processImage.src = 'images/td-ameritrade/process.png';
                processImage.alt = 'thinkorswim development process: Research (Expert Interviews, User Feedback, Market Analysis), Design & Prototype (Wireframes, User Testing, Interactive Prototypes), and Implement & Iterate (Deploy Updates, Gather Data, Refine Features)';
                processImage.width = 1024;
                processImage.height = 1024;
            }
            // TD Ameritrade results image: Before/After comparison
            if (resultsImage) {
                resultsImage.src = 'images/td-ameritrade/beforeAfter.png';
                resultsImage.alt = 'Before and after comparison showing transformation from traditional TD Ameritrade retail brokerage website to modern thinkorswim by Charles Schwab multi-device trading platform';
                resultsImage.width = 1536;
                resultsImage.height = 1024;
            }
        // Default: Generic theme and images for other case studies
        } else {
            removeAllThemes();
            if (heroImage) {
                heroImage.src = 'images/case-study-hero-D8N--dk8.jpg';
            }
            if (processImage) {
                processImage.src = 'images/automation-process-DeeIjsdF.jpg';
                processImage.alt = 'AI automation workflow visualization showing connected processes';
                processImage.width = 1024;
                processImage.height = 1024;
            }
            if (resultsImage) {
                resultsImage.src = 'images/results-impact-B0j-uv-D.jpg';
                resultsImage.alt = 'Before and after comparison showing transformation from manual spreadsheets to automated dashboard';
                resultsImage.width = 1024;
                resultsImage.height = 1024;
            }
        }
        
        // Load case study data
        const caseStudyData = getCaseStudyData(projectSlug);
        
        if (!caseStudyData) {
            console.error('[casestudyInit] No data found for case study, using defaults');
            // Fallback to default rendering
            casestudyRenderOverviewCards();
            casestudyRenderProcessSteps();
            casestudyRenderResultStats();
            casestudyRenderResultCards();
            casestudyRenderWorkedWellList();
            casestudyRenderChallengesList();
            casestudyRenderInsightsCards();
            // Keep default testimonial from HTML
        } else {
            // Update hero section with dynamic content
            casestudyUpdateHero(caseStudyData);
            
            // Render with loaded data
            casestudyRenderOverviewCards(caseStudyData.overview_cards);
            casestudyRenderProcessSteps(caseStudyData.process_steps);
            casestudyRenderResultStats(caseStudyData.result_stats || []);
            casestudyRenderResultCards(caseStudyData.result_cards || []);
            casestudyRenderWorkedWellList(caseStudyData.worked_well || []);
            casestudyRenderChallengesList(caseStudyData.challenges || []);
            casestudyRenderInsightsCards(caseStudyData.insights || []);
            casestudyRenderTestimonial(caseStudyData.testimonial || null);
        }
        
        initMobileMenu();
        initSmoothScroll();
        setCurrentYear();
    } catch (error) {
        console.error('[casestudyInit] Error during initialization:', error);
    }
};

/* ==========================================================================
   PAGE DETECTION & INITIALIZATION
   ========================================================================== */

/**
 * Detects which page we're on and initializes accordingly
 * 
 * Page Detection Strategy:
 * 1. Check for body class (primary method)
 * 2. Check for page-specific DOM elements (fallback)
 * 3. Gracefully handles missing elements
 * 
 * To add a new page type:
 * 1. Add a new body class (e.g., 'blogpage-page')
 * 2. Create corresponding init function (e.g., blogpageInit)
 * 3. Add detection logic here
 * 
 * @returns {void}
 * @throws {Error} Logs errors but doesn't throw to prevent page breakage
 */
const init = () => {
    try {
        const body = document.body;
        
        // Homepage detection
        if (body.classList.contains('homepage-page') || document.getElementById('projectsGrid')) {
            console.debug('[init] Detected homepage, initializing...');
            homepageInit();
            return;
        }
        
        // Case study page detection
        if (body.classList.contains('casestudy-page') || document.getElementById('overviewGrid')) {
            console.debug('[init] Detected case study page, initializing...');
            casestudyInit();
            
            // Optional: Load case study data based on URL parameter
            const urlParams = new URLSearchParams(window.location.search);
            const projectSlug = urlParams.get('project');
            if (projectSlug && window.PORTFOLIO_CONFIG) {
                const caseStudy = window.PORTFOLIO_CONFIG.getCaseStudy(projectSlug);
                if (caseStudy) {
                    console.debug(`[init] Case study found: ${caseStudy.title}`);
                    // Future: Dynamic content loading based on case study config
                } else {
                    console.warn(`[init] Case study not found for slug: ${projectSlug}`);
                }
            }
            return;
        }
        
        // Initialize mobile menu for any page that has it
        initMobileMenu();
        initSmoothScroll();
        setCurrentYear();
        
        // Fallback: try to initialize both (will gracefully fail if elements don't exist)
        console.warn('[init] Page type not detected, attempting fallback initialization');
        homepageInit();
        casestudyInit();
        
    } catch (error) {
        console.error('[init] Critical error during initialization:', error);
        // Don't throw - allow page to render even if JS fails
    }
};

/* ==========================================================================
   EVENT LISTENERS & INITIALIZATION
   ========================================================================== */

/**
 * Initialize application when DOM is ready
 * 
 * Uses multiple strategies for maximum compatibility:
 * 1. DOMContentLoaded event (standard)
 * 2. Immediate execution if DOM already loaded
 * 3. Window load fallback (last resort)
 */
const initializeApp = () => {
    if (document.readyState === 'loading') {
        // DOM is still loading, wait for DOMContentLoaded
        document.addEventListener('DOMContentLoaded', init);
    } else if (document.readyState === 'interactive' || document.readyState === 'complete') {
        // DOM is already loaded or interactive
        init();
    } else {
        // Fallback: wait for window load
        window.addEventListener('load', init);
    }
};

// Start initialization
initializeApp();

