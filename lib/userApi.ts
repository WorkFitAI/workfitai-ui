/**
 * User API client for admin user management
 * Uses the same authentication and error handling patterns as other API clients
 */

import {
    handle401WithTokenRefresh,
    getCurrentAccessToken,
} from "@/lib/tokenRefreshHandler";
import {
    UserListItem,
    UserSearchRequest,
    UserSearchResponse,
    UserSearchFilters,
    PageResponse,
    ResponseData,
    ReindexRequest,
    FullUserProfile,
} from "@/types/users";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9085";

const USER_API_URL = `${API_BASE_URL}/user`;

/**
 * Transform backend user response to frontend UserListItem format
 * Handles both formats: {userRole, userStatus} and {role, status}
 */
const transformUserResponse = (backendUser: any): UserListItem => {
    return {
        userId: backendUser.userId,
        username: backendUser.username,
        email: backendUser.email,
        fullName: backendUser.fullName,
        phoneNumber: backendUser.phoneNumber,
        avatarUrl: backendUser.avatarUrl,
        // Handle both backend formats
        role: backendUser.role || backendUser.userRole,
        status: backendUser.status || backendUser.userStatus,
        blocked: backendUser.blocked || false,
        deleted: backendUser.deleted || false,
        createdAt: backendUser.createdDate || backendUser.createdAt,
        updatedAt: backendUser.lastModifiedDate || backendUser.updatedAt,
        department: backendUser.department,
        address: backendUser.address,
        companyId: backendUser.companyId,
        companyNo: backendUser.companyNo,
        companyName: backendUser.companyName,
    };
};

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

/**
 * User Management API
 */
export const userApi = {
    /**
     * Get all users with basic filters (PostgreSQL)
     * Uses existing /admins/all-users endpoint
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
     * Get single user by username (changed from userId)
     */
    getUserByUsername: async (username: string): Promise<ResponseData<UserListItem>> => {
        const response = await apiRequest<ResponseData<any>>(
            `/admins/users/username/${username}`,
            { method: "GET" }
        );

        // Transform backend response to frontend format
        if (response.data) {
            response.data = transformUserResponse(response.data);
        }

        return response as ResponseData<UserListItem>;
    },

    /**
     * Get full user profile with role-specific details (using username)
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

    /**
     * Delete user by username (soft delete)
     */
    deleteUser: async (username: string): Promise<ResponseData<void>> => {
        return apiRequest<ResponseData<void>>(`/admins/users/username/${username}`, {
            method: "DELETE",
        });
    },

    /**
     * Advanced search using Elasticsearch
     * Provides full-text search, filters, aggregations
     */
    searchUsers: async (
        request: UserSearchRequest
    ): Promise<ResponseData<UserSearchResponse>> => {
        const response = await apiRequest<ResponseData<any>>(
            "/admins/users/search",
            {
                method: "POST",
                body: JSON.stringify(request),
            }
        );

        // Transform each user hit in the search results
        if (response.data?.hits) {
            response.data.hits = response.data.hits.map((hit: any) => ({
                ...transformUserResponse(hit),
                score: hit.score,
                highlights: hit.highlights || {},
            }));
        }

        return response as ResponseData<UserSearchResponse>;
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
            body: JSON.stringify(body),
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
