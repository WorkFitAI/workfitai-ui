import type { CVListResponse, CVUploadResponse } from "@/types/cv";
import { cvClient } from "@/lib/axios-client";
import type { AxiosError } from "axios";

// Generic request wrapper using axios client
async function cvRequest<T>(
  path: string,
  options: { method?: string; data?: unknown; responseType?: "blob" | "json" } = {}
): Promise<T> {
  try {
    const response = await cvClient.request<T>({
      url: path,
      method: options.method || "GET",
      data: options.data,
      responseType: options.responseType,
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message ||
        axiosError.message ||
        "Request failed"
    );
  }
}

/**
 * Upload a CV file
 */
export const uploadCV = async (file: File): Promise<CVUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("templateType", "UPLOAD");

  const response = await cvClient.post<CVUploadResponse>("/candidate/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
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

  return cvRequest<CVListResponse>(
    `/candidate/${username}?${queryParams.toString()}`
  );
};

/**
 * Download a CV file
 */
export const downloadCV = async (objectName: string): Promise<Blob> => {
  const response = await cvClient.get(`/candidate/download/${objectName}`, {
    responseType: "blob",
  });
  return response.data;
};

/**
 * Delete a CV
 */
export const deleteCV = async (cvId: string): Promise<void> => {
  return cvRequest<void>(`/${cvId}`, {
    method: "DELETE",
  });
};
