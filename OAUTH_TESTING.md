# OAuth Testing Guide

## Prerequisites

1. **Backend Services Running:**
   ```bash
   cd workfitai-platform
   docker-compose up -d
   ```

2. **Frontend Running:**
   ```bash
   cd workfitai-ui
   npm run dev
   ```

3. **Environment Variables Set:**
   - Backend: `.env.local` với `FRONTEND_BASE_URL` và `BACKEND_BASE_URL`
   - Frontend: `.env` với `NEXT_PUBLIC_AUTH_BASE_URL`

4. **OAuth Providers Configured:**
   - Google Cloud Console: redirect URI added
   - GitHub OAuth App: callback URL added

## Test Cases

### Test 1: Login with Google

**Steps:**
1. Navigate to `http://localhost:3000/signin`
2. Click "Sign in with Google" button
3. Should redirect to Google login page
4. Login with Google account
5. Authorize the application
6. Should redirect back to `http://localhost:3000/oauth-callback/google`
7. Should see "Completing sign-in..." loading state
8. Should redirect to dashboard based on role

**Expected Result:**
- ✅ User logged in successfully
- ✅ Token stored in memory (axios client)
- ✅ Session data in localStorage
- ✅ Redirected to correct page

**Verify:**
```javascript
// In browser console
localStorage.getItem('auth_session') // Should have session data
localStorage.getItem('username')     // Should have username
```

---

### Test 2: Login with GitHub

**Steps:**
1. Navigate to `http://localhost:3000/signin`
2. Click "Sign in with GitHub" button
3. Should redirect to GitHub login page
4. Login with GitHub account
5. Authorize the application
6. Should redirect back and process callback
7. Should redirect to dashboard

**Expected Result:**
- ✅ User logged in successfully
- ✅ Same behavior as Google login

---

### Test 3: Register with OAuth

**Steps:**
1. Navigate to `http://localhost:3000/register`
2. Click "Sign up with Google" or "Sign up with GitHub"
3. Authorize on provider
4. Should create new account
5. Should redirect to dashboard

**Expected Result:**
- ✅ New user created in database
- ✅ Profile created via Kafka event
- ✅ User logged in automatically

---

### Test 4: Link Google Account (Already Logged In)

**Steps:**
1. Login with username/password
2. Navigate to Profile Settings
3. Scroll to "Connected Accounts" section
4. Click "Link Account" for Google
5. Authorize on Google
6. Should redirect back
7. Should show "Connected" status for Google

**Expected Result:**
- ✅ Google account linked
- ✅ Can now login with Google
- ✅ Auth status updated

**Verify:**
```javascript
// Call API to check
fetch('http://localhost:9085/auth/oauth/auth-status', {
  headers: { 'Authorization': 'Bearer <your-token>' }
}).then(r => r.json()).then(console.log)

// Should show: oauthProviders: ["GOOGLE"]
```

---

### Test 5: Link GitHub Account

**Steps:**
1. Already logged in
2. Navigate to Profile Settings
3. Click "Link Account" for GitHub
4. Authorize on GitHub
5. Should redirect back
6. Should show "Connected" for both Google and GitHub

**Expected Result:**
- ✅ GitHub account linked
- ✅ User now has password + Google + GitHub

---

### Test 6: Unlink OAuth Account (With Password)

**Steps:**
1. User has password + Google + GitHub
2. In Profile Settings, click "Unlink" for Google
3. Confirm the dialog
4. Should show success message
5. Google should show "Not connected"

**Expected Result:**
- ✅ Google account unlinked
- ✅ User still has password + GitHub
- ✅ Can unlink because has other auth methods

---

### Test 7: Unlink Last OAuth (Should Fail)

**Steps:**
1. User has NO password, only Google
2. Try to click "Unlink" for Google
3. Should see warning message
4. Unlink button should be disabled

**Expected Result:**
- ❌ Cannot unlink (button disabled)
- ⚠️ Warning message shown
- ℹ️ "Set Password" form suggested

---

### Test 8: Set Password for OAuth-only User

**Steps:**
1. Login with only Google (no password)
2. Navigate to Profile Settings
3. See warning: "You only have 1 OAuth provider"
4. Scroll to "Set Password" section
5. Enter new password (must meet requirements)
6. Confirm password
7. Click "Set Password"
8. Should show success message

**Expected Result:**
- ✅ Password set successfully
- ✅ User now has Google + password
- ✅ Can now unlink Google
- ✅ Can login with username/password

