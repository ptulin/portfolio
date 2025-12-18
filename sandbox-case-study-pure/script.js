/**
 * Case Study Page JavaScript
 * 
 * Manages dynamic content rendering, smooth scrolling, and footer year update.
 * All content is rendered client-side for optimal performance and maintainability.
 * 
 * @file Manages dynamic content rendering, smooth scrolling, and footer year update.
 * @author Pawel Tulin
 * @version 1.0.0
 * @since 1.0.0
 */

'use strict';

// ============================================================================
// DATA DEFINITIONS & TYPE DOCUMENTATION
// ============================================================================

/**
 * @typedef {Object} OverviewCard
 * @property {string} icon - SVG icon string for the overview card.
 * @property {string} title - The title of the overview card.
 * @property {string} description - A brief description of the overview card.
 */

/**
 * @typedef {Object} ProcessStep
 * @property {string} number - The step number (e.g., "01").
 * @property {string} title - The title of the process step.
 * @property {string} description - A detailed description of the process step.
 */

/**
 * @typedef {Object} ResultStat
 * @property {string} value - The statistic value (e.g., "70%").
 * @property {string} label - The label for the statistic.
 * @property {string} description - A brief description of the statistic.
 */

/**
 * @typedef {Object} ResultCard
 * @property {string} title - The title of the result card.
 * @property {string} description - A detailed description of the result.
 */

/**
 * @typedef {Object} InsightCard
 * @property {string} title - The title of the insight card.
 * @property {string} description - A detailed description of the insight.
 */

/**
 * @type {OverviewCard[]}
 * @description Array containing data for each project overview card.
 */
