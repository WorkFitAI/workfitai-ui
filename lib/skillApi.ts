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

const buildSkillUrl = (path: string) =>
    `${SKILL_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

const buildHeaders = (options?: RequestOptions): HeadersInit => {
    const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };

    if (options?.accessToken) {
        headers["Authorization"] = `Bearer ${options.accessToken}`;
    }

    return headers;
};

const parseErrors = (errors: unknown): string[] => {
    if (!errors) return [];
    if (Array.isArray(errors)) return errors.map((e) => String(e));
    return [String(errors)];
};

const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
    const isJson = response.headers.get("content-type")?.includes("application/json");
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
export const skillRequest = async <T>(
    path: string,
    options?: RequestOptions
): Promise<ApiResponse<T>> => {
    const response = await fetch(buildSkillUrl(path), {
        method: options?.method ?? "GET",
        headers: buildHeaders(options),
        body: options?.body ? JSON.stringify(options.body) : undefined,
        credentials: "include",
    });

    return handleResponse<T>(response);
};

// SHORTCUT FUNCTIONS
export const getSkills = async <T>(path: string, options?: RequestOptions) =>
    skillRequest<T>(path, { ...options, method: "GET" });

export const postSkill = async <T>(path: string, options?: RequestOptions) =>
    skillRequest<T>(path, { ...options, method: "POST" });

export const putSkill = async <T>(path: string, options?: RequestOptions) =>
    skillRequest<T>(path, { ...options, method: "PUT" });

export const deleteSkill = async <T>(path: string, options?: RequestOptions) =>
    skillRequest<T>(path, { ...options, method: "DELETE" });
