import {
  handle401WithTokenRefresh,
  getCurrentAccessToken,
} from "@/lib/tokenRefreshHandler";
import { isPublicEndpoint, shouldAttemptRefresh } from "@/lib/endpointUtils";

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
  accessToken?: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_AUTH_BASE_URL || "http://localhost:9085/auth";

export const authRequest = async <T>(
  endpoint: string,
  options: RequestOptions = {},
  isRetry = false
): Promise<ApiResponse<T>> => {
  const { body, deviceId } = options;

  // Check if endpoint is public
  const isPublic = isPublicEndpoint(endpoint);

  // Only get access token for protected endpoints
  const accessToken = isPublic
    ? null
    : (options.accessToken || getCurrentAccessToken());

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (deviceId) {
    headers["X-Device-Id"] = deviceId;
  }

  // Only add Authorization header for protected endpoints
  if (!isPublic && accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  // Determine method: POST for refresh endpoint or when body exists, otherwise GET
  const method = endpoint === "/refresh" || body ? "POST" : "GET";

  const config: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include", // Required for HttpOnly refresh token cookies
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    // Check both HTTP status and response body status
    // Backend may return HTTP 200 with error payload like {"status": 401, "message": "..."}
    const statusCode = data.status || response.status;
    const isError = !response.ok || (data.status && data.status >= 400);

    if (isError) {
      if (statusCode === 401) {
        // On 401, check if we should attempt refresh
        // Skip refresh for public endpoints and retry loops
        if (!isRetry && shouldAttemptRefresh(endpoint)) {
          console.log(
            `[AuthAPI] 401 detected on ${endpoint}, attempting token refresh...`
          );

          // Attempt to refresh the token using centralized queue
          const newAccessToken = await handle401WithTokenRefresh();

          if (newAccessToken) {
            console.log(`[AuthAPI] Token refreshed, retrying ${endpoint}...`);
            // Retry the original request with the new token
            return authRequest<T>(
              endpoint,
              {
                ...options,
                accessToken: newAccessToken,
              },
              true // Mark as retry to prevent infinite loops
            );
          } else {
            console.error(`[AuthAPI] Token refresh failed for ${endpoint}`);
          }
        }
        throw new UnauthorizedError(data.message || "Unauthorized");
      }
      if (statusCode === 403) {
        throw new ForbiddenError(data.message || "Forbidden");
      }
      throw new Error(data.message || "An error occurred");
    }

    return data;
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
      throw error;
    }
    throw new Error(error instanceof Error ? error.message : "Network error");
  }
};

export const postAuth = async <T>(
  endpoint: string,
  options: RequestOptions
): Promise<ApiResponse<T>> => {
  return authRequest<T>(endpoint, { ...options, body: options.body });
};

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: "CANDIDATE" | "HR" | "HR_MANAGER" | "ADMIN";
  hrProfile?: {
    department: string;
    hrManagerEmail?: string; // Required for HR only
    address: string;
  };
  company?: {
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
