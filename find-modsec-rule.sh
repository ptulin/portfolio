#!/bin/bash
# Script to find ModSecurity rule ID blocking /pawel/
# Run from server SSH after reproducing 406 error

echo "=== Finding ModSecurity Rule ID ==="
echo ""

# Step 1: Reproduce 406
echo "Step 1: Reproducing 406 error..."
curl -I --http1.1 -A "python-requests/2.31.0" https://disruptiveexperience.com/pawel/ 2>&1 | head -10
echo ""

# Step 2: Check Apache error log
echo "Step 2: Checking Apache error log..."
echo "Looking in common log locations:"
echo ""

# Try common log locations
for log in \
    "/usr/local/apache/logs/error_log" \
    "/var/log/apache2/error_log" \
    "/home1/moose/logs/error_log" \
    "/home1/moose/public_html/error_log" \
    "$(find /home1/moose -name 'error_log' 2>/dev/null | head -1)"
do
    if [ -f "$log" ] && [ -r "$log" ]; then
        echo "Found: $log"
        echo "Recent entries for /pawel/ and 406:"
        tail -100 "$log" | grep -i "pawel\|406\|mod_security\|python-requests" | tail -5
        echo ""
    fi
done

# Step 3: Check ModSecurity audit log
echo "Step 3: Checking ModSecurity audit log..."
echo "Looking for ModSecurity audit logs:"
find /var/log /usr/local/apache/logs /home1/moose/logs -name "*modsec*" -o -name "*audit*" 2>/dev/null | head -5
echo ""

# Step 4: Instructions for cPanel
echo "Step 4: If logs don't show rule ID, check cPanel:"
echo "  1. Log into cPanel"
echo "  2. Navigate to: Security → ModSecurity (or ModSecurity directly)"
echo "  3. Look for: Audit Log, Blocked Requests, or Security Events"
echo "  4. Search for:"
echo "     - URI: /pawel/"
echo "     - User-Agent: python-requests/2.31.0"
echo "     - Status: 406"
echo "  5. Extract: Rule ID, Message, Matched Data, URI"
echo ""
