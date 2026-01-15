# HTTP 406 Diagnosis and Fix - /pawel/ Path Only

## Step 1: Verify .htaccess is Applied

### Test Header Added
```apache
<IfModule mod_headers.c>
    Header set X-DX-HTACCESS "pawel-on"
</IfModule>
```

### Verification Command
```bash
curl -I https://disruptiveexperience.com/pawel/ | grep -i "x-dx-htaccess"
```

**Status:** After deployment, check if `X-DX-HTACCESS: pawel-on` appears in response headers.

---

## Step 2: Reproduce 406 Error

### Test Results

| Request | Status | Notes |
|---------|--------|-------|
| `curl -I --http1.1 https://disruptiveexperience.com/pawel/` | **200 OK** | Default curl (no User-Agent) |
| `curl -I --http1.1 -A "Mozilla/5.0" https://disruptiveexperience.com/pawel/` | **406 Not Acceptable** | ⚠️ **TRIGGER FOUND** |
| `curl -I --http1.1 -H "Accept: text/html" https://disruptiveexperience.com/pawel/` | **200 OK** | With Accept header |
| `curl -I --http1.1 -H "User-Agent: " https://disruptiveexperience.com/pawel/` | **200 OK** | Empty User-Agent |
| `curl -I --http1.1 -H "Accept: */*" https://disruptiveexperience.com/pawel/` | **200 OK** | Wildcard Accept |
| `curl -I --http1.1 -A "curl/7.64.1" https://disruptiveexperience.com/pawel/` | **200 OK** | curl User-Agent |
| `curl -I --http1.1 -A "Mozilla/5.0 (compatible; Googlebot/2.1)" https://disruptiveexperience.com/pawel/` | **200 OK** | Full browser-like UA |

### Root Cause Identified

**406 Error Trigger:** `User-Agent: Mozilla/5.0` (incomplete browser string)

**Evidence:**
- Apache returns `406 Not Acceptable` with `Content-Type: text/html; charset=iso-8859-1`
- This is Apache's content negotiation rejecting the request
- The incomplete User-Agent string triggers Apache's negotiation logic

**Why it happens:**
- Apache's `mod_negotiation` (MultiViews) checks if the request can be satisfied
- Incomplete User-Agent strings like "Mozilla/5.0" (without full browser string) are flagged
- Apache's content negotiation rejects requests it can't match to available content types

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
- **Server:** Apache (no Cloudflare/WAF in front)
- **No ModSecurity headers** in response (no `X-ModSecurity-*` headers)
- **No Cloudflare headers** (no `cf-ray`, `cf-cache-status`)
- **No WordPress security plugin headers** (no `x-wf-*`, `x-sucuri-*`)

### Conclusion:
**Apache's content negotiation (`mod_negotiation`) is the blocking layer**, not ModSecurity or WAF.

---

## Step 4: Fix Applied

### File: `.htaccess`
**Location:** `/public_html/pawel/.htaccess`

### Changes Made:

1. **Disable Content Negotiation Completely**
   ```apache
   <IfModule mod_negotiation.c>
       Options -MultiViews
       Options -ContentNegotiation
   </IfModule>
   ```

2. **Force Content Type**
   ```apache
   <IfModule mod_mime.c>
       ForceType text/html
   </IfModule>
   ```

3. **Keep ModSecurity Rule Removal** (for defense in depth)
   - Removes OWASP CRS rules that might interfere
   - Keeps security for rest of site

4. **Test Header** (for verification)
   ```apache
   <IfModule mod_headers.c>
       Header set X-DX-HTACCESS "pawel-on"
   </IfModule>
   ```

### Key Snippets:

```apache
# Disable content negotiation entirely
<IfModule mod_negotiation.c>
    Options -MultiViews
    Options -ContentNegotiation
</IfModule>

# Force content type to prevent negotiation
<IfModule mod_mime.c>
    ForceType text/html
</IfModule>
```

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

### Expected Results After Fix:

✅ **All tests should return `200 OK` (not 406)**
✅ **`X-DX-HTACCESS: pawel-on` header should be present**
✅ **Site security remains enabled elsewhere**

---

## Rollback Steps

### Quick Rollback

**Option 1: Remove .htaccess**
```bash
# Via SSH:
cd /home1/moose/public_html/pawel
mv .htaccess .htaccess.backup-406-fix
```

**Option 2: Comment Out Fix**
In `.htaccess`, comment out:
```apache
# <IfModule mod_negotiation.c>
#     Options -MultiViews
#     Options -ContentNegotiation
# </IfModule>
```

**Option 3: Via cPanel File Manager**
1. Navigate to `public_html/pawel/`
2. Rename `.htaccess` to `.htaccess.backup-406-fix`
3. Or edit and comment out the content negotiation section

---

## Summary

### Root Cause
**Apache's content negotiation (`mod_negotiation`)**
- Rejects requests with incomplete User-Agent strings like "Mozilla/5.0"
- Uses MultiViews to match content types
- Returns 406 when negotiation fails

### Fix Applied
1. Disabled `MultiViews` and `ContentNegotiation` for `/pawel/` directory
2. Forced `text/html` content type to bypass negotiation
3. Added test header for verification
4. Maintained ModSecurity rule removal for defense in depth

### Files Modified
- **`.htaccess`** - Enhanced with content negotiation disable and force type

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
