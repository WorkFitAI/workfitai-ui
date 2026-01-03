/**
 * Endpoint Classification Utility
 * Centralizes logic for determining if endpoints are public or protected
 * and whether token refresh should be attempted
 */

/**
 * Public endpoints that don't require authentication
 * These endpoints should NEVER have Authorization headers
 */
const PUBLIC_ENDPOINT_PATTERNS = [
  // Job service public endpoints
  /^\/public\/jobs/,
  /^\/public\/job\//,

  // Auth service public endpoints
  /^\/login$/,
  /^\/register$/,
  /^\/verify-otp$/,
  /^\/forgot-password$/,
  /^\/reset-password$/,
];

/**
 * Endpoints that should never trigger token refresh
 * Includes public endpoints + endpoints that are part of auth flow
 */
const NO_REFRESH_ENDPOINT_PATTERNS = [
  ...PUBLIC_ENDPOINT_PATTERNS,
  /^\/refresh$/,    // Refresh endpoint itself
  /^\/logout$/,     // Logout endpoint
];

/**
 * Normalize path by removing query strings and trailing slashes
 */
export const normalizePath = (path: string): string => {
  // Handle null/undefined paths
  if (!path) return '/';

  // Remove query string
  const pathWithoutQuery = path.split('?')[0];
  // Remove trailing slash (except for root "/")
  return pathWithoutQuery.length > 1
    ? pathWithoutQuery.replace(/\/$/, '')
    : pathWithoutQuery;
};

/**
 * Check if an endpoint is public (doesn't require authentication)
 * Public endpoints should NOT have Authorization headers
 */
export const isPublicEndpoint = (path: string): boolean => {
  const normalized = normalizePath(path);
  return PUBLIC_ENDPOINT_PATTERNS.some(pattern => pattern.test(normalized));
};

/**
 * Check if token refresh should be attempted for this endpoint
 * Returns false for public endpoints and auth-flow endpoints
 */
export const shouldAttemptRefresh = (path: string): boolean => {
  const normalized = normalizePath(path);
  return !NO_REFRESH_ENDPOINT_PATTERNS.some(pattern => pattern.test(normalized));
};

/**
 * Check if endpoint requires authentication
 * (inverse of isPublicEndpoint, for clarity)
 */
export const isProtectedEndpoint = (path: string): boolean => {
  return !isPublicEndpoint(path);
};
