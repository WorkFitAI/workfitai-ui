// import { getDeviceId } from "@/lib/deviceId";

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
  process.env.NEXT_PUBLIC_API_URL + "auth" || "http://localhost:9085/";

export const authRequest = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const { body, deviceId, accessToken } = options;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (deviceId) {
    headers["X-Device-Id"] = deviceId;
  }

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const config: RequestInit = {
    method: body ? "POST" : "GET",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw new UnauthorizedError(data.message || "Unauthorized");
      }
      if (response.status === 403) {
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
