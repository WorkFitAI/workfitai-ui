const AUTH_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? "http://localhost:9085/auth";

type HttpMethod = "GET" | "POST" | "DELETE";

// Custom error classes for different HTTP status codes
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Access denied") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export interface ApiResponse<T> {
  status: number;
  message?: string;
  data?: T;
  errors?: unknown[];
  timestamp?: string;
  source?: string;
  tokenType?: string;
}

export interface AuthTokens {
  accessToken: string;
  expiryInMinutes: number;
}

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  deviceId?: string;
  accessToken?: string;
}

const buildUrl = (path: string) =>
  `${AUTH_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

const buildHeaders = (options?: RequestOptions): HeadersInit => {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (options?.deviceId) {
    headers["X-Device-Id"] = options.deviceId;
  }

  if (options?.accessToken) {
    headers["Authorization"] = `Bearer ${options.accessToken}`;
  }

  return headers;
};

const parseErrors = (errors: unknown): string[] => {
  if (!errors) return [];
  if (Array.isArray(errors)) {
    return errors
      .map((err) => {
        if (typeof err === "string") return err;
        try {
          return JSON.stringify(err);
        } catch {
          return String(err);
        }
      })
      .filter(Boolean);
  }
  if (typeof errors === "string") return [errors];
  try {
    return [JSON.stringify(errors)];
  } catch {
    return [String(errors)];
  }
};

const handleResponse = async <T>(
  response: Response
): Promise<ApiResponse<T>> => {
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const parsed = (
    isJson ? await response.json().catch(() => null) : null
  ) as ApiResponse<T> | null;

  const apiResponse: ApiResponse<T> = parsed ?? {
    status: response.status,
    message: response.statusText,
  };

  if (!response.ok) {
    const fallbackMessage = response.statusText || "Request failed";
    const message = apiResponse.message || fallbackMessage;
    const errorMessages = parseErrors(apiResponse.errors);
    const combinedMessage = [message, ...errorMessages]
      .filter(Boolean)
      .join(" | ");
    const errorMessage = combinedMessage || fallbackMessage;

    // Throw specific error types based on HTTP status code
    if (response.status === 401) {
      throw new UnauthorizedError(errorMessage);
    }
    if (response.status === 403) {
      throw new ForbiddenError(errorMessage);
    }
    throw new ApiError(errorMessage, response.status);
  }

  if (!apiResponse.message && response.ok) {
    apiResponse.message = "OK";
  }

  return apiResponse;
};

export const authRequest = async <T>(
  path: string,
  options?: RequestOptions
): Promise<ApiResponse<T>> => {
  const response = await fetch(buildUrl(path), {
    method: options?.method ?? "GET",
    headers: buildHeaders(options),
    body: options?.body ? JSON.stringify(options.body) : undefined,
    credentials: "include",
  });

  return handleResponse<T>(response);
};

export const postAuth = async <T>(path: string, options?: RequestOptions) =>
  authRequest<T>(path, { ...options, method: "POST" });

export const deleteAuth = async <T>(path: string, options?: RequestOptions) =>
  authRequest<T>(path, { ...options, method: "DELETE" });
