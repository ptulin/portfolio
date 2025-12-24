/**
 * Portfolio Configuration
 * 
 * Centralized configuration for the portfolio website.
 * This file allows easy extension for additional case studies and pages.
 * 
 * @author Pawel Tulin
 * @version 1.0.0
 */

'use strict';

/**
 * Case Study Configuration
 * 
 * To add a new case study:
 * 1. Add an entry to CASE_STUDIES with a unique slug
 * 2. Create the corresponding data in common.js (casestudyOverviewCards, etc.)
 * 3. Add the case study HTML template or use dynamic rendering
 * 
 * @type {Object.<string, Object>}
 */
const CASE_STUDIES = {
    'fiserv-cfo-ai-automation': {
        title: 'CFO AI Office Automation',
        company: 'Fiserv',
        slug: 'fiserv-cfo-ai-automation',
        category: 'AI Automation',
        meta: {
            duration: '6 Months',
            teamSize: '8 Members',
            role: 'Lead Product Designer'
        }
    },
    'jobbot-email-automation': {
        title: 'AI Email Automation Experiment',
        company: 'Jobbot',
        slug: 'jobbot-email-automation',
        category: 'AI Automation',
        meta: {
            duration: '3 Weeks',
            teamSize: 'Solo Project',
            role: 'Full-Stack Designer'
        }
    },
    'adp-customer-support-chatbots': {
        title: 'Customer Support Chatbots',
        company: 'ADP/Global',
        slug: 'adp-customer-support-chatbots',
        category: 'AI Automation',
        meta: {
            duration: '8 Months',
            teamSize: '12 Members',
            role: 'Lead UX Architect and Researcher'
        }
    },
    'lord-abbett-data-users': {
        title: 'Data & Users',
        company: 'Lord Abbett',
        slug: 'lord-abbett-data-users',
        category: 'Data Visualization',
        meta: {
            duration: '10 Months',
            teamSize: '10 Members',
            role: 'Lead Product Designer'
        }
    },
    'pearson-online-education': {
        title: 'Online Education Platform',
        company: 'Pearson',
        slug: 'pearson-online-education',
        category: 'Education Technology',
        meta: {
            duration: '12 Months',
            teamSize: '15 Members',
            role: 'Lead UX Designer'
        }
    },
    'g2a-global-ecommerce': {
        title: 'Global E-Commerce Platform',
        company: 'G2A',
        slug: 'g2a-global-ecommerce',
        category: 'E-Commerce',
        meta: {
            duration: '18 Months',
            teamSize: '25 Members',
            role: 'Lead Service Designer'
        }
    },
    'glg-expert-network': {
        title: 'Expert Network Platform',
        company: 'Gerson Lehrman Group',
        slug: 'glg-expert-network',
        category: 'Platform Design',
        meta: {
            duration: '14 Months',
            teamSize: '20 Members',
            role: 'Lead UX Designer'
        }
    },
    'ibm-bluedot-intelligence': {
        title: 'Bluedot Intelligence',
        company: 'IBM',
        slug: 'ibm-bluedot-intelligence',
        category: 'Intelligence Platform',
        meta: {
            duration: '5 Months',
            teamSize: '6 Members',
            role: 'UX Designer & Researcher'
        }
    },
    'td-ameritrade-ux-analysis': {
        title: 'UX Competitive Analysis & Heuristic Evaluation',
        company: 'TD Ameritrade',
        slug: 'td-ameritrade-ux-analysis',
        category: 'UX Research',
        meta: {
            duration: '4 Months',
            teamSize: '5 Members',
            role: 'UX Researcher & Analyst'
        }
    }
};

/**
 * Navigation Configuration
 * 
 * Defines navigation links for consistency across pages.
 * 
 * @type {Array.<Object>}
 */
const NAVIGATION_LINKS = [
    { href: '#work', label: 'Work', id: 'work' },
    { href: '#about', label: 'About', id: 'about' },
    { href: '#expertise', label: 'Service', id: 'expertise' },
    { href: '#contact', label: 'Contact', id: 'contact' }
];

/**
 * Contact Information
 * 
 * @type {Object}
 */
const CONTACT_INFO = {
    email: 'ptulin@gmail.com',
    linkedin: 'https://linkedin.com/in/paweltulin',
    availability: 'Available for new projects'
};

/**
 * Site Metadata
 * 
 * @type {Object}
 */
const SITE_META = {
    name: 'Pawel Tulin',
    title: 'AI-Driven Product Designer & UX Leader',
    description: 'Building enterprise-grade human-AI systems for fintech, SaaS, and mission-driven organizations.',
    author: 'Pawel Tulin'
};

/**
 * Get case study configuration by slug
 * 
 * @param {string} slug - Case study slug
 * @returns {Object|null} Case study configuration or null if not found
 */
const getCaseStudy = (slug) => {
    return CASE_STUDIES[slug] || null;
};

/**
 * Check if a case study exists
 * 
 * @param {string} slug - Case study slug
 * @returns {boolean} True if case study exists
 */
const hasCaseStudy = (slug) => {
    return slug in CASE_STUDIES;
};

/**
 * Get all case study slugs
 * 
 * @returns {string[]} Array of case study slugs
 */
const getAllCaseStudySlugs = () => {
    return Object.keys(CASE_STUDIES);
};

// Export configuration (for use in modules or global access)
if (typeof window !== 'undefined') {
    window.PORTFOLIO_CONFIG = {
        CASE_STUDIES,
        NAVIGATION_LINKS,
        CONTACT_INFO,
        SITE_META,
        getCaseStudy,
        hasCaseStudy,
        getAllCaseStudySlugs
    };
}

