# HTTP 406 Test Results

## Test Environment: LOCAL MACHINE (Laptop)

### Test Results

| Test | Command | Status | Notes |
|------|---------|--------|-------|
| 1 | `curl -I --http1.1 https://disruptiveexperience.com/pawel/` | **500 Internal Server Error** | ⚠️ Syntax error in .htaccess |
| 2 | `curl -I --http1.1 -A "" https://disruptiveexperience.com/pawel/` | **500 Internal Server Error** | Same syntax error |
| 3 | `curl -I --http1.1 -A "Mozilla/5.0" https://disruptiveexperience.com/pawel/` | **500 Internal Server Error** | Same syntax error |
| 4 | `curl -I --http1.1 -A "python-requests/2.31.0" https://disruptiveexperience.com/pawel/` | **406 Not Acceptable** | ⚠️ ModSecurity blocking |
| 5 | `curl -I --http1.1 -H "Accept: */*" https://disruptiveexperience.com/pawel/` | **500 Internal Server Error** | Same syntax error |

### Findings

1. **500 Internal Server Error** - The `.htaccess` file has a syntax error or `SecRuleEngine Off` is not allowed
2. **406 for python-requests** - ModSecurity is blocking this User-Agent
3. **No X-DX-HTACCESS header** - .htaccess is not being processed due to 500 error

### Issue: .htaccess Syntax Error

The `SecRuleEngine Off` directive may not be allowed in `.htaccess` on this host. We need to:
1. Fix the syntax error causing 500
2. Use an alternative method to disable ModSecurity

## Next Steps

1. **Fix .htaccess syntax error** - Remove or comment out `SecRuleEngine Off` if not allowed
2. **Test from server** - Run tests from SSH to see if behavior differs
3. **Check ModSecurity logs** - Find the exact rule ID blocking requests
