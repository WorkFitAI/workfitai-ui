import {
    handle401WithTokenRefresh,
    getCurrentAccessToken,
} from "@/lib/tokenRefreshHandler";
import { isPublicEndpoint, shouldAttemptRefresh } from "@/lib/endpointUtils";
import type {
    UserProfile,
    AvatarUploadResponse,
    AvatarInfo,
    UpdateProfileRequest,
    DeactivateAccountRequest,
    DeactivateAccountResponse,
    DeleteAccountRequest,
    DeleteAccountResponse,
} from "@/types/profile";
import type {
    NotificationSettings,
    PrivacySettings,
    ChangePasswordRequest,
    ChangePasswordResponse,
    Enable2FARequest,
    Enable2FAResponse,
    Disable2FARequest,
    RegenerateBackupCodesRequest,
    RegenerateBackupCodesResponse,
    SessionsResponse,
    LogoutSessionResponse,
    LogoutAllSessionsResponse,
} from "@/types/settings";

export class UnauthorizedError extends Error {
    constructor(message = "Unauthorized") {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export class ForbiddenError extends Error {
    constructor(message = "Forbidden") {
        super(message);
        this.name = "ForbiddenError";
    }
}

export interface ApiResponse<T = unknown> {
    data?: T;
    message?: string;
    status: "success" | "error";
}

interface RequestOptions {
    body?: unknown;
    accessToken?: string;
}

const USER_API_URL =
    process.env.NEXT_PUBLIC_USER_BASE_URL || "http://localhost:9085/user";

const AUTH_API_URL =
    process.env.NEXT_PUBLIC_AUTH_BASE_URL || "http://localhost:9085/auth";

// Generic request handler
const profileRequest = async <T>(
    endpoint: string,
    options: RequestOptions & { method?: string } = {},
    isRetry = false
): Promise<ApiResponse<T>> => {
    const isPublic = isPublicEndpoint(endpoint);
    const accessToken = options.accessToken || (!isPublic ? getCurrentAccessToken() : null);

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const requestOptions: RequestInit = {
        method: options.method || "GET",
        headers,
        credentials: "include",
    };

    if (options.body) {
        requestOptions.body = JSON.stringify(options.body);
    }

    const baseUrl = endpoint.startsWith("/auth") ? AUTH_API_URL : USER_API_URL;
    const url = `${baseUrl}${endpoint}`;

    try {
        const response = await fetch(url, requestOptions);

        if (response.status === 401 && !isPublic && !isRetry && shouldAttemptRefresh(endpoint)) {
            try {
                await handle401WithTokenRefresh();
                return profileRequest<T>(endpoint, options, true);
            } catch (refreshError) {
                throw new UnauthorizedError("Session expired. Please login again.");
            }
        }

        if (response.status === 403) {
            throw new ForbiddenError("You don't have permission to access this resource");
        }

        const responseData = await response.json();

        if (!response.ok) {
            return {
                status: "error",
                message: responseData.message || `Request failed with status ${response.status}`,
            };
        }

        return {
            status: "success",
            data: responseData.data,
            message: responseData.message,
        };
    } catch (error) {
        if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
            throw error;
        }

        console.error("Profile API request failed:", error);
        throw error;
    }
};

// =============================================================================
// PROFILE ENDPOINTS
// =============================================================================

/**
 * Get current user profile
 * GET /user/profile/me
 */
export const getCurrentProfile = async (): Promise<ApiResponse<UserProfile>> => {
    return profileRequest<UserProfile>("/profile/me");
};

/**
 * Update profile
 * PUT /user/profile (assuming this endpoint exists)
 */
export const updateProfile = async (
    data: UpdateProfileRequest
): Promise<ApiResponse<UserProfile>> => {
    return profileRequest<UserProfile>("/profile", {
        method: "PUT",
        body: data,
    });
};

/**
 * Upload avatar
 * POST /user/profile/avatar
 */
export const uploadAvatar = async (file: File): Promise<ApiResponse<AvatarUploadResponse>> => {
    const accessToken = getCurrentAccessToken();

    const formData = new FormData();
    formData.append("file", file);

    const headers: HeadersInit = {};
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    try {
        const response = await fetch(`${USER_API_URL}/profile/avatar`, {
            method: "POST",
            headers,
            body: formData,
            credentials: "include",
        });

        const responseData = await response.json();

        if (!response.ok) {
            return {
                status: "error",
                message: responseData.message || "Avatar upload failed",
            };
        }

        return {
            status: "success",
            data: responseData.data,
            message: responseData.message,
        };
    } catch (error) {
        console.error("Avatar upload failed:", error);
        throw error;
    }
};

/**
 * Get avatar info
 * GET /user/profile/avatar
 */
export const getAvatar = async (): Promise<ApiResponse<AvatarInfo>> => {
    return profileRequest<AvatarInfo>("/profile/avatar");
};

/**
 * Delete avatar
 * DELETE /user/profile/avatar
 */
export const deleteAvatar = async (): Promise<ApiResponse<{ message: string }>> => {
    return profileRequest<{ message: string }>("/profile/avatar", {
        method: "DELETE",
    });
};

/**
 * Deactivate account
 * POST /user/profile/deactivate
 */
export const deactivateAccount = async (
    data: DeactivateAccountRequest
): Promise<ApiResponse<DeactivateAccountResponse>> => {
    return profileRequest<DeactivateAccountResponse>("/profile/deactivate", {
        method: "POST",
        body: data,
    });
};

/**
 * Request account deletion
 * POST /user/profile/delete-request
 */
export const requestAccountDeletion = async (
    data: DeleteAccountRequest
): Promise<ApiResponse<DeleteAccountResponse>> => {
    return profileRequest<DeleteAccountResponse>("/profile/delete-request", {
        method: "POST",
        body: data,
    });
};

// =============================================================================
// NOTIFICATION SETTINGS ENDPOINTS
// =============================================================================

/**
 * Get notification settings
 * GET /user/profile/notification-settings
 */
export const getNotificationSettings = async (): Promise<
    ApiResponse<NotificationSettings>
> => {
    return profileRequest<NotificationSettings>("/profile/notification-settings");
};

/**
 * Update notification settings
 * PUT /user/profile/notification-settings
 */
export const updateNotificationSettings = async (
    settings: NotificationSettings
): Promise<ApiResponse<NotificationSettings>> => {
    return profileRequest<NotificationSettings>("/profile/notification-settings", {
        method: "PUT",
        body: settings,
    });
};

// =============================================================================
// PRIVACY SETTINGS ENDPOINTS
// =============================================================================

/**
 * Get privacy settings
 * GET /user/profile/privacy-settings
 */
export const getPrivacySettings = async (): Promise<ApiResponse<PrivacySettings>> => {
    return profileRequest<PrivacySettings>("/profile/privacy-settings");
};

/**
 * Update privacy settings
 * PUT /user/profile/privacy-settings
 */
export const updatePrivacySettings = async (
    settings: PrivacySettings
): Promise<ApiResponse<PrivacySettings>> => {
    return profileRequest<PrivacySettings>("/profile/privacy-settings", {
        method: "PUT",
        body: settings,
    });
};

// =============================================================================
// SECURITY ENDPOINTS (AUTH SERVICE)
// =============================================================================

/**
 * Change password
 * POST /auth/change-password
 */
export const changePassword = async (
    data: ChangePasswordRequest
): Promise<ApiResponse<ChangePasswordResponse>> => {
    return profileRequest<ChangePasswordResponse>("/auth/change-password", {
        method: "POST",
        body: data,
    });
};

/**
 * Enable 2FA
 * POST /auth/enable-2fa
 */
export const enable2FA = async (
    data: Enable2FARequest
): Promise<ApiResponse<Enable2FAResponse>> => {
    return profileRequest<Enable2FAResponse>("/auth/enable-2fa", {
        method: "POST",
        body: data,
    });
};

/**
 * Disable 2FA
 * POST /auth/disable-2fa
 */
export const disable2FA = async (
    data: Disable2FARequest
): Promise<ApiResponse<{ message: string; twoFactorEnabled: boolean }>> => {
    return profileRequest<{ message: string; twoFactorEnabled: boolean }>(
        "/auth/disable-2fa",
        {
            method: "POST",
            body: data,
        }
    );
};

/**
 * Regenerate backup codes
 * POST /auth/regenerate-backup-codes
 */
export const regenerateBackupCodes = async (
    data: RegenerateBackupCodesRequest
): Promise<ApiResponse<RegenerateBackupCodesResponse>> => {
    return profileRequest<RegenerateBackupCodesResponse>("/auth/regenerate-backup-codes", {
        method: "POST",
        body: data,
    });
};

/**
 * Get active sessions
 * GET /auth/sessions
 */
export const getActiveSessions = async (): Promise<ApiResponse<SessionsResponse>> => {
    return profileRequest<SessionsResponse>("/auth/sessions");
};

/**
 * Logout specific session
 * DELETE /auth/sessions/{sessionId}
 */
export const logoutSession = async (
    sessionId: string
): Promise<ApiResponse<LogoutSessionResponse>> => {
    return profileRequest<LogoutSessionResponse>(`/auth/sessions/${sessionId}`, {
        method: "DELETE",
    });
};

/**
 * Logout all other sessions
 * DELETE /auth/sessions/all
 */
export const logoutAllOtherSessions = async (): Promise<
    ApiResponse<LogoutAllSessionsResponse>
> => {
    return profileRequest<LogoutAllSessionsResponse>("/auth/sessions/all", {
        method: "DELETE",
    });
};
