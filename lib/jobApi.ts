import { jobClient } from "@/lib/axios-client";
import { isPublicEndpoint } from "@/lib/endpointUtils";
import type { AxiosError } from "axios";

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
  accessToken?: string; // Legacy, not used with axios interceptor
}

const parseErrors = (errors: unknown): string[] => {
  if (!errors) return [];
  if (Array.isArray(errors)) return errors.map((e) => String(e));
  return [String(errors)];
};

// MAIN REQUEST WRAPPER
export const jobRequest = async <T>(
  path: string,
  options?: RequestOptions
): Promise<ApiResponse<T>> => {
  try {
    const response = await jobClient.request<ApiResponse<T>>({
      url: path,
      method: options?.method ?? "GET",
      data: options?.body,
    });

    const apiResponse = response.data;
    if (!apiResponse.message) apiResponse.message = "OK";

    return apiResponse;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<T>>;
    const responseData = axiosError.response?.data;
    const msg = responseData?.message || axiosError.message || "Request failed";
    const errorMsg = [...parseErrors(responseData?.errors), msg].join(" | ");

    if (axiosError.response?.status === 401) {
      throw new UnauthorizedError(errorMsg);
    }
    if (axiosError.response?.status === 403) {
      throw new ForbiddenError(errorMsg);
    }

    throw new ApiError(errorMsg, axiosError.response?.status || 500);
  }
};

export const jobRequestFormData = async <T>(
  path: string,
  formData: FormData,
  _isRetry = false, // Kept for backward compatibility but unused
  method: "POST" | "PUT" = "POST"
): Promise<ApiResponse<T>> => {
  try {
    const response = await jobClient.request<ApiResponse<T>>({
      url: path,
      method,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const apiResponse = response.data;
    if (!apiResponse.message) apiResponse.message = "OK";

    return apiResponse;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<T>>;
    const responseData = axiosError.response?.data;
    const msg = responseData?.message || axiosError.message || "Request failed";
    const errorMsg = [...parseErrors(responseData?.errors), msg].join(" | ");

    if (axiosError.response?.status === 401) {
      throw new UnauthorizedError(errorMsg);
    }
    if (axiosError.response?.status === 403) {
      throw new ForbiddenError(errorMsg);
    }

    throw new ApiError(errorMsg, axiosError.response?.status || 500);
  }
};

/**
 * Fetch company details by company number
 * Public endpoint - no authentication required
 */
export const fetchCompanyDetails = async (companyNo: string) => {
  return getJobs<import("@/types/job/company").Company>(
    `/public/companies/${companyNo}`
  );
};

/**
 * Fetch jobs for a specific company
 * Public endpoint - no authentication required
 */
export const fetchCompanyJobs = async (
  companyNo: string,
  page: number = 1,
  size: number = 20
) => {
  return getJobs<{
    meta: import("@/types/job/job").Meta;
    result: import("@/types/job/job").Job[];
  }>(`/public/companies/${companyNo}/jobs?page=${page}&size=${size}`);
};

export const getJobs = async <T>(path: string, options?: RequestOptions) =>
  jobRequest<T>(path, { ...options, method: "GET" });

export const postJob = async <T>(path: string, options?: RequestOptions) =>
  jobRequest<T>(path, { ...options, method: "POST" });

export const putJob = async <T>(path: string, options?: RequestOptions) =>
  jobRequest<T>(path, { ...options, method: "PUT" });

export const deleteJob = async <T>(path: string, options?: RequestOptions) =>
  jobRequest<T>(path, { ...options, method: "DELETE" });

export const postJobFormData = async <T>(path: string, formData: FormData) =>
  jobRequestFormData<T>(path, formData);

export const updateCompany = async (formData: FormData) => {
  return jobRequestFormData<import("@/types/job/company").Company>(
    `/hr/companies`,
    formData,
    false,
    "PUT"
  );
};

/**
 * Fetch job recommendations for the current user
 * Protected endpoint - requires authentication (CANDIDATE role)
 */
export const fetchRecommendations = async (topK: number = 10) => {
  return jobRequest<import("@/types/job/job").RecommendationResponse>(
    `/public/recommendations/for-me?topK=${topK}`,
    {
      method: "GET",
    }
  );
};
