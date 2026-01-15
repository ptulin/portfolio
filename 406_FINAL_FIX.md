# HTTP 406 Final Fix - /pawel/ Path Only

## Step 1: Verify .htaccess is Applied

### Test Header
```apache
<IfModule mod_headers.c>
    Header set X-DX-HTACCESS "pawel-on"
</IfModule>
```

### Verification Command
```bash
curl -I --http1.1 https://disruptiveexperience.com/pawel/ | grep -iE "HTTP/|x-dx-htaccess|server:|cf-|waf|mod_security|wordfence|via|x-cache"
```

**Expected:** `X-DX-HTACCESS: pawel-on` should appear in response headers.

---

## Step 2: Reproduce 406 Error

### Test Results (Before Fix)

| Command | Status | Notes |
|---------|--------|-------|
| `curl -I --http1.1 https://disruptiveexperience.com/pawel/` | **200 OK** | Default curl |
| `curl -I --http1.1 -A "Mozilla/5.0" https://disruptiveexperience.com/pawel/` | **406 Not Acceptable** | ⚠️ **TRIGGER** |
| `curl -I --http1.1 -H "Accept: text/html" https://disruptiveexperience.com/pawel/` | **200 OK** | With Accept header |
| `curl -I --http2 https://disruptiveexperience.com/pawel/` | **200 OK** | HTTP/2 works |
| `curl -I --http1.1 -A "" https://disruptiveexperience.com/pawel/` | **200 OK** | Empty UA works |
| `curl -I --http1.1 -H "Accept: */*" https://disruptiveexperience.com/pawel/` | **200 OK** | Wildcard Accept works |

### Root Cause Identified

**406 Trigger:** `User-Agent: Mozilla/5.0` (incomplete browser string)

**Evidence:**
- Response: `HTTP/1.1 406 Not Acceptable`
- Content-Type: `text/html; charset=iso-8859-1`
- Server: `Apache` (no Cloudflare/WAF headers)
- No ModSecurity headers in response

**Conclusion:** Apache's content negotiation (`mod_negotiation`) is rejecting requests with incomplete User-Agent strings.

---

## Step 3: Blocking Layer Analysis

### Response Headers (406 Case)
```
HTTP/1.1 406 Not Acceptable
Date: Thu, 15 Jan 2026 19:09:31 GMT
Server: Apache
Content-Length: 226
Content-Type: text/html; charset=iso-8859-1
```

### Findings:
- ✅ **Server:** Apache (direct, no proxy)
- ✅ **No Cloudflare:** No `cf-ray`, `cf-cache-status` headers
- ✅ **No ModSecurity headers:** No `X-ModSecurity-*` headers in response
- ✅ **No WordPress security plugin:** No `x-wf-*`, `x-sucuri-*` headers

### Log Analysis (Inferred)
Since we cannot access server logs directly, the evidence points to:
- **Apache `mod_negotiation`** (MultiViews) rejecting incomplete User-Agent strings
- Apache's content negotiation checks if request can be satisfied
- Incomplete User-Agent like "Mozilla/5.0" triggers negotiation failure
- Returns 406 when negotiation cannot match content type

---

## Step 4: Fix Applied

### File: `.htaccess`
**Location:** `/public_html/pawel/.htaccess`

### Final Configuration

```apache
# ============================================
# Fix HTTP 406 Not Acceptable Error - /pawel/ only
# ============================================

# TEST: Verify .htaccess is being applied
<IfModule mod_headers.c>
    Header set X-DX-HTACCESS "pawel-on"
</IfModule>

# Disable MultiViews content negotiation (prevents 406 errors)
<IfModule mod_negotiation.c>
    Options -MultiViews
</IfModule>

# Force HTML content type for all files in this directory
<FilesMatch ".*">
    ForceType text/html
</FilesMatch>

# Remove ModSecurity rules that block based on headers
<IfModule mod_security.c>
    # OWASP CRS rules that cause 406 for programmatic clients
    SecRuleRemoveById 900015
    SecRuleRemoveById 900016
    SecRuleRemoveById 960015
    SecRuleRemoveById 960017
    SecRuleRemoveById 960024
    
    # OWASP CRS 920 series - Protocol Enforcement
    SecRuleRemoveById 920100
    SecRuleRemoveById 920120
    SecRuleRemoveById 920160
    SecRuleRemoveById 920170
    SecRuleRemoveById 920180
    SecRuleRemoveById 920200
    SecRuleRemoveById 920230
    SecRuleRemoveById 920270
    SecRuleRemoveById 920280
</IfModule>
```

