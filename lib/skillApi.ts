import { jobClient } from "@/lib/axios-client";
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

/* ===================== MAIN REQUEST ===================== */

export const skillRequest = async <T>(
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

/* ===================== SHORTCUT METHODS ===================== */

export const getSkills = async <T>(path: string, options?: RequestOptions) =>
    skillRequest<T>(path, { ...options, method: "GET" });

export const postSkill = async <T>(path: string, options?: RequestOptions) =>
    skillRequest<T>(path, { ...options, method: "POST" });

export const putSkill = async <T>(path: string, options?: RequestOptions) =>
    skillRequest<T>(path, { ...options, method: "PUT" });

export const deleteSkill = async <T>(path: string, options?: RequestOptions) =>
    skillRequest<T>(path, { ...options, method: "DELETE" });
