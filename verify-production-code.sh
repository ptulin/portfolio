#!/bin/bash
# Verify Production Code is Correct

echo "🔍 Verifying Production Code..."
echo ""

ERRORS=0

# Check GLG configuration
echo "Checking GLG case study..."
if grep -q "glg-expert-network" common.js case_studies_data.js config.js; then
    echo "✅ GLG case study data found"
else
    echo "❌ GLG case study data MISSING"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "glg-theme" common.css common.js; then
    echo "✅ GLG theme found"
else
    echo "❌ GLG theme MISSING"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "images/glg/dashboard.png" ] && [ -f "images/glg/process.png" ] && [ -f "images/glg/before-after.png" ]; then
    echo "✅ GLG images found"
else
    echo "❌ GLG images MISSING"
    ERRORS=$((ERRORS + 1))
fi

# Check TD Ameritrade configuration
echo ""
echo "Checking TD Ameritrade case study..."
if grep -q "td-ameritrade-ux-analysis" common.js case_studies_data.js config.js; then
    echo "✅ TD Ameritrade case study data found"
else
    echo "❌ TD Ameritrade case study data MISSING"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "td-ameritrade-theme" common.css common.js; then
    echo "✅ TD Ameritrade theme found"
else
    echo "❌ TD Ameritrade theme MISSING"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "images/td-ameritrade/dashboard.png" ] && [ -f "images/td-ameritrade/process.png" ] && [ -f "images/td-ameritrade/before-after.png" ]; then
    echo "✅ TD Ameritrade images found"
else
    echo "❌ TD Ameritrade images MISSING"
    ERRORS=$((ERRORS + 1))
fi

# Check image filename consistency
echo ""
echo "Checking image filename consistency..."
if grep -q "before-after.png" common.js; then
    echo "✅ Code uses before-after.png (standardized)"
else
    echo "❌ Code still references old beforeAfter.png"
    ERRORS=$((ERRORS + 1))
fi

# Summary
echo ""
echo "=========================================="
if [ $ERRORS -eq 0 ]; then
    echo "✅ All checks passed! Code is ready for deployment."
    exit 0
else
    echo "❌ Found $ERRORS issue(s). Please fix before deploying."
    exit 1
fi

