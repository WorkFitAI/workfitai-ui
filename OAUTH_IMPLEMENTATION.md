# OAuth Authentication - WorkFitAI UI

## Tổng quan

WorkFitAI UI đã được tích hợp đầy đủ OAuth authentication với Google và GitHub. Hệ thống hỗ trợ:

- ✅ **Login/Register** với Google và GitHub
- ✅ **Link/Unlink** OAuth accounts trong profile settings
- ✅ **Set Password** cho OAuth-only users
- ✅ **Opaque Token** security (JWT tokens được chuyển đổi thành opaque tokens qua API Gateway)
- ✅ **CSRF Protection** với state validation
- ✅ **Multiple Auth Methods** - Users có thể có nhiều phương thức đăng nhập

## Cấu trúc Files

```
workfitai-ui/
├── lib/
│   └── oauthApi.ts                    # OAuth API client & functions
├── components/
│   ├── auth/
│   │   └── SocialLogin.tsx            # OAuth login buttons
│   └── profile/
│       ├── ConnectedAccounts.tsx       # OAuth account management
│       ├── SetPasswordForm.tsx         # Set password cho OAuth users
│       └── SecuritySettings.tsx        # Profile security settings
└── app/
    ├── (candidate)/signin/
    │   └── page.tsx                   # Login page (có OAuth buttons)
    └── oauth-callback/[provider]/
        └── page.tsx                   # OAuth callback handler
```

## OAuth Flow

### 1. Login/Register Flow

```
User → Click "Sign in with Google/GitHub"
  ↓
Frontend: POST /auth/oauth/authorize/{PROVIDER} (empty body)
  ↓
Backend: Returns authorizationUrl
  ↓
Frontend: Redirect to provider (Google/GitHub)
  ↓
User: Authorizes on provider
  ↓
Provider: Redirects to /oauth/callback/{provider}?code=...&state=...
  ↓
Frontend: Validates state & exchanges code for tokens
  ↓
Backend (via Gateway): Converts JWT → Opaque tokens
  ↓
Frontend: Stores opaque tokens & redirects based on role
```

### 2. Link Account Flow

```
User → Profile Settings → Click "Link Google/GitHub Account"
  ↓
Frontend: POST /auth/oauth/authorize/{PROVIDER} (with Bearer token)
  ↓
Backend: Detects authenticated user → LINK mode
  ↓
Returns authorizationUrl with userId in state
  ↓
User: Authorizes on provider
  ↓
Provider: Redirects back
  ↓
Backend: Links provider to existing user account
  ↓
Frontend: Shows success & refreshes auth status
```

### 3. Unlink Account Flow

```
User → Profile Settings → Click "Unlink"
  ↓
Frontend: DELETE /oauth/unlink/{PROVIDER} (with Bearer token)
  ↓
Backend: Validates (must have at least 1 auth method remaining)
  ↓
If valid: Unlinks provider
If invalid: Returns error
  ↓
Frontend: Shows result & refreshes auth status
```

## API Usage

### Import OAuth Functions

```typescript
import {
  initiateOAuth,           // Login/Register
  initiateLinkOAuth,       // Link account
  unlinkOAuthProvider,     // Unlink account
  getAuthStatus,           // Get current auth methods
  setPassword,             // Set password for OAuth users
  type OAuthProvider
} from "@/lib/oauthApi";
```

### Login with OAuth

```typescript
const loginWithGoogle = async () => {
  try {
    // This will redirect to Google
    await initiateOAuth("GOOGLE");
  } catch (error) {
    showToast.error(error.message);
  }
};
```

### Link OAuth Account (User must be authenticated)

```typescript
const linkGoogle = async () => {
  try {
    // Requires Bearer token - axios client auto-injects
    await initiateLinkOAuth("GOOGLE");
  } catch (error) {
    showToast.error(error.message);
  }
};
```

### Unlink OAuth Account

```typescript
const unlinkGoogle = async () => {
  try {
    await unlinkOAuthProvider("GOOGLE");
    showToast.success("Google account unlinked");
  } catch (error) {
    showToast.error(error.message);
  }
};
```

### Get Auth Status

```typescript
const checkAuthStatus = async () => {
  try {
    const status = await getAuthStatus();
    console.log("Has password:", status.hasPassword);
    console.log("OAuth providers:", status.oauthProviders);
    console.log("Can unlink OAuth:", status.canUnlinkOAuth);
  } catch (error) {
    showToast.error(error.message);
  }
};
```

### Set Password (for OAuth-only users)

```typescript
const setUserPassword = async (newPassword: string) => {
  try {
    const response = await setPassword(newPassword);
    showToast.success(response.message);
  } catch (error) {
    showToast.error(error.message);
  }
};
```

## Components Usage

### 1. SocialLogin Component

Component hiển thị nút OAuth login:

```tsx
import SocialLogin, { OAuthButtons } from "@/components/auth/SocialLogin";

// Single button
<SocialLogin 
  provider="google" 
  text="Continue with Google"
/>

// Both buttons
<OAuthButtons mode="login" />
```

**Props:**
- `provider`: `"google" | "github"`
- `text`: Custom button text (optional)
- `disabled`: Disable button (optional)
- `onClick`: Custom click handler (optional)

### 2. ConnectedAccounts Component

Component quản lý OAuth accounts trong profile:

```tsx
import ConnectedAccounts from "@/components/profile/ConnectedAccounts";

<ConnectedAccounts 
  onPasswordRequired={() => {
    // Show set password form when user tries to unlink last OAuth
    setShowSetPasswordForm(true);
  }}
/>
```

