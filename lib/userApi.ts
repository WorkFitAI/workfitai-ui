/**
 * User API client for admin user management
 * Uses axios client with interceptors for automatic token injection and 401 handling
 */

import { userClient } from "@/lib/axios-client";
import type { AxiosError } from "axios";
import {
    UserListItem,
    UserSearchRequest,
    UserSearchResponse,
    UserSearchFilters,
    PageResponse,
    ResponseData,
    ReindexRequest,
    FullUserProfile,
    UserRole,
    UserStatus,
    UserSearchHit,
} from "@/types/users";

/**
 * Transform backend user response to frontend UserListItem format
 * Handles both formats: {userRole, userStatus} and {role, status}
 */
const transformUserResponse = (backendUser: Record<string, unknown>): UserListItem => {
    return {
        userId: backendUser.userId as string,
        username: backendUser.username as string,
        email: backendUser.email as string,
        fullName: backendUser.fullName as string,
        phoneNumber: backendUser.phoneNumber as string,
        avatarUrl: backendUser.avatarUrl as string,
        role: ((backendUser.role || backendUser.userRole) as string) as UserRole,
        status: ((backendUser.status || backendUser.userStatus) as string) as UserStatus,
        blocked: (backendUser.blocked as boolean) || false,
        deleted: (backendUser.deleted as boolean) || false,
        createdAt: (backendUser.createdDate || backendUser.createdAt) as string,
        updatedAt: (backendUser.lastModifiedDate || backendUser.updatedAt) as string,
        department: backendUser.department as string,
        address: backendUser.address as string,
        companyId: backendUser.companyId as string,
        companyNo: backendUser.companyNo as string,
        companyName: backendUser.companyName as string,
    };
};

/**
 * Make authenticated API request using axios client
 */
