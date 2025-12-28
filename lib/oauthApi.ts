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
    // Backend returns wrapped response: {status, message, data}
    const response = await authClient.post<{
      status: number;
      message: string;
      data: OAuthAuthorizeResponse;
      source?: string;
      timestamp?: string;
    }>(`/oauth/authorize/${provider}`, options);

    // Unwrap the data field
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Failed to initiate OAuth flow"
    );
  }
};

/**
 * Step 2: Handle OAuth callback
 * GET /oauth/callback/{provider}?code=...&state=...
 */
export const handleOAuthCallback = async (
  provider: string,
  code: string,
  state: string,
  redirectUri?: string
): Promise<OAuthCallbackResponse> => {
  try {
    const params = new URLSearchParams({ code, state });
    if (redirectUri) {
      params.append("redirectUri", redirectUri);
    }

    // Backend returns wrapped response: {status, message, data}
    const response = await authClient.get<{
      status: number;
      message: string;
      data: OAuthCallbackResponse;
      source?: string;
      timestamp?: string;
    }>(`/oauth/callback/${provider.toLowerCase()}?${params.toString()}`);

    // Unwrap the data field
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; error?: string; error_description?: string }>;
    const errorData = axiosError.response?.data;

    throw new Error(
      errorData?.message ||
      errorData?.error_description ||
      errorData?.error ||
      "OAuth callback failed"
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
 * Process OAuth callback and get tokens
 * Called from the callback page
 */
export const processOAuthCallback = async (
  provider: string,
  code: string,
  state: string
): Promise<OAuthCallbackResponse> => {
  // Validate CSRF state
  if (!validateOAuthState(state)) {
    clearOAuthState();
    throw new Error("Invalid OAuth state - possible CSRF attack");
  }

  // Clear stored state
  clearOAuthState();

  // Exchange code for tokens
  return handleOAuthCallback(provider, code, state);
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
