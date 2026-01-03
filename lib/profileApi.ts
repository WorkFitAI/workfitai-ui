import { userClient, authClient } from "@/lib/axios-client";
import type { AxiosError } from "axios";
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

// Generic request handler using axios clients
const profileRequest = async <T>(
    endpoint: string,
    options: { method?: string; body?: unknown } = {}
): Promise<ApiResponse<T>> => {
    // Route to correct client based on endpoint
    const client = endpoint.startsWith("/auth") ? authClient : userClient;
    const url = endpoint.replace(/^\/(auth|user)/, "");

    try {
        const response = await client.request<{ data?: T; message?: string }>({
            url,
            method: options.method || "GET",
            data: options.body,
        });

        return {
            status: "success",
            data: response.data?.data,
            message: response.data?.message,
        };
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;

        if (axiosError.response?.status === 401) {
            throw new UnauthorizedError("Session expired. Please login again.");
        }
        if (axiosError.response?.status === 403) {
            throw new ForbiddenError("You don't have permission to access this resource");
        }

        return {
            status: "error",
            message: axiosError.response?.data?.message || "Request failed",
        };
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
    const response = await profileRequest<UserProfile>("/profile/me");

    // Normalize API response fields
    if (response.status === "success" && response.data) {
        const profileData = response.data;

        // Fetch avatar URL if user is authenticated
        let avatarUrl: string | undefined = undefined;
        try {
            const avatarResponse = await profileRequest<{ avatarUrl?: string }>("/profile/avatar");
            if (avatarResponse.status === "success" && avatarResponse.data?.avatarUrl) {
                avatarUrl = avatarResponse.data.avatarUrl;
            }
        } catch (error) {
            console.warn("Failed to fetch avatar, using fallback:", error);
        }

        const normalizedProfile: UserProfile = {
            ...profileData,
            role: profileData.userRole || profileData.role,
            createdAt: profileData.createdDate || profileData.createdAt,
            updatedAt: profileData.lastModifiedDate || profileData.updatedAt,
            avatarUrl,
        };

        return {
            ...response,
            data: normalizedProfile,
        };
    }

    return response;
};

/**
 * Update profile based on user role
 */
export const updateProfile = async (
    data: UpdateProfileRequest,
    role: "CANDIDATE" | "HR" | "HR_MANAGER" | "ADMIN"
): Promise<ApiResponse<UserProfile>> => {
    let endpoint = "/profile/candidate";

    if (role === "HR" || role === "HR_MANAGER") {
        endpoint = "/profile/hr";
    } else if (role === "ADMIN") {
        endpoint = "/profile/admin";
    }

    return profileRequest<UserProfile>(endpoint, {
        method: "PUT",
        body: data,
    });
};

/**
 * Upload avatar
 * POST /user/profile/avatar
 */
export const uploadAvatar = async (file: File): Promise<ApiResponse<AvatarUploadResponse>> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await userClient.post<{ data?: AvatarUploadResponse; message?: string }>(
            "/profile/avatar",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return {
            status: "success",
            data: response.data?.data,
            message: response.data?.message,
        };
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        return {
            status: "error",
            message: axiosError.response?.data?.message || "Avatar upload failed",
        };
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
 * Get 2FA Status
 * GET /auth/2fa/status
 */
export const get2FAStatus = async (): Promise<ApiResponse<{
    enabled: boolean;
    method: 'TOTP' | 'EMAIL' | null;
    enabledAt: string | null;
}>> => {
    return profileRequest<{
        enabled: boolean;
        method: 'TOTP' | 'EMAIL' | null;
        enabledAt: string | null;
    }>("/auth/2fa/status", {
        method: "GET",
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
