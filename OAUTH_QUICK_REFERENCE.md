# OAuth Quick Reference - WorkFitAI UI

## 🚀 Quick Start

### Login with OAuth
```typescript
import { initiateOAuth } from "@/lib/oauthApi";

await initiateOAuth("GOOGLE");  // or "GITHUB"
```

### Use SocialLogin Component
```tsx
import SocialLogin from "@/components/auth/SocialLogin";

<SocialLogin provider="google" />
<SocialLogin provider="github" />
```

---

## 📚 API Functions

| Function | Purpose | Auth Required | Returns |
|----------|---------|---------------|---------|
| `initiateOAuth(provider)` | Login/Register | No | `void` (redirects) |
| `initiateLinkOAuth(provider)` | Link account | Yes | `void` (redirects) |
| `unlinkOAuthProvider(provider)` | Unlink account | Yes | `Promise<void>` |
| `getAuthStatus()` | Get auth methods | Yes | `Promise<AuthStatusResponse>` |
| `setPassword(password)` | Set password | Yes | `Promise<SetPasswordResponse>` |

---

## 🎨 Components

### SocialLogin
```tsx
<SocialLogin 
  provider="google"           // "google" | "github"
  text="Sign in with Google"  // Optional custom text
  disabled={false}            // Optional
/>
```

### ConnectedAccounts
```tsx
<ConnectedAccounts 
  onPasswordRequired={() => {
    // Called when user tries to unlink last OAuth
    setShowSetPasswordForm(true);
  }}
/>
```

### SetPasswordForm
```tsx
<SetPasswordForm 
  onSuccess={() => {
    // Called after password is set successfully
    showToast.success("Password set!");
  }}
/>
```

---

## 🔐 Auth Status Response

```typescript
interface AuthStatusResponse {
  userId: string;
  hasPassword: boolean;              // User has password auth?
  oauthProviders: OAuthProvider[];   // ["GOOGLE", "GITHUB"]
  canUnlinkOAuth: boolean;           // Can unlink OAuth?
  message: string;                   // Info/warning message
}
```

**Example:**
```json
{
  "userId": "123",
  "hasPassword": false,
  "oauthProviders": ["GOOGLE"],
  "canUnlinkOAuth": false,
  "message": "You only have 1 OAuth provider and no password. Please set a password first."
}
```

---

## 🌊 OAuth Flows

### Login Flow
```
User → initiateOAuth("GOOGLE")
  → Redirect to Google
  → User authorizes
  → Redirect to /oauth-callback/google
  → Process callback
  → Store tokens
  → Redirect to dashboard
```

### Link Flow
```
Logged in User → initiateLinkOAuth("GOOGLE")
  → Redirect to Google (with userId in state)
  → User authorizes
  → Redirect to /oauth-callback/google
  → Link account
  → Show success
```

### Unlink Flow
```
User → unlinkOAuthProvider("GOOGLE")
  → Validate (must have >1 auth method)
  → If valid: Unlink
  → If invalid: Error
```

---

## ⚠️ Common Errors

| Error | Reason | Solution |
|-------|--------|----------|
| `redirect_uri_mismatch` | Redirect URI not in Google Console | Add URI to Google Console |
| `Invalid OAuth state` | CSRF validation failed | Clear sessionStorage, retry |
| `Cannot unlink last auth method` | User only has 1 auth method | Set password or link another provider |
| `Authentication required` | No Bearer token in LINK mode | Login first |
| `Email already in use` | Email exists for another user | Use different account |

---

## 🔧 Environment Variables

**.env (Frontend):**
```env
NEXT_PUBLIC_API_URL=http://localhost:9085/
NEXT_PUBLIC_AUTH_BASE_URL=http://localhost:9085/auth
```

**workfitai-platform/.env.local (Backend):**
```env
FRONTEND_BASE_URL=http://localhost:3000
BACKEND_BASE_URL=http://localhost:9085
```

---

## 📂 File Structure

```
lib/oauthApi.ts              → OAuth API functions
components/auth/
  └── SocialLogin.tsx        → OAuth buttons
components/profile/
  ├── ConnectedAccounts.tsx  → Account management
  └── SetPasswordForm.tsx    → Set password
app/oauth-callback/[provider]/
  └── page.tsx              → Callback handler
```

---

## 🎯 Key Features

✅ **Login/Register** with Google & GitHub  
✅ **Link/Unlink** OAuth accounts  
✅ **Set Password** for OAuth-only users  
✅ **Opaque Tokens** (not JWT) for security  
✅ **CSRF Protection** with state validation  
✅ **Multiple Auth Methods** support  

---

## 📖 Documentation

- [OAUTH_IMPLEMENTATION.md](./OAUTH_IMPLEMENTATION.md) - Full guide
- [OAUTH_TESTING.md](./OAUTH_TESTING.md) - Test cases
- [Backend OAuth Docs](../workfitai-platform/docs/OAUTH_ARCHITECTURE.md)

---

**Version:** 1.0  
**Last Updated:** December 28, 2025
