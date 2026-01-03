/**
 * Auth API Client
 *
 * Uses centralized axios client with interceptors for:
 * - Automatic token injection
 * - 401 handling with token refresh
 * - Queue pattern for concurrent requests
 */

import { authClient } from "@/lib/axios-client";
import type { AxiosError } from "axios";

// ============================================================================
// ERROR CLASSES
// ============================================================================

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

// ============================================================================
// TYPES
// ============================================================================

export interface AuthTokens {
  accessToken: string;
  expiryInMinutes: number | null;
  tokenType?: string;
  source?: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  status: number;
  success: boolean;
  tokenType?: string;
  source?: string;
}

interface RequestOptions {
  body?: unknown;
  deviceId?: string;
  accessToken?: string; // Legacy, not used with axios interceptor
}

// ============================================================================
// AUTH REQUEST FUNCTION
// ============================================================================

/**
 * Make an authenticated request to the auth API
 * Uses axios interceptor for automatic token injection and 401 handling
 */
export const authRequest = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const { body, deviceId } = options;

  const headers: Record<string, string> = {};
  if (deviceId) {
    headers["X-Device-Id"] = deviceId;
  }

  // Determine method: POST for refresh/logout endpoints or when body exists
  const method =
    endpoint === "/refresh" || endpoint === "/logout" || body ? "POST" : "GET";

  try {
    const response = await authClient.request<ApiResponse<T>>({
      url: endpoint,
      method,
      data: body,
      headers,
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{
      message?: string;
      status?: number;
    }>;

    if (axiosError.response?.status === 401) {
      throw new UnauthorizedError(
        axiosError.response.data?.message || "Unauthorized"
      );
    }
    if (axiosError.response?.status === 403) {
      throw new ForbiddenError(
        axiosError.response.data?.message || "Forbidden"
      );
    }

    throw new Error(axiosError.response?.data?.message || "Network error");
  }
};

/**
 * POST request to auth API
 */
export const postAuth = async <T>(
  endpoint: string,
  options: RequestOptions
): Promise<ApiResponse<T>> => {
  return authRequest<T>(endpoint, { ...options, body: options.body });
};

// ============================================================================
// REGISTRATION
// ============================================================================

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: "CANDIDATE" | "HR" | "HR_MANAGER" | "ADMIN";
  hrProfile?: {
    department: string;
    hrManagerEmail?: string;
    address: string;
  };
  company?: {
    companyNo: string;
    name: string;
    logoUrl?: string;
    websiteUrl?: string;
    description?: string;
    address: string;
    size?: string;
  };
}

export const register = async (
  request: RegisterRequest,
  deviceId?: string
): Promise<ApiResponse<string>> => {
  return postAuth<string>("/register", {
    body: request,
    deviceId,
  });
};

// ============================================================================
// TWO-FACTOR AUTHENTICATION
// ============================================================================

export interface TwoFactorStatus {
  enabled: boolean;
  method: "TOTP" | "EMAIL" | null;
  enabledAt: string | null;
}

export const get2FAStatus = async (): Promise<ApiResponse<TwoFactorStatus>> => {
  return authRequest<TwoFactorStatus>("/2fa/status", {});
};
