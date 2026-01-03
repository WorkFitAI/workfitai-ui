/**
 * OAuth Type Definitions
 *
 * Core data types for OAuth authentication flow.
 */

/**
 * OAuth Success Data
 * Returned when OAuth login completes successfully
 */
export interface OAuthSuccessData {
  accessToken: string;
  username: string;
  roles: string[];
  companyId?: string;
  expiresIn: number; // milliseconds
  email?: string;
  avatarUrl?: string;
}
