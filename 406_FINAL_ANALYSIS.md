# HTTP 406 Final Analysis

## Test Results from LOCAL MACHINE (Laptop)

### Full Response Headers

**Test 1: Default curl**
```
HTTP/1.1 500 Internal Server Error
Date: Thu, 15 Jan 2026 19:29:40 GMT
Server: Apache
Upgrade: h2,h2c
Connection: Upgrade, close
Last-Modified: Mon, 14 Oct 2024 07:46:29 GMT
Accept-Ranges: bytes
Content-Length: 746
Vary: Accept-Encoding
Content-Type: text/html
```
**Status:** 500 Internal Server Error (no X-DX-HTACCESS header)

**Test 2: Empty User-Agent**
```
HTTP/1.1 500 Internal Server Error
Date: Thu, 15 Jan 2026 19:29:40 GMT
Server: Apache
Upgrade: h2,h2c
Connection: Upgrade, close
Last-Modified: Mon, 14 Oct 2024 07:46:29 GMT
Accept-Ranges: bytes
Content-Length: 746
Vary: Accept-Encoding
Content-Type: text/html
```
**Status:** 500 Internal Server Error

**Test 3: Mozilla/5.0**
```
HTTP/1.1 500 Internal Server Error
Date: Thu, 15 Jan 2026 19:29:44 GMT
Server: Apache
Upgrade: h2,h2c
Connection: Upgrade, close
Last-Modified: Mon, 14 Oct 2024 07:46:29 GMT
Accept-Ranges: bytes
Content-Length: 746
Vary: Accept-Encoding
Content-Type: text/html
```
**Status:** 500 Internal Server Error

**Test 4: python-requests/2.31.0**
```
HTTP/1.1 406 Not Acceptable
Date: Thu, 15 Jan 2026 19:29:42 GMT
Server: Apache
Content-Type: text/html; charset=iso-8859-1
```
**Status:** 406 Not Acceptable (ModSecurity blocking)

**Test 5: Accept: */***
```
HTTP/1.1 500 Internal Server Error
Date: Thu, 15 Jan 2026 19:29:43 GMT
Server: Apache
Upgrade: h2,h2c
Connection: Upgrade, close
Last-Modified: Mon, 14 Oct 2024 07:46:29 GMT
Accept-Ranges: bytes
Content-Length: 746
Vary: Accept-Encoding
Content-Type: text/html
```
**Status:** 500 Internal Server Error

## Root Cause Analysis

### Issue 1: 500 Internal Server Error
- **Cause:** `SecRuleEngine Off` directive is NOT allowed in `.htaccess` on this host
- **Evidence:** All requests return 500 when `.htaccess` contains `SecRuleEngine Off`
- **Impact:** `.htaccess` is not being processed, so test header doesn't appear

### Issue 2: 406 Not Acceptable (python-requests)
- **Cause:** ModSecurity is blocking requests with `python-requests/2.31.0` User-Agent
- **Evidence:** 406 response with `Content-Type: text/html; charset=iso-8859-1`
- **Impact:** Programmatic clients are blocked

## Solution

Since `SecRuleEngine Off` is not allowed in `.htaccess`, we have two options:

### Option A: Contact Hosting Support (Recommended)
Request hosting support to:
1. Disable ModSecurity for `/pawel/` directory only
2. OR whitelist specific User-Agents for `/pawel/`
3. OR provide the ModSecurity rule ID(s) blocking requests so we can remove them

### Option B: Use SecRuleRemoveById (May Not Work)
Try removing all ModSecurity rules:
```apache
<IfModule mod_security2.c>
    SecRuleRemoveById 1-999999
</IfModule>
```

**Note:** This may not work if the host doesn't allow rule removal in `.htaccess`.

## Next Steps

1. **Remove `SecRuleEngine Off`** from `.htaccess` (causes 500 error)
2. **Test from server SSH** to see if behavior differs
3. **Check ModSecurity audit logs** for exact rule IDs
4. **Contact hosting support** if `.htaccess` directives don't work

## Commands to Run on Server

```bash
# Test from server
curl -I --http1.1 https://disruptiveexperience.com/pawel/
curl -I --http1.1 -A "python-requests/2.31.0" https://disruptiveexperience.com/pawel/

# Check Apache error log
tail -100 /usr/local/apache/logs/error_log | grep -i "pawel\|406\|mod_security"

# Check ModSecurity audit log (if exists)
find /var/log -name "*modsec*" -o -name "*audit*" 2>/dev/null
```
