/**
 * Token Refresh Handler
 *
 * Provides store integration and token access for Redux thunks.
 * The actual refresh queue logic is now in lib/auth/refresh-queue.ts
 * and handled by axios interceptors.
 */

import {
  getAccessToken as getToken,
  setAccessToken,
  getTokenStore,
  resetAxiosAuth,
  getIsLoggedOut,
  setIsLoggedOut,
  refreshAccessToken as axiosRefresh,
} from "@/lib/axios-client";
import type { AppStore } from "@/redux/store";

// ============================================================================
// STORE INTEGRATION
// ============================================================================

/**
 * Store reference for Redux integration
 * Set by the root Providers component
 */
let storeInstance: AppStore | null = null;

export const setStoreForTokenRefresh = (store: AppStore): void => {
  storeInstance = store;
};

export const getStoreInstance = (): AppStore | null => storeInstance;

// ============================================================================
// TOKEN ACCESS (re-exported from axios-client)
// ============================================================================

/**
 * Get current access token from in-memory store
 * Returns null if token is expired or missing
 */
export const getCurrentAccessToken = (): string | null => {
  return getToken();
};

/**
 * Update token from API response (used by Redux thunks)
 * @param accessToken - The new access token
 * @param expiryInMs - Duration in milliseconds until expiry (will be converted to absolute timestamp)
 * @param username - Username
 * @param roles - User roles
 * @param companyId - Company ID
 */
export const updateTokenFromResponse = (
  accessToken: string,
  expiryInMs: number,
  username: string,
  roles: string[],
  companyId: string | null
): void => {
  // Convert duration to absolute timestamp
  const expiryTime = expiryInMs ? Date.now() + expiryInMs : undefined;
  setAccessToken(accessToken, expiryTime, username, roles, companyId);
};

/**
 * Get full token store (for Redux sync)
 */
export { getTokenStore };

/**
 * Get/set logout status
 */
export { getIsLoggedOut, setIsLoggedOut };

// ============================================================================
// REFRESH STATE MANAGEMENT
// ============================================================================

/**
 * Reset all auth state (call on logout)
 */
export const resetRefreshState = (): void => {
  resetAxiosAuth();
};

// ============================================================================
// LEGACY FUNCTIONS (for backward compatibility during migration)
// ============================================================================

/**
 * @deprecated Use axios interceptor instead. This is kept for backward compatibility.
 *
 * The axios response interceptor now handles 401 errors automatically.
 * This function just returns the current token or triggers a refresh.
 */
export const handle401WithTokenRefresh = async (): Promise<string | null> => {
  // Check if logged out
  if (getIsLoggedOut()) {
    console.log("[TokenRefresh] User logged out, skipping refresh");
    return null;
  }

  // Use axios-client's refresh function
  const token = await axiosRefresh();
  return token;
};

/**
 * @deprecated HttpOnly cookies are not accessible via document.cookie
 */
export const hasRefreshTokenCookie = (): boolean => {
  // HttpOnly cookies are not accessible from JavaScript
  // Always return false - backend will validate RT cookie
  return false;
};

/**
 * @deprecated Use handle401WithTokenRefresh instead
 */
export const waitForTokenRefresh = (): Promise<string | null> => {
  return handle401WithTokenRefresh();
};
