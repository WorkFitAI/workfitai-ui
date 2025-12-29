/**
 * Unified Authentication Handlers
 *
 * Common authentication success/error handlers used by both:
 * - Regular login (username/password)
 * - OAuth login (Google, GitHub)
 *
 * Ensures consistent auth flow behavior regardless of auth method.
 * Follows the EXACT same flow as loginUser in authSlice.ts
 */

import { AppDispatch } from '@/redux/store';
import { setOAuthLoginSuccess, AUTH_STORAGE_KEY } from '@/redux/features/auth/authSlice';
import { setAccessToken } from '@/lib/axios-client';
import { showToast } from '@/lib/toast';
import type { OAuthSuccessData } from '@/types/oauth';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

// Helper to persist session - matches authSlice.ts persistSession()
const persistSession = (session: {
  username: string;
  roles: string[];
  companyId?: string;
  expiryTime: number | null;
}) => {
  if (typeof window === 'undefined') return;

  // Store username separately for WebSocket authentication
  // WebSocket needs username in X-Username header for Spring user session tracking
  if (session.username) {
    localStorage.setItem('username', session.username);
  }

  // Store minimal session info (no token) for UI state restoration
  const minimalSession = {
    username: session.username,
    roles: session.roles,
    companyId: session.companyId,
    expiryTime: session.expiryTime,
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(minimalSession));
};

// Clear logout flag - matches authSlice.ts clearLogoutFlag()
const clearLogoutFlag = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_logged_out');
  }
};

/**
 * Handle successful authentication (both regular login and OAuth)
 *
 * This function follows the EXACT same flow as loginUser.fulfilled in authSlice.ts:
 * 1. Store token in axios in-memory store (NOT localStorage - XSS protection)
 * 2. Persist minimal session info to localStorage (username, roles - no token)
 * 3. Update Redux auth state via setOAuthLoginSuccess
 * 4. Clear logout flag
 * 5. Navigate to appropriate dashboard based on role
 *
 * @param data - Auth success data (accessToken, username, roles, etc.)
 * @param dispatch - Redux dispatch function
 * @param router - Next.js router instance
 */
export const handleAuthSuccess = (
  data: OAuthSuccessData,
  dispatch: AppDispatch,
  router: AppRouterInstance
): void => {
  const { accessToken, username, roles, companyId, expiresIn, email, avatarUrl } = data;

  try {
    // Calculate expiry time (absolute timestamp) - matches calculateExpiryTime() in authSlice
    // expiresIn from OAuth is in milliseconds
    const expiryTime = expiresIn && expiresIn > 0 ? Date.now() + expiresIn : null;

    console.log('[Auth Handler] Processing auth success:', {
      username,
      roles,
      hasToken: !!accessToken,
      expiryTime,
      companyId,
    });

    // Step 1: Store token in axios in-memory store (NOT localStorage)
    // This matches the flow in loginUser.fulfilled (lines 531-538)
    setAccessToken(
      accessToken,
      expiryTime ?? undefined,
      username,
      roles,
      companyId
    );

    // Step 2: Persist minimal session info to localStorage (username, roles - no token)
    // This matches persistSession() call in loginUser.fulfilled (line 541)
    persistSession({
      username,
      roles,
      companyId,
      expiryTime,
    });

    // Step 3: Update Redux auth state via setOAuthLoginSuccess
    // This is the source of truth for React components
    dispatch(setOAuthLoginSuccess({
      accessToken,
      expiryTime,
      username,
      roles,
      companyId,
      email,
      avatarUrl,
    }));

    // Step 4: Clear logout flag (matches clearLogoutFlag() in loginUser.fulfilled line 803)
    clearLogoutFlag();

    // Step 5: Show success notification
    showToast.success('Successfully signed in!');

    // Step 6: Navigate to appropriate dashboard based on role
    // Wait briefly for state to propagate
    setTimeout(() => {
      if (roles.includes('ADMIN')) {
        window.location.href = '/admin/users';
      } else if (roles.includes('HR_MANAGER')) {
        window.location.href = '/hr-manager';
      } else if (roles.includes('HR')) {
        window.location.href = '/hr/applications';
      } else {
        router.push('/');
      }
    }, 100);

  } catch (error) {
    console.error('[Auth Handler] Error processing auth success:', error);
    showToast.error('Authentication succeeded but session setup failed. Please try again.');
  }
};

/**
 * Handle authentication error (both regular login and OAuth)
 *
 * @param error - Error message
 */
export const handleAuthError = (error: string): void => {
  console.error('[Auth Handler] Auth error:', error);
  showToast.error(error);
};

/**
 * Handle OAuth link success
 *
 * @param message - Success message from backend
 */
export const handleOAuthLinkSuccess = (message: string): void => {
  console.log('[Auth Handler] OAuth link success:', message);
  showToast.success(message || 'Account linked successfully!');
};
