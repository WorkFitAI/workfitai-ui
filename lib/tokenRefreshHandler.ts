import { refreshToken, selectIsTokenValid, selectIsLoggedOut } from "@/redux/features/auth/authSlice";
import type { AppDispatch, AppStore } from "@/redux/store";

/**
 * Store reference for token refresh
 * This is set by the root Providers component
 */
let storeInstance: AppStore | null = null;

export const setStoreForTokenRefresh = (store: AppStore) => {
  storeInstance = store;
};

/**
 * Get store instance for other modules
 * Used by authApi.ts to check logout flag before retrying
 */
export const getStoreInstance = (): AppStore | null => {
  return storeInstance;
};

/**
 * Centralized token refresh queue
 * Ensures only ONE refresh request at a time
 * All other requests wait for the same refresh promise
 */
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

// Queue to hold pending requests during token refresh
type PendingRequest = {
  resolve: (token: string | null) => void;
  reject: (error: Error) => void;
};

let pendingRequestQueue: PendingRequest[] = [];

/**
 * Get current access token from Redux store
 * Returns null if token is expired or missing
 * Uses existing selectIsTokenValid selector for validation
 */
export const getCurrentAccessToken = (): string | null => {
  if (!storeInstance) return null;

  const state = storeInstance.getState();
  const isValid = selectIsTokenValid(state);

  // Return null if token is invalid/expired
  if (!isValid) return null;

  return state.auth.accessToken;
};

/**
 * @deprecated This function is UNRELIABLE and should NOT be used
 *
 * IMPORTANT: HttpOnly cookies (like RT) are NOT accessible via document.cookie
 * This is a browser security feature to prevent XSS attacks from stealing tokens.
 *
 * This function will ALWAYS return false for HttpOnly cookies, even when they exist.
 *
 * Instead of using this function:
 * - Always attempt token refresh on 401 errors (for protected endpoints)
 * - Let the backend validate RT cookie existence and validity
 * - Backend will return appropriate error if RT cookie is missing/expired
 *
 * Kept for backward compatibility only. Will be removed in future versions.
 */
export const hasRefreshTokenCookie = (): boolean => {
  if (typeof document === 'undefined') return false;

  // ⚠️ WARNING: This check does NOT work for HttpOnly cookies
  // HttpOnly cookies are intentionally hidden from document.cookie
  return document.cookie.split(';').some(cookie => {
    const trimmed = cookie.trim();
    return trimmed.startsWith('RT=');
  });
};

/**
 * Handles 401 error by dispatching Redux refreshToken action
 * Ensures only ONE refresh request is made
 * All concurrent requests wait for the same refresh promise
 * Returns new access token or null if refresh fails
 *
 * DESIGN DECISION: We do NOT check for RT cookie existence client-side because:
 * 1. HttpOnly cookies are not accessible via document.cookie (security feature)
 * 2. Client-side checks would always fail even when cookie exists
 * 3. Backend is the source of truth for cookie validation
 * 4. Backend will return appropriate error if RT cookie is missing/invalid
 *
 * This approach is more secure and reliable than client-side cookie inspection.
 */
export const handle401WithTokenRefresh = async (): Promise<string | null> => {
  // Check if user explicitly logged out
  if (storeInstance) {
    const state = storeInstance.getState();
    const isLoggedOut = selectIsLoggedOut(state);

    if (isLoggedOut) {
      console.log("[TokenRefresh] User logged out, skipping refresh");
      return null;
    }
  }

  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    console.log("[TokenRefresh] Refresh already in progress, waiting...");
    return refreshPromise;
  }

  // No store available (shouldn't happen in normal flow)
  if (!storeInstance) {
    console.error("[TokenRefresh] Store not initialized");
    return null;
  }

  // Always attempt refresh - backend will validate RT cookie existence/validity
  // No client-side cookie check because HttpOnly cookies are not accessible
  console.log("[TokenRefresh] Attempting token refresh (backend will validate RT cookie)");

  // Set refreshing flag and create promise
  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      console.log("[TokenRefresh] Dispatching refreshToken thunk...");

      // Dispatch the existing refreshToken thunk
      const result = await (storeInstance!.dispatch as AppDispatch)(
        refreshToken()
      );

      console.log("[TokenRefresh] Refresh result:", result.type);

      // Check if refresh was successful
      if (refreshToken.fulfilled.match(result)) {
        // Get the new access token from the action payload
        const newAccessToken = result.payload.accessToken;
        console.log("[TokenRefresh] Refresh successful, new token obtained");

        // Resolve all pending requests with the new token
        pendingRequestQueue.forEach((req) => req.resolve(newAccessToken));
        pendingRequestQueue = [];

        return newAccessToken;
      }

      // Refresh failed
      console.error("[TokenRefresh] Refresh action rejected");

      // Reject all pending requests
      const error = new Error("Token refresh failed");
      pendingRequestQueue.forEach((req) => req.reject(error));
      pendingRequestQueue = [];

      return null;
    } catch (error) {
      console.error("[TokenRefresh] Refresh failed:", error);

      // Reject all pending requests
      const err = error instanceof Error ? error : new Error("Token refresh failed");
      pendingRequestQueue.forEach((req) => req.reject(err));
      pendingRequestQueue = [];

      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

/**
 * Queue a request to wait for token refresh
 * Used when multiple requests get 401 simultaneously
 */
export const waitForTokenRefresh = (): Promise<string | null> => {
  // If already refreshing, wait for it
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  // Otherwise, queue the request
  return new Promise((resolve, reject) => {
    pendingRequestQueue.push({ resolve, reject });
  });
};

/**
 * Reset the refresh state (useful for testing or logout)
 */
export const resetRefreshState = () => {
  isRefreshing = false;
  refreshPromise = null;
  pendingRequestQueue = [];
};
