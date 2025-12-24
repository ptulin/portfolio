#!/bin/bash
# Test script for HTTP 406 Not Acceptable error
# Usage: ./test_406.sh

URL="https://disruptiveexperience.com/pawel/"

echo "=========================================="
echo "Testing HTTP 406 Error Fix"
echo "URL: $URL"
echo "=========================================="
echo ""

test_count=0
pass_count=0
fail_count=0

test_request() {
    local test_name="$1"
    local headers="$2"
    
    test_count=$((test_count + 1))
    echo "[Test $test_count] $test_name"
    
    if [ -z "$headers" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" -I "$URL" 2>&1)
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -I $headers "$URL" 2>&1)
    fi
    
    if [ "$response" = "200" ] || [ "$response" = "301" ] || [ "$response" = "302" ]; then
        echo "  ✅ PASS: HTTP $response"
        pass_count=$((pass_count + 1))
    elif [ "$response" = "406" ]; then
        echo "  ❌ FAIL: HTTP 406 Not Acceptable"
        fail_count=$((fail_count + 1))
    else
        echo "  ⚠️  UNEXPECTED: HTTP $response"
        fail_count=$((fail_count + 1))
    fi
    echo ""
}

# Test 1: Minimal headers (simulates bot)
test_request "Minimal headers (bot simulation)" ""

# Test 2: Bot User-Agent
test_request "Googlebot User-Agent" '-H "User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"'

# Test 3: AI Tool User-Agent
test_request "ChatGPT User-Agent" '-H "User-Agent: ChatGPT-User"'

# Test 4: Empty User-Agent
test_request "Empty User-Agent" '-H "User-Agent: "'

# Test 5: Accept: */*
test_request "Accept: */*" '-H "Accept: */*"'

# Test 6: Accept: text/html
test_request "Accept: text/html" '-H "Accept: text/html"'

# Test 7: No Accept header
test_request "No Accept header" '-H "Accept:"'

# Test 8: Chrome User-Agent (should always work)
test_request "Chrome User-Agent (baseline)" '-H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"'

# Test 9: curl default User-Agent
test_request "curl default User-Agent" '-H "User-Agent: curl/7.68.0"'

# Test 10: LinkedIn Bot
test_request "LinkedIn Bot" '-H "User-Agent: LinkedInBot/1.0 (compatible; Mozilla/5.0; +http://www.linkedin.com)"'

echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo "Total tests: $test_count"
echo "Passed: $pass_count"
echo "Failed: $fail_count"
echo ""

if [ $fail_count -eq 0 ]; then
    echo "✅ All tests passed! 406 error is fixed."
    exit 0
else
    echo "❌ Some tests failed. 406 error still present."
    echo ""
    echo "Next steps:"
    echo "1. Check .htaccess for User-Agent or Accept header blocking"
    echo "2. Contact hosting support about mod_security rules"
    echo "3. Review server error logs"
    exit 1
fi