const apiRequest = async <T>(
    endpoint: string,
    options: { method?: string; body?: unknown } = {}
): Promise<T> => {
    try {
        const response = await userClient.request<T>({
            url: endpoint,
            method: options.method || "GET",
            data: options.body,
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
 * User Management API
 */
export const userApi = {
    /**
     * Get all users with basic filters (PostgreSQL)
     */
    getAllUsers: async (params: {
        keyword?: string;
        role?: string;
        page?: number;
        size?: number;
    }): Promise<ResponseData<PageResponse<UserListItem>>> => {
        const queryParams = new URLSearchParams();
        if (params.keyword) queryParams.append("keyword", params.keyword);
        if (params.role) queryParams.append("role", params.role);
        if (params.page !== undefined) queryParams.append("page", params.page.toString());
        if (params.size !== undefined) queryParams.append("size", params.size.toString());

        const query = queryParams.toString();
        return apiRequest<ResponseData<PageResponse<UserListItem>>>(
            `/admins/all-users${query ? `?${query}` : ""}`,
            { method: "GET" }
        );
    },

    /**
     * Get single user by username
     */
    getUserByUsername: async (username: string): Promise<ResponseData<UserListItem>> => {
        const response = await apiRequest<ResponseData<Record<string, unknown>>>(
            `/admins/users/username/${username}`,
            { method: "GET" }
        );

        if (response.data) {
            response.data = transformUserResponse(response.data) as unknown as Record<string, unknown>;
        }

        return response as unknown as ResponseData<UserListItem>;
    },

    /**
     * Get full user profile with role-specific details
     */
    getFullUserProfile: async (
        username: string
    ): Promise<ResponseData<FullUserProfile>> => {
        return apiRequest<ResponseData<FullUserProfile>>(
            `/admins/users/${username}/full-profile`,
            { method: "GET" }
        );
    },

    /**
     * Block or unblock a user by username
     */
    blockUser: async (
        username: string,
        blocked: boolean
    ): Promise<ResponseData<void>> => {
        return apiRequest<ResponseData<void>>(
            `/admins/users/username/${username}/block?blocked=${blocked}`,
            { method: "PUT" }
        );
    },

    blockUserByHr: async (
        username: string,
        blocked: boolean
    ): Promise<ResponseData<void>> => {
        return apiRequest<ResponseData<void>>(
            `/hr/users/username/${username}/block?blocked=${blocked}`,
            { method: "PUT" }
        );
    },

    /**
     * Delete user by username (soft delete)
     */
    deleteUser: async (username: string): Promise<ResponseData<void>> => {
        return apiRequest<ResponseData<void>>(`/admins/users/username/${username}`, {
            method: "DELETE",
        });
    },

    deleteUserByHr: async (id: string): Promise<ResponseData<void>> => {
        return apiRequest<ResponseData<void>>(`/hr/${id}`, {
            method: "DELETE",
        });
    },

    /**
     * Advanced search using Elasticsearch
     */
    searchUsers: async (
        request: UserSearchRequest
    ): Promise<ResponseData<UserSearchResponse>> => {
        // Backend returns raw hits that need transformation
        interface RawSearchResponse {
            hits?: Array<Record<string, unknown> & { score?: number; highlights?: Record<string, string[]> }>;
            totalHits?: number;
            from?: number;
            size?: number;
            roleAggregations?: Record<string, number>;
            statusAggregations?: Record<string, number>;
        }

        const response = await apiRequest<ResponseData<RawSearchResponse>>(
            "/admins/users/search",
            {
                method: "POST",
                body: request,
            }
        );

        if (response.data?.hits) {
            const transformedHits: UserSearchHit[] = response.data.hits.map((hit) => ({
                ...transformUserResponse(hit),
                score: hit.score ?? 0,
                highlights: hit.highlights || {},
            }));

            return {
                ...response,
                data: {
                    ...response.data,
                    hits: transformedHits,
                } as UserSearchResponse,
            };
        }

        return response as unknown as ResponseData<UserSearchResponse>;
    },

    searchUsersByHr: async (
        request: UserSearchRequest
    ): Promise<ResponseData<UserSearchResponse>> => {
        // Backend returns raw hits that need transformation
        interface RawSearchResponse {
            hits?: Array<Record<string, unknown> & { score?: number; highlights?: Record<string, string[]> }>;
            totalHits?: number;
            from?: number;
            size?: number;
            roleAggregations?: Record<string, number>;
            statusAggregations?: Record<string, number>;
        }

        const response = await apiRequest<ResponseData<RawSearchResponse>>(
            "/hr/users/search",
            {
                method: "POST",
                body: request,
            }
        );

        if (response.data?.hits) {
            const transformedHits: UserSearchHit[] = response.data.hits.map((hit) => ({
                ...transformUserResponse(hit),
                score: hit.score ?? 0,
                highlights: hit.highlights || {},
            }));

            return {
                ...response,
                data: {
                    ...response.data,
                    hits: transformedHits,
                } as UserSearchResponse,
            };
        }

        return response as unknown as ResponseData<UserSearchResponse>;
    },

    /**
     * Trigger bulk reindex from PostgreSQL to Elasticsearch
     */
    triggerReindex: async (
        batchSize?: number
    ): Promise<ResponseData<string>> => {
        const body: ReindexRequest = batchSize ? { batchSize } : {};
        return apiRequest<ResponseData<string>>("/admins/users/reindex", {
            method: "POST",
            body,
        });
    },
};

/**
 * Helper function to build UserSearchRequest from filters
 */
export const buildSearchRequest = (
    filters: UserSearchFilters
): UserSearchRequest => {
    return {
        query: filters.query,
        role: filters.role,
        status: filters.status,
        blocked: filters.blocked,
        includeDeleted: filters.includeDeleted || false,
        companyNo: filters.companyNo,
        companyName: filters.companyName,
        createdAfter: filters.createdAfter,
        createdBefore: filters.createdBefore,
        from: (filters.page || 0) * (filters.size || 10),
        size: filters.size || 10,
        sortField: filters.sortField || "createdAt",
        sortOrder: filters.sortOrder || "desc",
        includeAggregations: true,
    };
};

/**
 * Helper function to format user role for display
 */
export const formatUserRole = (role: string): string => {
    const roleMap: Record<string, string> = {
        ADMIN: "Admin",
        HR_MANAGER: "HR Manager",
        HR: "HR",
        CANDIDATE: "Candidate",
    };
    return roleMap[role] || role;
};

/**
 * Helper function to format user status for display
 */
export const formatUserStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
        ACTIVE: "Active",
        SUSPENDED: "Suspended",
        DELETED: "Deleted",
        PENDING: "Pending",
    };
    return statusMap[status] || status;
};

/**
 * Helper function to get status badge color
 */
export const getStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
        ACTIVE: "success",
        SUSPENDED: "warning",
        DELETED: "danger",
        PENDING: "secondary",
    };
    return colorMap[status] || "secondary";
};

/**
 * Helper function to get role badge color
 */
export const getRoleColor = (role: string): string => {
    const colorMap: Record<string, string> = {
        ADMIN: "danger",
        HR_MANAGER: "primary",
        HR: "info",
        CANDIDATE: "secondary",
    };
    return colorMap[role] || "secondary";
};
