# Fix HTTP 406 Not Acceptable Error

## Problem
Website `https://disruptiveexperience.com/pawel/` returns HTTP 406 for non-browser clients (bots, AI tools, preview agents) while working in Chrome.

## Quick Diagnosis

### Test Current Behavior
```bash
# Test with minimal headers (simulates bot)
curl -I https://disruptiveexperience.com/pawel/

# Test with explicit Accept header
curl -I -H "Accept: text/html" https://disruptiveexperience.com/pawel/

# Test with common bot User-Agent
curl -I -H "User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1)" https://disruptiveexperience.com/pawel/

# Test with AI tool User-Agent
curl -I -H "User-Agent: ChatGPT-User" https://disruptiveexperience.com/pawel/
```

Expected: All should return `200 OK` or `301/302` redirect, not `406`.

---

## Common Causes & Fixes

### 1. .htaccess User-Agent Blocking

**Problem:** Rules that block or restrict based on User-Agent.

**Check for these patterns in `.htaccess`:**
```apache
# BAD - Blocks specific User-Agents
RewriteCond %{HTTP_USER_AGENT} ^.*(bot|crawler|spider).*$ [NC]
RewriteRule .* - [F,L]

# BAD - Blocks empty User-Agent
RewriteCond %{HTTP_USER_AGENT} ^$ [OR]
RewriteRule .* - [F,L]

# BAD - Only allows specific User-Agents
RewriteCond %{HTTP_USER_AGENT} !^Mozilla [NC]
RewriteRule .* - [F,L]
```

**Safe Fix - Remove or Comment Out:**
```apache
# Comment out or delete User-Agent blocking rules
# RewriteCond %{HTTP_USER_AGENT} ^.*(bot|crawler|spider).*$ [NC]
# RewriteRule .* - [F,L]
```

---

### 2. .htaccess Accept Header Filtering

**Problem:** Rules that require specific Accept headers.

**Check for these patterns:**
```apache
# BAD - Requires specific Accept header
RewriteCond %{HTTP:Accept} !text/html [NC]
RewriteRule .* - [F,L]

# BAD - Blocks certain Accept values
RewriteCond %{HTTP:Accept} \*/\* [NC]
RewriteRule .* - [F,L]
```

**Safe Fix:**
```apache
# Remove Accept header filtering rules
# These are too restrictive for bots and API clients
```

---

### 3. Content Negotiation Issues

**Problem:** Apache's content negotiation rejecting requests.

**Safe Fix - Add to `.htaccess`:**
```apache
# Allow all Accept headers for HTML pages
<FilesMatch "\.(html|htm)$">
    Header set Accept "*/*"
    ForceType text/html
</FilesMatch>

# Or more permissive:
<IfModule mod_negotiation.c>
    Options -MultiViews
</IfModule>
```

---

### 4. mod_security / WAF Rules

**Problem:** Security rules blocking non-browser User-Agents.

**Fix Option A - Disable mod_security per-directory (if allowed):**
```apache
# Add to .htaccess (may require mod_security2 configuration)
<IfModule mod_security.c>
    SecRuleEngine Off
</IfModule>
```

**Note:** Many shared hosts don't allow this. If you get a 500 error, hosting doesn't allow it.

**Fix Option B - Whitelist via .htaccess (if supported):**
```apache
<IfModule mod_security.c>
    # Allow all User-Agents
    SecRuleRemoveById 900015
    SecRuleRemoveById 900016
    # Common rules that block bots: 900015, 900016, 960015, 960017
</IfModule>
```

**Fix Option C - Contact Hosting Support:**
Ask them to:
1. Whitelist your domain from mod_security User-Agent filtering
2. Disable rule IDs: `900015`, `900016`, `960015`, `960017` for your account
3. Allow all User-Agents for HTML content on `/pawel/` path

---

## Recommended .htaccess Configuration

**Safe default for allowing all clients (add to `.htaccess` in document root or `/pawel/` directory):**

```apache
# ============================================
# Fix 406 Error - Allow All User-Agents
# ============================================

# Disable MultiViews to prevent content negotiation issues
<IfModule mod_negotiation.c>
    Options -MultiViews
</IfModule>

# Force HTML content type for .html files
<FilesMatch "\.(html|htm)$">
    ForceType text/html
    Header set Content-Type "text/html; charset=utf-8"
</FilesMatch>

# Remove any User-Agent restrictions (if present, comment them out)
# DO NOT add rules that block User-Agent

# Remove any Accept header restrictions (if present, comment them out)
# DO NOT add rules that filter Accept headers

# ============================================
# Security: Only block known malicious patterns
# ============================================

# Block only clearly malicious requests (not bots)
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Block SQL injection attempts (safe - doesn't affect bots)
    RewriteCond %{QUERY_STRING} (\<|%3C).*script.*(\>|%3E) [NC,OR]
    RewriteCond %{QUERY_STRING} GLOBALS(=|\[|\%[0-9A-Z]{0,2}) [OR]
    RewriteCond %{QUERY_STRING} _REQUEST(=|\[|\%[0-9A-Z]{0,2})
    RewriteRule .* - [F,L]
    
    # DO NOT block based on User-Agent
    # DO NOT block based on Accept header
</IfModule>
```

---

## Step-by-Step Fix Procedure

