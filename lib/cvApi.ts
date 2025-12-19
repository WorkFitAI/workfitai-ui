import type { CVListResponse, CVUploadResponse } from "@/types/cv";
import {
  handle401WithTokenRefresh,
  getCurrentAccessToken,
} from "@/lib/tokenRefreshHandler";
import { shouldAttemptRefresh, isPublicEndpoint } from "@/lib/endpointUtils";

const BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_BASE_URL?.replace("/auth", "/cv") ||
  "http://localhost:9085/cv";

// Generic request wrapper with automatic token refresh on 401
async function cvRequest<T>(
  path: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  // Check if endpoint is public
  const isPublic = isPublicEndpoint(path);

  // Only get access token for protected endpoints
  const accessToken = isPublic ? null : getCurrentAccessToken();

  const headers: HeadersInit = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    console.log(
      `[CVAPI] Request to ${path} failed with status ${response.status}`
    );

    // On 401, check if we should attempt refresh
    // Skip refresh for retry loops
    if (response.status === 401 && !isRetry && shouldAttemptRefresh(path)) {
      console.log(
        `[CVAPI] 401 detected on ${path}, attempting token refresh...`
      );

      // Attempt to refresh the token using centralized queue
      const newAccessToken = await handle401WithTokenRefresh();

      if (newAccessToken) {
        console.log(`[CVAPI] Token refreshed, retrying ${path}...`);
        // Retry the original request with the new token
        const retryHeaders: HeadersInit = {
          ...(options.body instanceof FormData
            ? {}
            : { "Content-Type": "application/json" }),
          Authorization: `Bearer ${newAccessToken}`,
          ...options.headers,
        };

        const retryResponse = await fetch(`${BASE_URL}${path}`, {
          ...options,
          headers: retryHeaders,
          credentials: "include",
        });

        if (!retryResponse.ok) {
          const retryError = await retryResponse
            .json()
            .catch(() => ({ message: "Request failed after token refresh" }));
          throw new Error(retryError.message || "Request failed");
        }

        return await retryResponse.json();
      }

      // If refresh failed, throw error
      throw new Error("Token refresh failed");
    }

    const error = await response
      .json()
      .catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  // For download endpoint, return blob
  if (path.includes("/download/")) {
    return (await response.blob()) as T;
  }

  return await response.json();
}

/**
 * Upload a CV file
 */
export const uploadCV = async (file: File): Promise<CVUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("templateType", "UPLOAD");

  return await cvRequest<CVUploadResponse>("/candidate/upload", {
    method: "POST",
    body: formData,
  });
};

/**
 * Get list of CVs for the current candidate
 */
export const getCVList = async (params: {
  username: string;
  page?: number;
  size?: number;
  templateType?: "UPLOAD" | "TEMPLATE";
}): Promise<CVListResponse> => {
  const { username, page = 0, size = 5, templateType = "UPLOAD" } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    templateType,
  });

  return await cvRequest<CVListResponse>(
    `/candidate/${username}?${queryParams.toString()}`
  );
};

/**
 * Download a CV file
 */
export const downloadCV = async (objectName: string): Promise<Blob> => {
  return await cvRequest<Blob>(`/candidate/download/${objectName}`, {
    method: "GET",
  });
};

/**
 * Delete a CV
 */
export const deleteCV = async (cvId: string): Promise<void> => {
  return await cvRequest<void>(`/${cvId}`, {
    method: "DELETE",
  });
};