**Features:**
- Hiển thị linked Google & GitHub accounts
- Link/Unlink buttons
- Warning nếu user chỉ có OAuth (no password)
- Auto-refresh sau link/unlink

### 3. SetPasswordForm Component

Component cho phép OAuth-only users set password:

```tsx
import SetPasswordForm from "@/components/profile/SetPasswordForm";

<SetPasswordForm 
  onSuccess={() => {
    showToast.success("Password set successfully!");
    // Refresh auth status or hide form
  }}
/>
```

**Features:**
- Password validation (8+ chars, uppercase, lowercase, number, special char)
- Show/hide password
- Confirm password matching
- Auto-toast notifications

## Environment Variables

Đảm bảo file `.env` có:

```env
NEXT_PUBLIC_API_URL=http://localhost:9085/
NEXT_PUBLIC_AUTH_BASE_URL=http://localhost:9085/auth
```

Backend cần có (trong `workfitai-platform/.env.local`):

```env
# Frontend base URL (for OAuth redirect after success)
FRONTEND_BASE_URL=http://localhost:3000

# Backend base URL (for OAuth provider callbacks)
BACKEND_BASE_URL=http://localhost:9085
```

## Security Features

### 1. Opaque Tokens

- Frontend **không bao giờ** nhận JWT tokens trực tiếp
- API Gateway chuyển đổi JWT → opaque tokens (32-char UUID)
- Opaque tokens được lưu trong memory (axios client) - không lưu localStorage
- Giảm thiểu rủi ro XSS attacks

### 2. CSRF Protection

- Backend tự động generate random UUID state
- State được lưu trong sessionStorage
- Callback handler validate state trước khi exchange code

### 3. Token Expiry

- Access token: 15 minutes
- Refresh token: 7 days
- Auto-refresh khi access token expired

### 4. Multiple Auth Methods

- Users có thể có password + Google + GitHub
- Không thể unlink OAuth nếu:
  - Chỉ còn 1 phương thức đăng nhập
  - Không có password và chỉ có 1 OAuth provider

## Testing

### 1. Test Login Flow

```bash
# Mở browser
http://localhost:3000/signin

# Click "Sign in with Google"
# → Redirect to Google
# → Authorize
# → Redirect về /oauth/callback/google
# → Auto login & redirect to dashboard
```

### 2. Test Link Flow

```bash
# Login với password/OAuth
# Navigate to Profile Settings
# Click "Link Google Account"
# → Redirect to Google
# → Authorize
# → Redirect back & show success
# → Account linked!
```

### 3. Test Unlink Flow

```bash
# In Profile Settings
# Click "Unlink" on linked provider
# → Confirm dialog
# → API call
# → Success toast
# → Provider removed from list
```

### 4. Test Set Password

```bash
# Login with only OAuth (no password)
# Navigate to Profile Settings
# → See warning message
# → Set Password form visible
# Enter password (meet requirements)
# Submit
# → Password set!
# → Can now login with username/password
```

## Backend Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/oauth/authorize/{PROVIDER}` | POST | Optional | Login hoặc Link (detected by Bearer token) |
| `/oauth/callback/{provider}` | GET | No | Exchange code for tokens (backend handles) |
| `/oauth/unlink/{PROVIDER}` | DELETE | Required | Unlink provider |
| `/oauth/auth-status` | GET | Required | Get auth methods |
| `/set-password` | POST | Required | Set password |

## Troubleshooting

### Issue: "redirect_uri_mismatch" từ Google

**Solution:** 
1. Vào Google Cloud Console
2. Add redirect URI: `http://localhost:9085/auth/oauth/callback/google`
3. Đợi 5-10 phút để Google cập nhật

### Issue: OAuth callback không nhận được tokens

**Check:**
1. Backend logs: `docker logs auth-service`
2. Network tab: Check API responses
3. Console: Check for errors in callback page

### Issue: Cannot unlink OAuth provider

**Reason:** User chỉ có 1 auth method
**Solution:** Set password trước hoặc link provider khác

### Issue: State validation failed

**Reason:** sessionStorage bị clear hoặc CSRF attack
**Solution:** Clear sessionStorage và retry OAuth flow

## Production Deployment

### 1. Update Environment Variables

```env
# Frontend
NEXT_PUBLIC_API_URL=https://api.your-domain.com/
NEXT_PUBLIC_AUTH_BASE_URL=https://api.your-domain.com/auth

# Backend
FRONTEND_BASE_URL=https://your-domain.com
BACKEND_BASE_URL=https://api.your-domain.com
```

### 2. Update OAuth Provider Configs

**Google Cloud Console:**
- Add: `https://api.your-domain.com/auth/oauth/callback/google`

**GitHub OAuth App:**
- Add: `https://api.your-domain.com/auth/oauth/callback/github`

### 3. Enable HTTPS

- OAuth **yêu cầu** HTTPS trong production
- Setup SSL certificates cho domain
- Update redirect URIs với `https://`

## Additional Resources

- [Backend OAuth Architecture](../workfitai-platform/docs/OAUTH_ARCHITECTURE.md)
- [OAuth Frontend Quick Start](../workfitai-platform/docs/OAUTH_FRONTEND_QUICK_START.md)
- [OAuth API Specification](../workfitai-platform/docs/OAUTH_UI_SPECIFICATION.md)
- [Google OAuth Setup Guide](../workfitai-platform/docs/OAUTH_GOOGLE_SETUP.md)
- [GitHub OAuth Setup Guide](../workfitai-platform/docs/GITHUB_OAUTH_SETUP.md)

---

**Last Updated:** December 28, 2025  
**Status:** ✅ Fully Implemented & Tested
