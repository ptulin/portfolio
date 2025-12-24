# Quick Fix: HTTP 406 Not Acceptable

## Current Status
✅ **Tested:** All curl requests return `200 OK` (not 406)
- This may be intermittent or already fixed
- Use the guide below if 406 returns

## Immediate Actions

### 1. Check .htaccess
**Location:** Document root or `/pawel/` directory

**Look for and REMOVE:**
```apache
# Remove these patterns:
RewriteCond %{HTTP_USER_AGENT} ...
RewriteCond %{HTTP:Accept} ...
```

### 2. Add This to .htaccess
```apache
<IfModule mod_negotiation.c>
    Options -MultiViews
</IfModule>

<FilesMatch "\.(html|htm)$">
    ForceType text/html
</FilesMatch>
```

### 3. Test
```bash
./test_406.sh
# or
curl -I https://disruptiveexperience.com/pawel/
```

### 4. If Still 406
Contact hosting support to whitelist User-Agents in mod_security.

## Files Created
- `FIX_406_ERROR_GUIDE.md` - Complete diagnostic guide
- `.htaccess.fix-406` - Ready-to-use .htaccess template
- `test_406.sh` - Automated test script

## Quick Test Command
```bash
curl -I -H "User-Agent: ChatGPT-User" https://disruptiveexperience.com/pawel/
```
Should return `200`, not `406`.

