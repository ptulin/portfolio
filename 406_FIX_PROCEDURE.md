# HTTP 406 Fix Procedure

## Step 1: Fixed .htaccess (500 Error Resolved)

### Final .htaccess Contents

**File:** `/public_html/pawel/.htaccess`

```apache
# ============================================
# Fix HTTP 406 Not Acceptable Error - /pawel/ only
# Root Cause: ModSecurity blocking requests with programmatic User-Agents
# NOTE: SecRuleEngine Off and SecRuleRemoveById are NOT allowed in .htaccess on this host
# ============================================

# TEST: Verify .htaccess is being applied
<IfModule mod_headers.c>
    Header set X-DX-HTACCESS "pawel-on"
</IfModule>

# Disable content negotiation
Options -MultiViews
```

### Changes Made
- ✅ Removed ALL ModSecurity directives (caused 500 errors)
- ✅ Kept only safe directives: `Options -MultiViews` and test header
- ✅ Proper Apache syntax with each directive on its own line
- ✅ No concatenated directives

---

## Step 2: Deploy and Verify No 500

### Deploy
1. Use cPanel Git Version Control → "Deploy HEAD Commit"
2. Or manually copy `.htaccess` to `public_html/pawel/`

### Verify (Run from Server SSH)
```bash
curl -I --http1.1 https://disruptiveexperience.com/pawel/ | egrep -i "HTTP/|x-dx-htaccess"
```

**Expected Output:**
```
HTTP/1.1 200 OK
X-DX-HTACCESS: pawel-on
```

**If 500 persists:** Check Apache error log for syntax errors.

---

## Step 3: Reproduce 406 and Find ModSecurity Rule ID

### Reproduce 406
```bash
curl -I --http1.1 -A "python-requests/2.31.0" https://disruptiveexperience.com/pawel/
```

**Expected:** `HTTP/1.1 406 Not Acceptable`

### Find ModSecurity Rule ID

**Option A: cPanel ModSecurity Tools**
1. Log into cPanel
2. Navigate to **ModSecurity** or **Security** → **ModSecurity**
3. Look for **Audit Log** or **Blocked Requests**
4. Search for:
   - URI: `/pawel/`
   - User-Agent: `python-requests/2.31.0`
   - Status: `406`
5. Extract:
   - **Rule ID** (e.g., `920100`, `900015`)
   - **Message** (e.g., "Invalid HTTP Request Line")
   - **Matched Data** (what triggered the rule)
   - **URI** (`/pawel/`)

**Option B: Apache Error Log**
```bash
# On server SSH:
tail -100 /usr/local/apache/logs/error_log | grep -i "pawel\|406\|mod_security\|python-requests"
# Or check cPanel Error Log:
# cPanel → Errors → View Latest Errors
```

**Look for lines like:**
```
[ModSecurity] Access denied with code 406 (phase 2). [Rule ID "920100"] [Message "Invalid HTTP Request Line"] [Matched Data "python-requests/2.31.0"] [URI "/pawel/"]
```

---

## Step 4: Fix ModSecurity

### Option A: cPanel ModSecurity Tools (Preferred)

1. **Navigate to ModSecurity in cPanel:**
   - cPanel → **Security** → **ModSecurity**
   - OR cPanel → **ModSecurity** (if available)

2. **Disable Specific Rule ID:**
   - Find option: **"Disable Rule ID"** or **"Rule Management"**
   - Enter the Rule ID (e.g., `920100`)
   - Scope: **URI `/pawel/`** or **Directory `/pawel/`**
   - Save

3. **Alternative: Disable ModSecurity for Directory:**
   - Find option: **"Disable ModSecurity for Directory"**
   - Enter: `/pawel/`
   - Save

### Option B: Hosting Support Ticket (If cPanel Doesn't Support Rule-Level Control)

**Ticket Template:**
```
Subject: Disable ModSecurity Rule [RULE_ID] for /pawel/ Directory

I'm experiencing HTTP 406 Not Acceptable errors on:
https://disruptiveexperience.com/pawel/

The ModSecurity audit log shows:
- Rule ID: [RULE_ID from Step 3]
- Message: [MESSAGE from Step 3]
- Matched Data: [MATCHED_DATA from Step 3]
- URI: /pawel/

This rule is blocking legitimate programmatic clients (curl, python-requests, etc.).

Please either:
1. Disable rule ID [RULE_ID] for URI pattern ^/pawel(/|$) only, OR
2. Disable ModSecurity entirely for the /pawel/ directory only

Do NOT disable ModSecurity site-wide - only for /pawel/ directory.

Thank you.
```

---

## Step 5: Verify Fix

### Test Commands (Run from External Network)

```bash
# Test 1: Default request
curl -I --http1.1 https://disruptiveexperience.com/pawel/ | egrep -i "HTTP/|x-dx-htaccess"

# Test 2: Previously blocked User-Agent
curl -I --http1.1 -A "python-requests/2.31.0" https://disruptiveexperience.com/pawel/ | egrep -i "HTTP/|x-dx-htaccess"

# Test 3: Other programmatic clients
curl -I --http1.1 -A "Mozilla/5.0" https://disruptiveexperience.com/pawel/ | egrep -i "HTTP/|x-dx-htaccess"
curl -I --http1.1 -A "curl/7.64.1" https://disruptiveexperience.com/pawel/ | egrep -i "HTTP/|x-dx-htaccess"
```

### Expected Results

✅ **All tests return `200 OK` (not 406)**
✅ **`X-DX-HTACCESS: pawel-on` header is present in all responses**
✅ **No 500 errors**

---

## Deliverables Checklist

- [x] Final `.htaccess` contents (Step 1)
- [ ] Curl outputs before fix (Step 2)
- [ ] Curl outputs after fix (Step 5)
- [ ] ModSecurity rule ID from audit log (Step 3)
- [ ] ModSecurity message from audit log (Step 3)
- [ ] Matched data from audit log (Step 3)
- [ ] URI from audit log (Step 3)
- [ ] cPanel location where rule was disabled (Step 4)
- [ ] OR hosting ticket text (Step 4)

---

## Notes

- **Do NOT use `SecRuleEngine Off` in .htaccess** - causes 500 errors
- **Do NOT use `SecRuleRemoveById` in .htaccess** - not allowed on this host
- **Must use cPanel ModSecurity tools or hosting support** to disable rules
- **Scope fix to `/pawel/` only** - do not disable ModSecurity site-wide
