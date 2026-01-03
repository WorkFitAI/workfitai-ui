/**
 * OAuth API Client
 *
 * Implements OAuth2 Authorization Code Flow with support for:
 * - Providers: GOOGLE, GITHUB
 * - Mode: LOGIN (new/existing user authentication)
 *
 * Flow:
 * 1. Call initiateOAuth() -> Get authorization URL
 * 2. Redirect user to provider
 * 3. Provider redirects back with code + state
 * 4. Call handleCallback() -> Exchange code for tokens
 */

import { authClient } from "@/lib/axios-client";
import type { AxiosError } from "axios";

// ============================================================================
// TYPES
// ============================================================================

export type OAuthProvider = "GOOGLE" | "GITHUB";

export interface OAuthAuthorizeRequest {
  redirectUri?: string;
  state?: string;
  scope?: string[];
}

export interface OAuthAuthorizeResponse {
  authorizationUrl: string;
  state: string;
  provider: string;
  expiresIn: number;
}

export interface OAuthUserInfo {
  providerId: string;
  email: string;
  name: string;
  picture: string;
  emailVerified: boolean;
  locale: string | null;
}

export interface OAuthCallbackResponse {
  token: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
  tokenType: "Bearer" | "LINK_SUCCESS";
  userInfo: OAuthUserInfo;
  // Additional fields from auth response
  accessToken?: string;
  expiryInMs?: number;
  username?: string;
  roles?: string[];
  companyId?: string;
}

export interface OAuthError {
  message: string;
  error?: string;
  errorDescription?: string;
}

/**
 * OAuth Exchange Response
 * Returned by GET /auth/oauth/exchange?session=xxx
 * Same format as login response
 */
export interface OAuthExchangeResponse {
  accessToken: string;
  username: string;
  roles: string[];
  companyId?: string | null;
  expiryInMs: number; // milliseconds until expiry
}

// ============================================================================
// OAUTH STATE MANAGEMENT
// ============================================================================

const OAUTH_STATE_KEY = "oauth_state";
const OAUTH_PROVIDER_KEY = "oauth_provider";

/**
 * Store OAuth state for CSRF validation
 */
export const storeOAuthState = (state: string, provider: OAuthProvider): void => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(OAUTH_STATE_KEY, state);
  sessionStorage.setItem(OAUTH_PROVIDER_KEY, provider);
};

/**
 * Get and validate stored OAuth state
 */
export const getStoredOAuthState = (): { state: string | null; provider: OAuthProvider | null } => {
  if (typeof window === "undefined") return { state: null, provider: null };
  return {
    state: sessionStorage.getItem(OAUTH_STATE_KEY),
    provider: sessionStorage.getItem(OAUTH_PROVIDER_KEY) as OAuthProvider | null,
  };
};

/**
 * Clear stored OAuth state
 */
export const clearOAuthState = (): void => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(OAUTH_STATE_KEY);
  sessionStorage.removeItem(OAUTH_PROVIDER_KEY);
};

/**
 * Validate OAuth state against stored state
 */
export const validateOAuthState = (receivedState: string): boolean => {
  const { state: storedState } = getStoredOAuthState();
  return storedState === receivedState;
};

// ============================================================================
// OAUTH API FUNCTIONS
// ============================================================================

/**
 * Step 1: Get OAuth authorization URL
 * POST /oauth/authorize/{provider}
 */
export const getOAuthAuthorizationUrl = async (
  provider: OAuthProvider,
  options: OAuthAuthorizeRequest = {}
): Promise<OAuthAuthorizeResponse> => {
  try {
    console.log(`[OAuth] Requesting authorization URL for ${provider}...`);

    // Backend returns wrapped response: {status, message, data}
    const response = await authClient.get<{
      status: number;
      message: string;
      data: OAuthAuthorizeResponse;
      source?: string;
      timestamp?: string;
    }>(`/oauth/authorize/${provider}`, { params: options });

    console.log(`[OAuth] Received authorization URL:`, response.data);

    // Unwrap the data field
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    console.error(`[OAuth] Failed to get authorization URL:`, {
      status: axiosError.response?.status,
      message: axiosError.response?.data?.message,
      error: axiosError.response?.data?.error,
      fullError: axiosError,
    });

    throw new Error(
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      axiosError.message ||
      "Failed to initiate OAuth flow. Please check your network connection."
    );
  }
};

/**
 * Initiate OAuth login/register flow
 * This is the main entry point for OAuth
 */
export const initiateOAuth = async (provider: OAuthProvider): Promise<void> => {
  // Get authorization URL from backend
  const response = await getOAuthAuthorizationUrl(provider);

  // Store state for CSRF validation
  storeOAuthState(response.state, provider);

  // Redirect to provider's authorization page
  window.location.href = response.authorizationUrl;
};

