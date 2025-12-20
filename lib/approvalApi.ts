/**
 * HR Approval API client for admin and HR manager approval workflows
 */

import {
    handle401WithTokenRefresh,
    getCurrentAccessToken,
} from "@/lib/tokenRefreshHandler";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9085";

const USER_API_URL = `${API_BASE_URL}/user`;

/**
 * Make authenticated API request
 */
const apiRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> => {
    const accessToken = getCurrentAccessToken();

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    const response = await fetch(`${USER_API_URL}${endpoint}`, config);

    // Handle 401 Unauthorized - attempt token refresh
    if (response.status === 401) {
        const refreshed = await handle401WithTokenRefresh();
        if (refreshed) {
            // Retry request with new token
            const newToken = getCurrentAccessToken();
            if (newToken) {
                headers["Authorization"] = `Bearer ${newToken}`;
                const retryResponse = await fetch(`${USER_API_URL}${endpoint}`, {
                    ...config,
                    headers,
                });
                if (!retryResponse.ok) {
                    throw new Error(`HTTP error! status: ${retryResponse.status}`);
                }
                return retryResponse.json();
            }
        }
        throw new Error("Unauthorized - please login again");
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
        );
    }

    return response.json();
};

export interface HRApprovalUser {
    userId: string;
    username: string;
    email: string;
    fullName?: string;
    phoneNumber?: string;
    avatarUrl?: string;
    role: "HR_MANAGER" | "HR";
    status: "WAIT_APPROVED" | "ACTIVE" | "PENDING";
    blocked: boolean;
    deleted: boolean;
    department?: string;
    companyId?: string;
    companyName?: string;
    companyNo?: string;
    createdAt: string;
    updatedAt?: string;
    score?: string;
    highlights?: Record<string, any>;
}

export interface SearchResponse<T> {
    hits: T[];
    totalHits: number;
    from: number;
    size: number;
    roleAggregations?: Record<string, number>;
    statusAggregations?: Record<string, number>;
}

export interface SearchRequest {
    query?: string;
    role?: string;
    status?: string;
    blocked?: boolean;
    includeDeleted?: boolean;
    from?: number;
    size?: number;
    sortField?: string;
    sortOrder?: string;
    includeAggregations?: boolean;
}

export interface ResponseData<T> {
    status: number;
    message?: string;
    data?: T;
    error?: string;
    timestamp?: string;
    source?: string;
}

/**
 * HR Approval API
 */
export const approvalApi = {
    /**
     * Get all pending HR Managers (for Admin approval)
     */
    getPendingHRManagers: async (params: {
        keyword?: string;
        page?: number;
        size?: number;
        status?: string;
        role?: string;
    }): Promise<ResponseData<SearchResponse<HRApprovalUser>>> => {
        const searchRequest: SearchRequest = {
            query: params.keyword || "",
            role: params.role || "HR_MANAGER",
            status: params.status || "WAIT_APPROVED",
            blocked: false,
            includeDeleted: false,
            from: params.page || 0,
            size: params.size || 20,
            sortField: "createdAt",
            sortOrder: "desc",
            includeAggregations: true,
        };

        return apiRequest<ResponseData<SearchResponse<HRApprovalUser>>>(
            `/admins/users/search`,
            {
                method: "POST",
                body: JSON.stringify(searchRequest),
            }
        );
    },

    /**
     * Get all pending HR staff (for HR Manager approval - same company)
     */
    getPendingHRStaff: async (params: {
        keyword?: string;
        page?: number;
        size?: number;
        status?: string;
        role?: string;
    }): Promise<ResponseData<SearchResponse<HRApprovalUser>>> => {
        const searchRequest: SearchRequest = {
            query: params.keyword || "",
            role: params.role || "HR",
            status: params.status || "WAIT_APPROVED",
            blocked: false,
            includeDeleted: false,
            from: params.page || 0,
            size: params.size || 20,
            sortField: "createdAt",
            sortOrder: "desc",
            includeAggregations: true,
        };

        return apiRequest<ResponseData<SearchResponse<HRApprovalUser>>>(
            `/hr/users/search`,
            {
                method: "POST",
                body: JSON.stringify(searchRequest),
            }
        );
    },

    /**
     * Admin approves HR Manager
     */
    approveHRManager: async (
        username: string,
        approverId?: string
    ): Promise<ResponseData<HRApprovalUser>> => {
        const headers: Record<string, string> = {};
        if (approverId) {
            headers["X-Approver-Id"] = approverId;
        }

        return apiRequest<ResponseData<HRApprovalUser>>(
            `/hr/username/${username}/approve-manager`,
            {
                method: "POST",
                headers,
            }
        );
    },

    /**
     * HR Manager approves HR staff (same company)
     */
    approveHRStaff: async (
        username: string,
        approverId?: string
    ): Promise<ResponseData<HRApprovalUser>> => {
        const headers: Record<string, string> = {};
        if (approverId) {
            headers["X-Approver-Id"] = approverId;
        }

        return apiRequest<ResponseData<HRApprovalUser>>(
            `/hr/username/${username}/approve`,
            {
                method: "POST",
                headers,
            }
        );
    },

    /**
     * Get HR details by ID
     */
    getHRById: async (userId: string): Promise<ResponseData<HRApprovalUser>> => {
        return apiRequest<ResponseData<HRApprovalUser>>(`/hr/${userId}`, {
            method: "GET",
        });
    },
};