**Password Requirements:**
- At least 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

---

### Test 9: OAuth Callback Error Handling

**Test 9.1: User Denies Access**

**Steps:**
1. Click "Sign in with Google"
2. On Google authorization page, click "Cancel"
3. Should redirect to callback with error

**Expected Result:**
- ❌ Error page shown
- 📝 Error message: "User denied access"
- ↩️ Redirect to signin after 2 seconds

**Test 9.2: Invalid State (CSRF)**

**Steps:**
1. Start OAuth flow normally
2. Clear sessionStorage before callback
3. Complete authorization
4. Should detect state mismatch

**Expected Result:**
- ❌ Error: "Invalid OAuth state - possible CSRF attack"
- ↩️ Redirect to signin

---

### Test 10: Opaque Token Verification

**Goal:** Verify that frontend receives opaque tokens, not JWT

**Steps:**
1. Login with OAuth
2. Open browser DevTools → Network tab
3. Find callback request
4. Check response body

**Expected Result:**
```json
{
  "token": "a1b2c3d4e5f6...",        // 32-char UUID (opaque)
  "refreshToken": "x1y2z3w4...",     // 32-char UUID (opaque)
  "tokenType": "Bearer"
}
```

**NOT:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // ❌ JWT format
}
```

**Verify in Redux DevTools:**
- accessToken should be opaque (32-char UUID)
- NOT JWT format (no dots, no base64)

---

## Debugging Tips

### Check Backend Logs

```bash
# Auth service logs
docker logs -f auth-service

# API Gateway logs
docker logs -f api-gateway
```

### Check Frontend Console

- Look for errors in browser console
- Check Network tab for API calls
- Verify redirect URLs

### Common Issues

**Issue 1: redirect_uri_mismatch**

Solution:
1. Go to Google Cloud Console
2. Add: `http://localhost:9085/auth/oauth/callback/google`
3. Wait 5-10 minutes

**Issue 2: State validation failed**

Solution:
- Clear sessionStorage
- Retry OAuth flow
- Check for browser extensions blocking storage

**Issue 3: Callback timeout**

Solution:
- Check backend is running: `docker ps`
- Check backend logs for errors
- Verify network connectivity

**Issue 4: Cannot unlink provider**

Reason: Only 1 auth method remaining

Solution:
- Set password first OR
- Link another OAuth provider

---

## API Testing with Postman

Import collection: `workfitai-platform/api-docs/OAuth2-Complete-Flow.postman_collection.json`

**Test Sequence:**
1. POST `/oauth/authorize/GOOGLE` → Get authorizationUrl
2. (Manual) Authorize on Google
3. GET `/oauth/callback/google?code=...&state=...` → Get tokens
4. GET `/oauth/auth-status` → Check linked accounts
5. DELETE `/oauth/unlink/GOOGLE` → Unlink account

---

## Automated Testing (Future)

### Cypress E2E Tests

```javascript
describe('OAuth Login Flow', () => {
  it('should login with Google', () => {
    cy.visit('/signin')
    cy.contains('Sign in with Google').click()
    // Mock OAuth provider response
    cy.intercept('POST', '/auth/oauth/authorize/GOOGLE', {
      statusCode: 200,
      body: { authorizationUrl: 'http://mock-google.com' }
    })
    // ... continue test
  })
})
```

---

## Test Checklist

### Before Testing
- [ ] Backend services running
- [ ] Frontend running
- [ ] Environment variables set
- [ ] OAuth providers configured
- [ ] Redis running (for opaque tokens)

### Login Tests
- [ ] Login with Google works
- [ ] Login with GitHub works
- [ ] Register with Google works
- [ ] Register with GitHub works
- [ ] OAuth callback handles errors

### Account Management Tests
- [ ] Link Google account works
- [ ] Link GitHub account works
- [ ] Unlink account works (with other auth methods)
- [ ] Cannot unlink last auth method
- [ ] Set password for OAuth-only user works

### Security Tests
- [ ] Opaque tokens received (not JWT)
- [ ] State validation works (CSRF protection)
- [ ] Token expiry handled correctly
- [ ] Unauthorized requests return 401

### Edge Cases
- [ ] User denies OAuth authorization
- [ ] Network error during callback
- [ ] Callback timeout (15 seconds)
- [ ] Multiple browser tabs/windows
- [ ] Session expired during OAuth flow

---

**Last Updated:** December 28, 2025  
**Status:** Ready for Testing
