#!/bin/bash
# Test script to run from server SSH
# Run: bash test-406-from-server.sh

echo "=== TESTING FROM SERVER (SSH) ==="
echo ""

echo "Test 1: Default curl"
curl -I --http1.1 https://disruptiveexperience.com/pawel/ 2>&1 | head -15
echo ""

echo "Test 2: Empty User-Agent"
curl -I --http1.1 -A "" https://disruptiveexperience.com/pawel/ 2>&1 | head -15
echo ""

echo "Test 3: Mozilla/5.0"
curl -I --http1.1 -A "Mozilla/5.0" https://disruptiveexperience.com/pawel/ 2>&1 | head -15
echo ""

echo "Test 4: python-requests/2.31.0"
curl -I --http1.1 -A "python-requests/2.31.0" https://disruptiveexperience.com/pawel/ 2>&1 | head -15
echo ""

echo "Test 5: Accept: */*"
curl -I --http1.1 -H "Accept: */*" https://disruptiveexperience.com/pawel/ 2>&1 | head -15
echo ""

echo "=== Checking for ModSecurity audit logs ==="
echo "If any test returned 406, check these log locations:"
echo "  - /usr/local/apache/logs/error_log"
echo "  - /var/log/apache2/error_log"
echo "  - /home1/moose/logs/error_log"
echo "  - cPanel Error Log (cPanel -> Errors)"
echo ""
echo "Search for: '406', 'ModSecurity', 'pawel', 'Mozilla/5.0'"
