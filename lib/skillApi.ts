import {
    handle401WithTokenRefresh,
    getCurrentAccessToken,
} from "@/lib/tokenRefreshHandler";
import { isPublicEndpoint, shouldAttemptRefresh } from "@/lib/endpointUtils";

const SKILL_BASE_URL =
    process.env.NEXT_PUBLIC_SKILL_BASE_URL ?? "http://localhost:9085/job";

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

/* ===================== HELPERS ===================== */

const buildSkillUrl = (path: string) =>
    `${SKILL_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

const buildHeaders = (
    options?: RequestOptions,
    path?: string
): HeadersInit => {
    const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };

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

/* ===================== MAIN REQUEST ===================== */

export const skillRequest = async <T>(
    path: string,
    options?: RequestOptions,
    isRetry = false
): Promise<ApiResponse<T>> => {
    const isPublic = isPublicEndpoint(path);

    const accessToken = isPublic
        ? null
        : options?.accessToken || getCurrentAccessToken();

    const response = await fetch(buildSkillUrl(path), {
        method: options?.method ?? "GET",
        headers: buildHeaders(
            { ...options, accessToken: accessToken || undefined },
            path
        ),
        body: options?.body ? JSON.stringify(options.body) : undefined,
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
            console.warn(
                `[SkillAPI] 401 detected on ${path}, attempting token refresh...`
            );

            const newAccessToken = await handle401WithTokenRefresh();

            if (newAccessToken) {
                return skillRequest<T>(
                    path,
                    { ...options, accessToken: newAccessToken },
                    true
                );
            }
        }

        throw error;
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
