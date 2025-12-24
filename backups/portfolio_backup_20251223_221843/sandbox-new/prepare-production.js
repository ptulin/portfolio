#!/usr/bin/env node

/**
 * Production Preparation Script
 * 
 * This script helps prepare the project for production deployment by:
 * - Checking for common issues
 * - Validating file structure
 * - Providing optimization recommendations
 * 
 * Usage: node prepare-production.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
        log(`✓ ${description}`, colors.green);
        return true;
    } else {
        log(`✗ ${description} - MISSING`, colors.red);
        return false;
    }
}

function checkFileSize(filePath, maxSizeKB, description) {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        const sizeKB = stats.size / 1024;
        if (sizeKB > maxSizeKB) {
            log(`⚠ ${description} - ${sizeKB.toFixed(2)}KB (recommended: <${maxSizeKB}KB)`, colors.yellow);
            return false;
        } else {
            log(`✓ ${description} - ${sizeKB.toFixed(2)}KB`, colors.green);
            return true;
        }
    }
    return false;
}

function main() {
    log('\n🚀 Production Preparation Checklist\n', colors.cyan);
    
    let allPassed = true;
    
    // Core Files
    log('\n📄 Core Files:', colors.blue);
    allPassed &= checkFile('index.html', 'Homepage');
    allPassed &= checkFile('about.html', 'About page');
    allPassed &= checkFile('contact.html', 'Contact page');
    allPassed &= checkFile('case-study.html', 'Case study template');
    allPassed &= checkFile('resume/index.html', 'Resume password entry');
    allPassed &= checkFile('resume/access.html', 'Resume display');
    
    // Assets
    log('\n🎨 Assets:', colors.blue);
    allPassed &= checkFile('common.css', 'Common stylesheet');
    allPassed &= checkFile('common.js', 'Common JavaScript');
    allPassed &= checkFile('config.js', 'Configuration file');
    allPassed &= checkFile('case_studies_data.js', 'Case study data');
    allPassed &= checkFile('js/utils.js', 'Backend utilities');
    
    // SEO Files
    log('\n🔍 SEO Files:', colors.blue);
    allPassed &= checkFile('sitemap.xml', 'Sitemap');
    allPassed &= checkFile('robots.txt', 'Robots.txt');
    allPassed &= checkFile('404.html', '404 error page');
    
    // File Sizes
    log('\n📊 File Size Checks:', colors.blue);
    checkFileSize('common.css', 100, 'common.css');
    checkFileSize('common.js', 100, 'common.js');
    checkFileSize('case_studies_data.js', 200, 'case_studies_data.js');
    
    // Recommendations
    log('\n💡 Recommendations:', colors.blue);
    log('  • Minify CSS and JavaScript files', colors.yellow);
    log('  • Optimize images (convert to WebP format)', colors.yellow);
    log('  • Add Google Analytics tracking code', colors.yellow);
    log('  • Test all forms and links', colors.yellow);
    log('  • Run Lighthouse audit (target: >90)', colors.yellow);
    log('  • Verify HTTPS is enabled', colors.yellow);
    log('  • Set up error tracking', colors.yellow);
    
    // Final Status
    log('\n' + '='.repeat(50), colors.cyan);
    if (allPassed) {
        log('✅ All core files present!', colors.green);
    } else {
        log('⚠️  Some files are missing. Please review above.', colors.yellow);
    }
    log('='.repeat(50) + '\n', colors.cyan);
    
    log('📚 Documentation:', colors.blue);
    log('  • README.md - Project overview', colors.reset);
    log('  • ARCHITECTURE.md - Architecture guide', colors.reset);
    log('  • OPTIMIZATION_SUMMARY.md - Optimization details', colors.reset);
    log('  • DEPLOYMENT_CHECKLIST.md - Deployment guide', colors.reset);
    
    log('\n🎯 Next Steps:', colors.blue);
    log('  1. Review DEPLOYMENT_CHECKLIST.md', colors.reset);
    log('  2. Minify assets (optional but recommended)', colors.reset);
    log('  3. Optimize images', colors.reset);
    log('  4. Test in multiple browsers', colors.reset);
    log('  5. Run Lighthouse audit', colors.reset);
    log('  6. Deploy to production\n', colors.reset);
}

main();

