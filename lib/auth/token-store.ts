/**
 * In-Memory Token Store
 *
 * Stores access token and user info in memory only (not localStorage)
 * for enhanced security against XSS attacks.
 */

// ============================================================================
// TOKEN STORE STATE
// ============================================================================

interface TokenStore {
  accessToken: string | null;
  expiryTime: number | null;
  username: string | null;
  roles: string[];
  companyId: string | null;
}

let tokenStore: TokenStore = {
  accessToken: null,
  expiryTime: null,
  username: null,
  roles: [],
  companyId: null,
};

// Flag to track if user explicitly logged out
let isLoggedOut = false;

// ============================================================================
// TOKEN MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Set access token in memory
 */
export const setAccessToken = (
  token: string | null,
  expiryMs?: number,
  username?: string,
  roles?: string[],
  companyId?: string | null
): void => {
  tokenStore = {
    accessToken: token,
    expiryTime: expiryMs ? Date.now() + expiryMs : null,
    username: username ?? tokenStore.username,
    roles: roles ?? tokenStore.roles,
    companyId: companyId !== undefined ? companyId : tokenStore.companyId,
  };
  isLoggedOut = false;

  // Keep username in localStorage for WebSocket auth
  if (username && typeof window !== "undefined") {
    localStorage.setItem("username", username);
  }
};

/**
 * Get current access token (returns null if expired)
 */
export const getAccessToken = (): string | null => {
  if (!tokenStore.accessToken) return null;
  if (tokenStore.expiryTime && Date.now() >= tokenStore.expiryTime) return null;
  return tokenStore.accessToken;
};

/**
 * Get full token store (for Redux sync)
 */
export const getTokenStore = (): TokenStore => ({ ...tokenStore });

/**
 * Clear access token (on logout)
 */
export const clearAccessToken = (): void => {
  tokenStore = {
    accessToken: null,
    expiryTime: null,
    username: null,
    roles: [],
    companyId: null,
  };
  isLoggedOut = true;

  if (typeof window !== "undefined") {
    localStorage.removeItem("username");
    localStorage.setItem("auth_logged_out", "true");
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (): boolean => {
  if (!tokenStore.expiryTime) return false;
  return Date.now() >= tokenStore.expiryTime;
};

/**
 * Get logout status
 */
export const getIsLoggedOut = (): boolean => isLoggedOut;

/**
 * Set logout status
 */
export const setIsLoggedOut = (value: boolean): void => {
  isLoggedOut = value;
  if (typeof window !== "undefined") {
    if (value) {
      localStorage.setItem("auth_logged_out", "true");
    } else {
      localStorage.removeItem("auth_logged_out");
    }
  }
};

export type { TokenStore };
