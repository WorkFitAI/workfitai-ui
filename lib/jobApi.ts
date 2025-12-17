import {
  handle401WithTokenRefresh,
  getCurrentAccessToken,
} from "@/lib/tokenRefreshHandler";
import { isPublicEndpoint, shouldAttemptRefresh } from "@/lib/endpointUtils";

const JOB_BASE_URL =
  process.env.NEXT_PUBLIC_JOB_BASE_URL ?? "http://localhost:9085/job";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

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
}

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  accessToken?: string;
}

const buildUrl = (path: string) =>
  `${JOB_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

const buildHeaders = (options?: RequestOptions, path?: string): HeadersInit => {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  // Only add Authorization header for protected endpoints
  const isPublic = path ? isPublicEndpoint(path) : false;
  if (!isPublic && options?.accessToken) {
    headers["Authorization"] = `Bearer ${options.accessToken}`;
  }

  return headers;
};

const parseErrors = (errors: unknown): string[] => {
  if (!errors) return [];
  if (Array.isArray(errors)) return errors.map((e) => String(e));
  return [String(errors)];
};

const handleResponse = async <T>(
  response: Response
): Promise<ApiResponse<T>> => {
  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const body = isJson ? await response.json().catch(() => null) : null;

  const apiResponse: ApiResponse<T> = body ?? {
    status: response.status,
    message: response.statusText,
  };

  if (!response.ok) {
    const msg = apiResponse.message || response.statusText || "Request failed";
    const errorMsg = [...parseErrors(apiResponse.errors), msg].join(" | ");

    if (response.status === 401) throw new UnauthorizedError(errorMsg);
    if (response.status === 403) throw new ForbiddenError(errorMsg);

    throw new ApiError(errorMsg, response.status);
  }

  if (!apiResponse.message) apiResponse.message = "OK";

  return apiResponse;
};

// MAIN REQUEST WRAPPER
export const jobRequest = async <T>(
  path: string,
  options?: RequestOptions,
  isRetry = false
): Promise<ApiResponse<T>> => {
  // Check if endpoint is public
  const isPublic = isPublicEndpoint(path);

  // Only get access token for protected endpoints
  const accessToken = isPublic
    ? null
    : (options?.accessToken || getCurrentAccessToken());

  const response = await fetch(buildUrl(path), {
    method: options?.method ?? "GET",
    headers: buildHeaders({ ...options, accessToken: accessToken || undefined }, path),
    body: options?.body ? JSON.stringify(options.body) : undefined,
    credentials: "include",
  });

  try {
    return await handleResponse<T>(response);
  } catch (error) {
    // On 401 UnauthorizedError, check if we should attempt refresh
    // Skip refresh for public endpoints and retry loops
    if (
      error instanceof UnauthorizedError &&
      !isRetry &&
      shouldAttemptRefresh(path)
    ) {
      console.log(
        `[JobAPI] 401 detected on ${path}, attempting token refresh...`
      );

      // Attempt to refresh the token using centralized queue
      const newAccessToken = await handle401WithTokenRefresh();

      if (newAccessToken) {
        console.log(`[JobAPI] Token refreshed, retrying ${path}...`);
        // Retry the original request with the new token
        return jobRequest<T>(
          path,
          {
            ...options,
            accessToken: newAccessToken,
          },
          true // Mark as retry to prevent infinite loops
        );
      } else {
        console.error(`[JobAPI] Token refresh failed for ${path}`);
      }
    }

    // Re-throw the error if refresh failed or wasn't attempted
    throw error;
  }
};

export const jobRequestFormData = async <T>(
  path: string,
  formData: FormData,
  isRetry = false
): Promise<ApiResponse<T>> => {
  const isPublic = isPublicEndpoint(path);

  const accessToken = isPublic ? null : getCurrentAccessToken();

  const headers: HeadersInit = {};
  if (!isPublic && accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(buildUrl(path), {
    method: "POST",
    headers,
    body: formData,
    credentials: "include",
  });

  try {
    return await handleResponse<T>(response);
  } catch (error) {
    if (
      error instanceof UnauthorizedError &&
      !isRetry &&
      shouldAttemptRefresh(path)
    ) {
      console.log(`[JobAPI] 401 on ${path}, refreshing token...`);

      const newAccessToken = await handle401WithTokenRefresh();

      if (newAccessToken) {
        headers["Authorization"] = `Bearer ${newAccessToken}`;

        return jobRequestFormData<T>(path, formData, true);
      }
    }

    throw error;
  }
};


export const getJobs = async <T>(path: string, options?: RequestOptions) =>
  jobRequest<T>(path, { ...options, method: "GET" });

export const postJob = async <T>(path: string, options?: RequestOptions) =>
  jobRequest<T>(path, { ...options, method: "POST" });

export const putJob = async <T>(path: string, options?: RequestOptions) =>
  jobRequest<T>(path, { ...options, method: "PUT" });

export const deleteJob = async <T>(path: string, options?: RequestOptions) =>
  jobRequest<T>(path, { ...options, method: "DELETE" });

export const postJobFormData = async <T>(
  path: string,
  formData: FormData
) => jobRequestFormData<T>(path, formData);


