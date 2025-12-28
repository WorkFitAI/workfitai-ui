/**
 * Centralized Axios Client with Interceptors
 *
 * This is the main entry point for the axios auth module.
 * Re-exports from modular files for easy imports.
 *
 * Features:
 * - In-memory token store (no localStorage for access token)
 * - Request interceptor: automatic token injection
 * - Response interceptor: 401 handling with token refresh
 * - Queue pattern: prevents multiple concurrent refresh calls
 * - Pre-configured clients for each service
 */

// Re-export token store functions
export {
  setAccessToken,
  getAccessToken,
  getTokenStore,
  clearAccessToken,
  clearAccessTokenSilent,
  isTokenExpired,
  getIsLoggedOut,
  setIsLoggedOut,
  type TokenStore,
} from "./auth/token-store";

// Re-export API configuration
export {
  AUTH_BASE_URL,
  JOB_BASE_URL,
  APPLICATION_BASE_URL,
  USER_BASE_URL,
  NOTIFICATION_BASE_URL,
  CV_BASE_URL,
  MONITORING_BASE_URL,
} from "./auth/api-config";

// Re-export refresh queue functions
export {
  refreshAccessToken,
  resetRefreshState,
} from "./auth/refresh-queue";

// Re-export axios factory
export { createApiClient } from "./auth/axios-factory";

// Import for creating clients
import { createApiClient } from "./auth/axios-factory";
import {
  AUTH_BASE_URL,
  JOB_BASE_URL,
  APPLICATION_BASE_URL,
  USER_BASE_URL,
  NOTIFICATION_BASE_URL,
  CV_BASE_URL,
  MONITORING_BASE_URL,
} from "./auth/api-config";
import { clearAccessToken } from "./auth/token-store";
import { resetRefreshState } from "./auth/refresh-queue";

// ============================================================================
// PRE-CONFIGURED CLIENTS
// ============================================================================

export const authClient = createApiClient(AUTH_BASE_URL);
export const jobClient = createApiClient(JOB_BASE_URL);
export const applicationClient = createApiClient(APPLICATION_BASE_URL);
export const userClient = createApiClient(USER_BASE_URL);
export const notificationClient = createApiClient(NOTIFICATION_BASE_URL);
export const cvClient = createApiClient(CV_BASE_URL);
export const monitoringClient = createApiClient(MONITORING_BASE_URL);

// ============================================================================
// RESET FUNCTION (for logout)
// ============================================================================

/**
 * Reset all auth state (call on logout)
 */
export const resetAxiosAuth = (): void => {
  clearAccessToken();
  resetRefreshState();
};