const overviewCards = [
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
 * @type {ProcessStep[]}
 * @description Array containing data for each design process step.
 */
const processSteps = [
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
 * @type {ResultStat[]}
 * @description Array containing data for each result statistic.
 */
const resultStats = [
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
 * @type {ResultCard[]}
 * @description Array containing data for each result card.
 */
const resultCards = [
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
 * @type {string[]}
 * @description Array containing items that worked well.
 */
const workedWellItems = [
    "Early involvement of end-users in AI model training",
    "Progressive disclosure of automation complexity",
    "Real-time feedback loops for continuous improvement",
    "Human-in-the-loop for critical financial decisions"
];

/**
 * @type {string[]}
 * @description Array containing challenges faced.
 */
const challengesItems = [
    "Initial resistance to AI-driven processes",
    "Legacy system integration complexities",
    "Balancing automation with user control"
];

/**
 * @type {InsightCard[]}
 * @description Array containing data for each key insight card.
 */
const insightsCards = [
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

// ============================================================================
// RENDERING FUNCTIONS
// ============================================================================

/**
 * Renders the overview cards into the DOM.
 * Creates article elements for each overview card with proper accessibility attributes.
 * 
 * @function renderOverviewCards
 * @returns {void}
 * @throws {Error} Logs error if overview grid element is not found
 */
function renderOverviewCards() {
    const grid = document.getElementById('overviewGrid');
    if (!grid) {
        console.error('[renderOverviewCards] Overview grid element not found.');
        return;
    }

    try {
        grid.innerHTML = overviewCards.map((card, index) => {
            const cardId = `overview-card-${index}`;
            const titleId = `overview-title-${card.title.replace(/\s+/g, '-').toLowerCase()}`;
            
            return `
                <article 
                    class="overview-card" 
                    id="${cardId}"
                    aria-labelledby="${titleId}" 
                    tabindex="0"
                    role="listitem"
                >
                    <div class="overview-card-icon" aria-hidden="true">
                        ${card.icon}
                    </div>
                    <h3 id="${titleId}" class="overview-card-title">
                        ${escapeHTML(card.title)}
                    </h3>
                    <p class="overview-card-description">
                        ${escapeHTML(card.description)}
                    </p>
                </article>
            `;
        }).join('');
    } catch (error) {
        console.error('[renderOverviewCards] Error rendering overview cards:', error);
    }
}

/**
 * Renders the design process steps into the DOM.
 * Creates step elements with numbered indicators and content.
 * 
 * @function renderProcessSteps
 * @returns {void}
 * @throws {Error} Logs error if process steps container is not found
 */
function renderProcessSteps() {
    const container = document.getElementById('processSteps');
    if (!container) {
        console.error('[renderProcessSteps] Process steps container not found.');
        return;
    }

    try {
        container.innerHTML = processSteps.map((step, index) => {
            const stepId = `process-step-${index}`;
            
            return `
                <div class="process-step" id="${stepId}" role="listitem">
                    <div class="process-step-number" aria-label="Step ${step.number}">
                        <span>${escapeHTML(step.number)}</span>
                    </div>
                    <div class="process-step-content">
                        <h3>${escapeHTML(step.title)}</h3>
                        <p>${escapeHTML(step.description)}</p>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('[renderProcessSteps] Error rendering process steps:', error);
    }
}

/**
 * Renders the result statistics into the DOM.
 * Creates statistic cards with values, labels, and descriptions.
 * 
 * @function renderResultStats
 * @returns {void}
 * @throws {Error} Logs error if results stats container is not found
 */
function renderResultStats() {
    const container = document.getElementById('resultsStats');
    if (!container) {
        console.error('[renderResultStats] Results stats container not found.');
        return;
    }

    try {
        container.innerHTML = resultStats.map((stat, index) => {
            const statId = `result-stat-${index}`;
            
            return `
                <div class="result-stat" id="${statId}" role="listitem">
                    <div class="result-stat-value" aria-label="${escapeHTML(stat.value)}">
                        ${escapeHTML(stat.value)}
                    </div>
                    <div class="result-stat-label">
                        ${escapeHTML(stat.label)}
                    </div>
                    <div class="result-stat-description">
                        ${escapeHTML(stat.description)}
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('[renderResultStats] Error rendering result stats:', error);
    }
}

/**
 * Renders the result cards into the DOM.
 * Creates cards displaying additional result information.
 * 
 * @function renderResultCards
 * @returns {void}
 * @throws {Error} Logs error if results cards container is not found
 */
function renderResultCards() {
    const container = document.getElementById('resultsCards');
    if (!container) {
        console.error('[renderResultCards] Results cards container not found.');
        return;
    }

    try {
        container.innerHTML = resultCards.map((card, index) => {
            const cardId = `result-card-${index}`;
            
            return `
                <div class="result-card" id="${cardId}" role="listitem">
                    <h4>${escapeHTML(card.title)}</h4>
                    <p>${escapeHTML(card.description)}</p>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('[renderResultCards] Error rendering result cards:', error);
    }
}

/**
 * Renders the "worked well" list items into the DOM.
 * Creates list items with checkmark icons for successful aspects.
 * 
 * @function renderWorkedWellList
 * @returns {void}
 * @throws {Error} Logs error if worked well list element is not found
 */
function renderWorkedWellList() {
    const list = document.getElementById('workedWellList');
    if (!list) {
        console.error('[renderWorkedWellList] Worked well list element not found.');
        return;
    }

    try {
        list.innerHTML = workedWellItems.map((item, index) => `
            <li role="listitem" id="worked-well-item-${index}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span>${escapeHTML(item)}</span>
            </li>
        `).join('');
    } catch (error) {
        console.error('[renderWorkedWellList] Error rendering worked well list:', error);
    }
}

/**
 * Renders the challenges list items into the DOM.
 * Creates list items with warning icons for challenges faced.
 * 
 * @function renderChallengesList
 * @returns {void}
 * @throws {Error} Logs error if challenges list element is not found
 */
function renderChallengesList() {
    const list = document.getElementById('challengesList');
    if (!list) {
        console.error('[renderChallengesList] Challenges list element not found.');
        return;
    }

    try {
        list.innerHTML = challengesItems.map((item, index) => `
            <li role="listitem" id="challenge-item-${index}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lessons-icon-challenge" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>${escapeHTML(item)}</span>
            </li>
        `).join('');
    } catch (error) {
        console.error('[renderChallengesList] Error rendering challenges list:', error);
    }
}

/**
 * Renders the insights cards into the DOM.
 * Creates insight cards with titles and descriptions.
 * 
 * @function renderInsightsCards
 * @returns {void}
 * @throws {Error} Logs error if insights grid element is not found
 */
function renderInsightsCards() {
    const grid = document.getElementById('insightsGrid');
    if (!grid) {
        console.error('[renderInsightsCards] Insights grid element not found.');
        return;
    }

    try {
        grid.innerHTML = insightsCards.map((card, index) => {
            const cardId = `insight-card-${index}`;
            
            return `
                <div class="insight-card" id="${cardId}" role="listitem">
                    <h4>${escapeHTML(card.title)}</h4>
                    <p>${escapeHTML(card.description)}</p>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('[renderInsightsCards] Error rendering insights cards:', error);
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Escapes HTML entities in a string to prevent XSS attacks.
 * Uses DOM text node creation to safely escape all HTML special characters.
 * 
 * @function escapeHTML
 * @param {string} str - The string to escape
 * @returns {string} The escaped string safe for HTML insertion
 * @example
 * escapeHTML('<script>alert("XSS")</script>')
 * // Returns: "&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;"
 */
function escapeHTML(str) {
    if (typeof str !== 'string') {
        console.warn('[escapeHTML] Non-string value provided, converting to string.');
        str = String(str);
    }
    
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

/**
 * Initializes smooth scrolling for all anchor links.
 * Adds click event listeners to all internal anchor links for smooth scrolling behavior.
 * 
 * @function initSmoothScroll
 * @returns {void}
 */
function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    if (anchors.length === 0) {
        console.debug('[initSmoothScroll] No anchor links found.');
        return;
    }

    anchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Handle empty hash (scroll to top)
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                console.warn(`[initSmoothScroll] Scroll target not found for: ${targetId}`);
            }
        });
    });
}

/**
 * Sets the current year in the footer copyright notice.
 * Dynamically updates the year to always show the current year.
 * 
 * @function setCurrentYear
 * @returns {void}
 */
function setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = currentYear;
    } else {
        console.warn('[setCurrentYear] Element with ID "currentYear" not found.');
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initializes all necessary scripts when the DOM is fully loaded.
 * Renders all dynamic content and sets up event listeners.
 * 
 * @event DOMContentLoaded
 * @listens {Event} DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Render all dynamic content sections
        renderOverviewCards();
        renderProcessSteps();
        renderResultStats();
        renderResultCards();
        renderWorkedWellList();
        renderChallengesList();
        renderInsightsCards();
        
        // Initialize interactive features
        initSmoothScroll();
        setCurrentYear();
        
        console.debug('[Initialization] All components initialized successfully.');
    } catch (error) {
        console.error('[Initialization] Error during initialization:', error);
    }
});

