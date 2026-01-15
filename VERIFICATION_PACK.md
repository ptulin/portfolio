# Verification Pack: /pawel/ .htaccess Fix

## A) Single Copy/Paste Bash Block

```bash
#!/bin/bash
# Verification Pack for /pawel/ .htaccess fix
URL="https://disruptiveexperience.com/pawel/"

echo "TEST 1: Default request"
STATUS=$(curl -s -D- -o /dev/null --http1.1 "$URL" | head -1)
HEADER=$(curl -s -D- -o /dev/null --http1.1 "$URL" | grep -i "x-dx-htaccess" | tr -d '\r')
echo "Status: $STATUS"
echo "Header: $HEADER"
echo ""

echo "TEST 2: User-Agent: Mozilla/5.0"
STATUS=$(curl -s -D- -o /dev/null --http1.1 -A "Mozilla/5.0" "$URL" | head -1)
HEADER=$(curl -s -D- -o /dev/null --http1.1 -A "Mozilla/5.0" "$URL" | grep -i "x-dx-htaccess" | tr -d '\r')
echo "Status: $STATUS"
echo "Header: $HEADER"
echo ""

echo "TEST 3: User-Agent: python-requests/2.31.0"
STATUS=$(curl -s -D- -o /dev/null --http1.1 -A "python-requests/2.31.0" "$URL" | head -1)
HEADER=$(curl -s -D- -o /dev/null --http1.1 -A "python-requests/2.31.0" "$URL" | grep -i "x-dx-htaccess" | tr -d '\r')
echo "Status: $STATUS"
echo "Header: $HEADER"
```

**OR use the script:**
```bash
bash verify-406-fix.sh
```

---

## B) Expected Outputs

### TEST 1: Default request
**✅ GOOD (Expected):**
```
Status: HTTP/1.1 200 OK
Header: X-DX-HTACCESS: pawel-on
```

**❌ BLOCKED by ModSecurity (Not expected for default):**
```
Status: HTTP/1.1 406 Not Acceptable
Header: (empty - no header in 406 response)
```

**⚠️ ERROR - .htaccess syntax issue:**
```
Status: HTTP/1.1 500 Internal Server Error
Header: (empty - no header in 500 response)
```

---

### TEST 2: User-Agent: Mozilla/5.0
**✅ GOOD (If ModSecurity exception added):**
```
Status: HTTP/1.1 200 OK
Header: X-DX-HTACCESS: pawel-on
```

**❌ BLOCKED by ModSecurity (Expected until host exception added):**
```
Status: HTTP/1.1 406 Not Acceptable
Header: (empty - no header in 406 response)
```

**⚠️ ERROR - .htaccess syntax issue:**
```
Status: HTTP/1.1 500 Internal Server Error
Header: (empty - no header in 500 response)
```

---

### TEST 3: User-Agent: python-requests/2.31.0
**✅ GOOD (If ModSecurity exception added):**
```
Status: HTTP/1.1 200 OK
Header: X-DX-HTACCESS: pawel-on
```

**❌ BLOCKED by ModSecurity (Expected until host exception added):**
```
Status: HTTP/1.1 406 Not Acceptable
Header: (empty - no header in 406 response)
```

**⚠️ ERROR - .htaccess syntax issue:**
```
Status: HTTP/1.1 500 Internal Server Error
Header: (empty - no header in 500 response)
```

---

## C) Troubleshooting: If 500 Still Appears

### Likely Causes

1. **.htaccess syntax error**
   - **File:** `/public_html/pawel/.htaccess`
   - **Check for:**
     - Missing closing `</IfModule>` tag
     - Invalid Apache directives
     - Special characters or encoding issues
     - File should contain exactly:
       ```apache
       <IfModule mod_headers.c>
         Header set X-DX-HTACCESS "pawel-on"
       </IfModule>
       ```

2. **mod_headers module not enabled**
   - **Check:** Apache error log
   - **Location:** `/usr/local/apache/logs/error_log` or cPanel → Errors
   - **Look for:** "Invalid command 'Header'" or "mod_headers not enabled"

3. **AllowOverride restrictions**
   - **Check:** Apache configuration or `.htaccess` in parent directory
   - **Location:** `/public_html/.htaccess` (parent directory)
   - **Look for:** `AllowOverride None` or restrictions on `Header` directive

4. **File permissions**
   - **File:** `/public_html/pawel/.htaccess`
   - **Check:** File should be readable by Apache (644 permissions)
   - **Fix:** `chmod 644 /public_html/pawel/.htaccess`

5. **Deployment issue**
   - **Check:** File was actually deployed
   - **Location:** `/public_html/pawel/.htaccess`
   - **Verify:** File contents match repository version

### How to Inspect

**Via cPanel File Manager:**
1. Navigate to `public_html/pawel/`
2. Open `.htaccess` file
3. Verify contents match exactly:
   ```apache
   <IfModule mod_headers.c>
     Header set X-DX-HTACCESS "pawel-on"
   </IfModule>
   ```

**Via SSH:**
```bash
# Check file contents
cat /home1/moose/public_html/pawel/.htaccess

# Check file permissions
ls -la /home1/moose/public_html/pawel/.htaccess

# Check Apache error log
tail -50 /usr/local/apache/logs/error_log | grep -i "pawel\|htaccess\|500"
```

---

## Summary

**✅ Success Criteria:**
- TEST 1 (default): `200 OK` + `X-DX-HTACCESS: pawel-on`
- TEST 2 (Mozilla/5.0): `406` is expected until ModSecurity exception added
- TEST 3 (python-requests): `406` is expected until ModSecurity exception added

**⚠️ If 500 appears:**
- Check `.htaccess` syntax (should be exactly 3 lines as shown above)
- Check Apache error log for specific error message
- Verify file was deployed correctly
