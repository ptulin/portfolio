#!/bin/bash
# Verification Pack for /pawel/ .htaccess fix
# Run: bash verify-406-fix.sh

echo "=========================================="
echo "Verification Pack: /pawel/ .htaccess Fix"
echo "=========================================="
echo ""

URL="https://disruptiveexperience.com/pawel/"

echo "TEST 1: Default request"
echo "----------------------"
STATUS=$(curl -s -D- -o /dev/null --http1.1 "$URL" | head -1)
HEADER=$(curl -s -D- -o /dev/null --http1.1 "$URL" | grep -i "x-dx-htaccess" | tr -d '\r')
echo "Status: $STATUS"
echo "Header: $HEADER"
echo ""

echo "TEST 2: User-Agent: Mozilla/5.0"
echo "----------------------"
STATUS=$(curl -s -D- -o /dev/null --http1.1 -A "Mozilla/5.0" "$URL" | head -1)
HEADER=$(curl -s -D- -o /dev/null --http1.1 -A "Mozilla/5.0" "$URL" | grep -i "x-dx-htaccess" | tr -d '\r')
echo "Status: $STATUS"
echo "Header: $HEADER"
echo ""

echo "TEST 3: User-Agent: python-requests/2.31.0"
echo "----------------------"
STATUS=$(curl -s -D- -o /dev/null --http1.1 -A "python-requests/2.31.0" "$URL" | head -1)
HEADER=$(curl -s -D- -o /dev/null --http1.1 -A "python-requests/2.31.0" "$URL" | grep -i "x-dx-htaccess" | tr -d '\r')
echo "Status: $STATUS"
echo "Header: $HEADER"
echo ""

echo "=========================================="
echo "Summary:"
echo "=========================================="
echo "✅ GOOD: 200/301/302 + X-DX-HTACCESS: pawel-on"
echo "❌ BLOCKED: 406 (ModSecurity - expected until host exception added)"
echo "⚠️  ERROR: 500 (check .htaccess syntax)"
echo ""
