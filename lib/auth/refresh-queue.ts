/**
 * Token Refresh Queue
 *
 * Handles token refresh with queue pattern to prevent
 * multiple concurrent refresh calls on 401 errors.
 */

import {
  setAccessToken,
  clearAccessToken,
  getIsLoggedOut,
} from "./token-store";
import { AUTH_BASE_URL } from "./api-config";

// ============================================================================
// REFRESH STATE
// ============================================================================

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

interface QueuedRequest {
  resolve: (token: string | null) => void;
  reject: (error: Error) => void;
}

let failedQueue: QueuedRequest[] = [];

// ============================================================================
// QUEUE MANAGEMENT
// ============================================================================

const processQueue = (
  error: Error | null,
  token: string | null = null
): void => {
  failedQueue.forEach((req) => {
    if (error) {
      req.reject(error);
    } else {
      req.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Add request to queue (called when refresh is in progress)
 */
export const addToRefreshQueue = (
  resolve: (token: string | null) => void,
  reject: (error: Error) => void
): void => {
  failedQueue.push({ resolve, reject });
};

/**
 * Check if refresh is in progress
 */
export const getIsRefreshing = (): boolean => isRefreshing;

// ============================================================================
// REFRESH TOKEN FUNCTION
// ============================================================================

/**
 * Refresh access token using RT cookie
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  // If already refreshing, return existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  // Check if logged out
  if (getIsLoggedOut()) {
    return null;
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      // Use raw fetch for refresh to avoid interceptor loop
      const response = await fetch(`${AUTH_BASE_URL}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Send RT cookie
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      const { accessToken, expiryInMs, username, roles, companyId } = data.data;

      // Update in-memory store
      setAccessToken(accessToken, expiryInMs, username, roles, companyId);

      // Process queued requests
      processQueue(null, accessToken);

      return accessToken;
    } catch (error) {
      // Clear token and process queue with error
      clearAccessToken();
      processQueue(
        error instanceof Error ? error : new Error("Refresh failed")
      );
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

/**
 * Reset refresh state (call on logout)
 */
export const resetRefreshState = (): void => {
  isRefreshing = false;
  refreshPromise = null;
  failedQueue = [];
};
