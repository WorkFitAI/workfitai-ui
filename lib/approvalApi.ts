/**
 * HR Approval API client for admin and HR manager approval workflows
 * Uses axios client with interceptors for automatic token injection and 401 handling
 */

import { userClient } from "@/lib/axios-client";
import type { AxiosError } from "axios";

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
    highlights?: Record<string, string[]>;
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
 * Make authenticated API request using axios client
 */
const apiRequest = async <T>(
    endpoint: string,
    options: { method?: string; body?: unknown; headers?: Record<string, string> } = {}
): Promise<T> => {
    try {
        const response = await userClient.request<T>({
            url: endpoint,
            method: options.method || "GET",
            data: options.body,
            headers: options.headers,
        });

        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        throw new Error(
            axiosError.response?.data?.message ||
                axiosError.message ||
                `HTTP error! status: ${axiosError.response?.status}`
        );
    }
};

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
                body: searchRequest,
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
                body: searchRequest,
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