### Step 1: Access Your Server
1. Log into cPanel
2. Navigate to **File Manager**
3. Go to your domain's document root (usually `public_html` or `www`)
4. Check for `.htaccess` in root and `/pawel/` directory

### Step 2: Backup Current .htaccess
```bash
# In cPanel File Manager, download .htaccess as backup
# Or via SSH:
cp .htaccess .htaccess.backup
```

### Step 3: Review Current .htaccess
Look for and **comment out or remove**:
- Any `RewriteCond` with `HTTP_USER_AGENT`
- Any `RewriteCond` with `HTTP:Accept`
- Any `RewriteRule` that returns `[F]` (Forbidden) based on headers
- Any `SetEnvIf` that blocks User-Agent

### Step 4: Add Safe Configuration
Add the recommended configuration above to your `.htaccess`.

### Step 5: Test
```bash
# Test immediately after changes
curl -I https://disruptiveexperience.com/pawel/

# Should return 200 OK or redirect, not 406
```

### Step 6: If Still Getting 406

**A. Check mod_security:**
```bash
# Test with verbose curl to see response headers
curl -v https://disruptiveexperience.com/pawel/ 2>&1 | grep -i "mod_security\|x-modsec"
```

If you see mod_security headers, contact hosting support.

**B. Check Apache error logs:**
- In cPanel: **Errors** section
- Look for entries mentioning "406", "User-Agent", or "Accept"

**C. Test with different paths:**
```bash
# Test root
curl -I https://disruptiveexperience.com/

# Test other paths
curl -I https://disruptiveexperience.com/pawel/index.html
```

---

## Testing Commands

### Comprehensive Test Suite
```bash
#!/bin/bash
# Save as test_406.sh

URL="https://disruptiveexperience.com/pawel/"

echo "=== Test 1: Minimal headers ==="
curl -I "$URL"

echo -e "\n=== Test 2: Bot User-Agent ==="
curl -I -H "User-Agent: Googlebot/2.1" "$URL"

echo -e "\n=== Test 3: AI Tool User-Agent ==="
curl -I -H "User-Agent: ChatGPT-User" "$URL"

echo -e "\n=== Test 4: Empty User-Agent ==="
curl -I -H "User-Agent: " "$URL"

echo -e "\n=== Test 5: Accept: */* ==="
curl -I -H "Accept: */*" "$URL"

echo -e "\n=== Test 6: Accept: text/html ==="
curl -I -H "Accept: text/html" "$URL"

echo -e "\n=== Test 7: No Accept header ==="
curl -I -H "Accept:" "$URL"

echo -e "\n=== Test 8: Chrome User-Agent (should work) ==="
curl -I -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" "$URL"
```

**Run:**
```bash
chmod +x test_406.sh
./test_406.sh
```

**Expected:** All tests should return `200 OK` or `301/302`, not `406`.

---

## What to Ask Hosting Support

If `.htaccess` changes don't work, contact support with:

**Subject:** HTTP 406 Error - mod_security Blocking Bots

**Message:**
```
Hello,

My website https://disruptiveexperience.com/pawel/ returns HTTP 406 
Not Acceptable for non-browser clients (bots, crawlers, AI tools) 
while working fine in browsers.

I've verified my .htaccess doesn't block User-Agents. This appears 
to be a mod_security or WAF rule blocking requests based on 
User-Agent or Accept headers.

Please:
1. Check mod_security rules for my account
2. Whitelist all User-Agents for HTML content on /pawel/ path
3. Disable or adjust rules that cause 406 responses for:
   - Empty User-Agent
   - Bot User-Agents (Googlebot, etc.)
   - AI tool User-Agents
   - Requests with Accept: */*
   - Requests without Accept header

This is blocking legitimate crawlers and preview tools. The site 
should be accessible to all clients requesting HTML content.

Thank you.
```

---

## Verification Checklist

After applying fixes:

- [ ] `curl -I https://disruptiveexperience.com/pawel/` returns 200/301/302
- [ ] Works with bot User-Agent (Googlebot)
- [ ] Works with AI tool User-Agent (ChatGPT-User)
- [ ] Works with empty User-Agent
- [ ] Works with `Accept: */*`
- [ ] Works with no Accept header
- [ ] Still works in Chrome browser
- [ ] No security warnings in browser console
- [ ] Site loads normally for human visitors

---

## Common mod_security Rule IDs to Whitelist

If hosting support asks which rules to disable:
- `900015` - User-Agent validation
- `900016` - Accept header validation  
- `960015` - Request header anomaly
- `960017` - Missing/empty User-Agent
- `960024` - Request header missing

**Note:** Only disable these for HTML content, not globally.

---

## Security Notes

✅ **Safe to do:**
- Remove User-Agent blocking rules
- Remove Accept header filtering
- Allow all User-Agents for HTML pages
- Disable MultiViews content negotiation

❌ **Do NOT do:**
- Disable mod_security globally
- Remove all security rules
- Allow SQL injection or XSS patterns
- Disable HTTPS enforcement

The fix only affects header-based filtering, not content-based security.

---

## Quick Reference: .htaccess Snippet

**Minimal fix (add to `.htaccess`):**
```apache
# Fix 406 - Allow all User-Agents and Accept headers
<IfModule mod_negotiation.c>
    Options -MultiViews
</IfModule>

<FilesMatch "\.(html|htm)$">
    ForceType text/html
</FilesMatch>
```

This alone may fix the issue if it's content negotiation related.

