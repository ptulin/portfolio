# HTTP 406 Complete Fix - Step by Step

## Step 1: Fixed .htaccess (500 Error Resolved) ✅

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

**Status:** ✅ Committed to Git (commit `3782c46`)

---

## Step 2: Deploy and Verify No 500

### Deploy
1. **cPanel Git Version Control:**
   - Navigate to: **Git Version Control** → **Manage Repository**
   - Click: **"Deploy HEAD Commit"**
   - Wait for deployment to complete

2. **OR Manual Copy:**
   - Download `.htaccess` from repository
   - Upload to `public_html/pawel/.htaccess` via cPanel File Manager

### Verify (Run from Server SSH)

```bash
curl -I --http1.1 https://disruptiveexperience.com/pawel/ | egrep -i "HTTP/|x-dx-htaccess"
```

**Expected Output:**
```
HTTP/1.1 200 OK
X-DX-HTACCESS: pawel-on
```

**If 500 persists:** Check Apache error log:
```bash
tail -50 /usr/local/apache/logs/error_log | grep -i "pawel\|htaccess\|syntax"
```

---

## Step 3: Reproduce 406 and Find ModSecurity Rule ID

### Reproduce 406 (Run from Server SSH)

```bash
curl -I --http1.1 -A "python-requests/2.31.0" https://disruptiveexperience.com/pawel/
```

**Expected:** `HTTP/1.1 406 Not Acceptable`

### Find ModSecurity Rule ID

**Option A: Use Script (Easiest)**
```bash
# On server SSH:
cd /home1/moose/public_html/pawel
bash find-modsec-rule.sh
```

**Option B: Manual Check - Apache Error Log**
```bash
# On server SSH:
tail -200 /usr/local/apache/logs/error_log | grep -i "pawel\|406\|mod_security\|python-requests"
```

**Look for lines like:**
```
[ModSecurity] Access denied with code 406 (phase 2). 
[Rule ID "920100"] 
[Message "Invalid HTTP Request Line"] 
[Matched Data "python-requests/2.31.0"] 
[URI "/pawel/"]
```

**Option C: cPanel ModSecurity Tools**
1. Log into cPanel
2. Navigate to: **Security** → **ModSecurity** (or **ModSecurity** directly)
3. Look for: **Audit Log**, **Blocked Requests**, or **Security Events**
4. Search for:
   - URI: `/pawel/`
   - User-Agent: `python-requests/2.31.0`
   - Status: `406`
5. Extract:
   - **Rule ID** (e.g., `920100`, `900015`)
   - **Message** (e.g., "Invalid HTTP Request Line")
   - **Matched Data** (what triggered the rule)
   - **URI** (`/pawel/`)

---

## Step 4: Fix ModSecurity

### Option A: cPanel ModSecurity Tools (Preferred)

1. **Navigate to ModSecurity:**
   - cPanel → **Security** → **ModSecurity**
   - OR cPanel → **ModSecurity** (if available as separate tool)

2. **Disable Specific Rule ID:**
   - Find option: **"Disable Rule ID"** or **"Rule Management"** or **"Custom Rules"**
   - Enter the Rule ID (e.g., `920100`)
   - Scope: **URI `/pawel/`** or **Directory `/pawel/`**
   - Save/Apply

3. **Alternative: Disable ModSecurity for Directory:**
   - Find option: **"Disable ModSecurity for Directory"** or **"Directory Whitelist"**
   - Enter: `/pawel/` or `/home1/moose/public_html/pawel`
   - Save/Apply

### Option B: Hosting Support Ticket (If cPanel Doesn't Support Rule-Level Control)

**Subject:** Disable ModSecurity Rule [RULE_ID] for /pawel/ Directory

**Body:**
```
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

## Deliverables

### Completed ✅
- [x] Final `.htaccess` contents (Step 1)
- [x] Test script to find ModSecurity rule ID (Step 3)

### To Complete (After Deployment)
- [ ] Curl outputs before fix (Step 2 - after deployment)
- [ ] Curl outputs after fix (Step 5)
- [ ] ModSecurity rule ID from audit log (Step 3)
- [ ] ModSecurity message from audit log (Step 3)
- [ ] Matched data from audit log (Step 3)
- [ ] URI from audit log (Step 3)
- [ ] cPanel location where rule was disabled (Step 4)
- [ ] OR hosting ticket text (Step 4)

---

## Current Status

**Local Test Results (Before Deployment):**
- Default curl: **500 Internal Server Error** (old .htaccess still deployed)
- python-requests: **406 Not Acceptable** (ModSecurity blocking)

**Next Action:** Deploy the fixed `.htaccess` (commit `3782c46`) and follow Steps 2-5.