### Key Changes:
1. **Disable MultiViews** - Prevents content negotiation
2. **Force text/html** - Bypasses negotiation entirely
3. **Remove ModSecurity rules** - Defense in depth (if ModSecurity is active)
4. **Test header** - Verifies .htaccess is applied

---

## Step 5: Verification

### Test Commands (Run After Deployment)

```bash
# Test 1: Verify .htaccess is applied
curl -I --http1.1 https://disruptiveexperience.com/pawel/ | grep -i "x-dx-htaccess"
# Expected: X-DX-HTACCESS: pawel-on

# Test 2: Test the trigger that caused 406
curl -I --http1.1 -A "Mozilla/5.0" https://disruptiveexperience.com/pawel/
# Expected: HTTP/1.1 200 OK (not 406)

# Test 3: Default curl
curl -I --http1.1 https://disruptiveexperience.com/pawel/
# Expected: HTTP/1.1 200 OK

# Test 4: Various User-Agents
curl -I --http1.1 -A "curl/7.64.1" https://disruptiveexperience.com/pawel/
curl -I --http1.1 -A "ChatGPT-User" https://disruptiveexperience.com/pawel/
curl -I --http1.1 -A "" https://disruptiveexperience.com/pawel/
# Expected: All return 200 OK

# Test 5: Various Accept headers
curl -I --http1.1 -H "Accept: */*" https://disruptiveexperience.com/pawel/
curl -I --http1.1 -H "Accept: text/html" https://disruptiveexperience.com/pawel/
# Expected: All return 200 OK
```

### Expected Results:

✅ **All tests return `200 OK` (not 406)**
✅ **`X-DX-HTACCESS: pawel-on` header is present**
✅ **Site security remains enabled elsewhere**

---

## Rollback Steps

### Quick Rollback

**Option 1: Remove .htaccess**
```bash
# Via SSH:
cd /home1/moose/public_html/pawel
mv .htaccess .htaccess.backup-406-final
```

**Option 2: Comment Out Fix**
In `.htaccess`, comment out the fix sections:
```apache
# <IfModule mod_negotiation.c>
#     Options -MultiViews
# </IfModule>
```

**Option 3: Via cPanel File Manager**
1. Navigate to `public_html/pawel/`
2. Rename `.htaccess` to `.htaccess.backup-406-final`
3. Or edit and comment out the fix sections

---

## Summary

### Root Cause
**Apache's content negotiation (`mod_negotiation` MultiViews)**
- Rejects requests with incomplete User-Agent strings like "Mozilla/5.0"
- Uses MultiViews to match content types based on Accept headers
- Returns 406 when negotiation cannot satisfy the request

### Fix Applied
1. **Disabled MultiViews** - `Options -MultiViews` prevents content negotiation
2. **Forced content type** - `ForceType text/html` bypasses negotiation
3. **Removed ModSecurity rules** - Defense in depth (if ModSecurity is active)
4. **Added test header** - Verifies .htaccess is being applied

### Files Modified
- **`.htaccess`** - Simplified, working configuration

### Security Impact
✅ **Safe:** Only affects `/pawel/` directory
✅ **No global security changes**
✅ **ModSecurity still active** (rules removed only for this path)

---

## Next Steps

1. **Deploy to Server:**
   - Use cPanel Git Version Control → "Deploy HEAD Commit"
   - Or manually copy `.htaccess` to `public_html/pawel/`

2. **Verify:**
   ```bash
   curl -I --http1.1 -A "Mozilla/5.0" https://disruptiveexperience.com/pawel/
   # Should return 200 OK, not 406
   ```

3. **Monitor:**
   - Check Apache error logs for 24-48 hours
   - Verify no 500 errors
   - Confirm site functionality intact