/**
 * Exchange OAuth session for tokens
 *
 * Called from /oauth-callback page after backend redirects with session ID.
 * Backend retrieves tokens from Redis, deletes session (one-time use),
 * sets refresh token cookie, and returns access token.
 *
 * @param sessionId - Session ID from URL (e.g., "oauth_sess_abc123")
 * @returns Token data (same format as login response)
 * @throws Error if session invalid/expired
 */
export const exchangeOAuthSession = async (
  sessionId: string
): Promise<OAuthExchangeResponse> => {
  try {
    console.log('[OAuth] Exchanging session for tokens:', sessionId);

    const response = await authClient.get<{
      status: string;
      message: string;
      data: OAuthExchangeResponse;
    }>(`/oauth/exchange`, {
      params: { session: sessionId },
      withCredentials: true, // CRITICAL: receive refresh token cookie
    });

    console.log('[OAuth] Exchange successful:', {
      username: response.data.data.username,
      roles: response.data.data.roles,
      hasToken: !!response.data.data.accessToken,
    });

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;

    console.error('[OAuth] Exchange failed:', {
      status: axiosError.response?.status,
      message: axiosError.response?.data?.message,
    });

    // Handle specific error cases
    if (axiosError.response?.status === 400) {
      throw new Error('OAuth session expired or invalid. Please try signing in again.');
    }

    throw new Error(
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      'Failed to complete OAuth authentication'
    );
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if OAuth callback has error parameters
 */
export const parseOAuthError = (
  searchParams: URLSearchParams
): OAuthError | null => {
  const error = searchParams.get("error");
  if (!error) return null;

  return {
    error,
    message: searchParams.get("error_description") || `OAuth error: ${error}`,
    errorDescription: searchParams.get("error_description") || undefined,
  };
};

/**
 * Get provider display name
 */
export const getProviderDisplayName = (provider: OAuthProvider): string => {
  switch (provider) {
    case "GOOGLE":
      return "Google";
    case "GITHUB":
      return "GitHub";
    default:
      return provider;
  }
};

/**
 * Get provider icon path
 */
export const getProviderIcon = (provider: OAuthProvider): string => {
  switch (provider) {
    case "GOOGLE":
      return "/assets/imgs/template/icons/icon-google.svg";
    case "GITHUB":
      return "/assets/imgs/template/icons/icon-github.svg";
    default:
      return "/assets/imgs/template/icons/icon-google.svg";
  }
};

// ============================================================================
// OAUTH ACCOUNT MANAGEMENT (LINK/UNLINK)
// ============================================================================

/**
 * Link OAuth provider to existing account
 * Requires authentication (Bearer token)
 */
export const linkOAuthProvider = async (
  provider: OAuthProvider,
  options: OAuthAuthorizeRequest = {}
): Promise<OAuthAuthorizeResponse> => {
  try {
    // This endpoint requires Authorization header
    // Backend will detect authenticated user and switch to LINK mode
    const response = await authClient.get<{
      status: number;
      message: string;
      data: OAuthAuthorizeResponse;
    }>(`/oauth/authorize/${provider}`, { params: options });

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Failed to link OAuth provider"
    );
  }
};

/**
 * Unlink OAuth provider from account
 * Requires authentication (Bearer token)
 */
export const unlinkOAuthProvider = async (
  provider: OAuthProvider
): Promise<void> => {
  try {
    await authClient.delete(`/oauth/unlink/${provider}`);
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Failed to unlink OAuth provider"
    );
  }
};

/**
 * Get user's authentication status
 * Returns available auth methods (password + OAuth providers)
 */
export interface AuthStatusResponse {
  userId: string;
  hasPassword: boolean;
  oauthProviders: OAuthProvider[];
  canUnlinkOAuth: boolean;
  message: string;
}

export const getAuthStatus = async (): Promise<AuthStatusResponse> => {
  try {
    const response = await authClient.get<{
      status: number;
      message: string;
      data: AuthStatusResponse;
    }>("/oauth/auth-status");

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Failed to get auth status"
    );
  }
};

/**
 * Set password for OAuth-only users
 * Allows OAuth users to add password authentication
 */
export interface SetPasswordRequest {
  newPassword: string;
}

export interface SetPasswordResponse {
  message: string;
}

export const setPassword = async (
  newPassword: string
): Promise<SetPasswordResponse> => {
  try {
    const response = await authClient.post<{
      status: number;
      message: string;
      data?: SetPasswordResponse;
    }>("/set-password", { newPassword });

    return response.data.data || { message: response.data.message };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Failed to set password"
    );
  }
};

/**
 * Initiate OAuth link flow
 * Similar to initiateOAuth but for linking accounts
 */
export const initiateLinkOAuth = async (provider: OAuthProvider): Promise<void> => {
  // Get authorization URL (with Bearer token, backend will detect LINK mode)
  const response = await linkOAuthProvider(provider);

  // Store state for CSRF validation
  storeOAuthState(response.state, provider);

  // Redirect to provider's authorization page
  window.location.href = response.authorizationUrl;
};
