import {
    getCurrentAccessToken,
    handle401WithTokenRefresh,
} from "./tokenRefreshHandler";
import { shouldAttemptRefresh, isPublicEndpoint } from "./endpointUtils";
import type {
    Notification,
    NotificationPage,
    UnreadCountResponse,
} from "@/types/notification";

const NOTIFICATION_SERVICE_URL = process.env.NEXT_PUBLIC_NOTIFICATION_BASE_URL || "http://localhost:9085/notification";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

// Generic request wrapper with automatic token refresh on 401
async function notificationRequest<T>(
    path: string,
    options: RequestInit = {},
    isRetry = false
): Promise<T> {
    // Check if endpoint is public
    const isPublic = isPublicEndpoint(path);

    // Only get access token for protected endpoints
    const accessToken = isPublic ? null : getCurrentAccessToken();

    const headers: HeadersInit = {
        ...(options.body instanceof FormData
            ? {}
            : { "Content-Type": "application/json" }),
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
    };

    const response = await fetch(`${NOTIFICATION_SERVICE_URL}${path}`, {
        ...options,
        headers,
        credentials: "include",
    });

    if (!response.ok) {
        console.log(
            `[NotificationAPI] Request to ${path} failed with status ${response.status}`
        );
        const error = await response
            .json()
            .catch(() => ({ message: "Request failed" }));

        // On 401, check if we should attempt refresh
        // Skip refresh for retry loops
        if (response.status === 401 && !isRetry && shouldAttemptRefresh(path)) {
            console.log(
                `[NotificationAPI] 401 detected on ${path}, attempting token refresh...`
            );

            // Attempt to refresh the token using centralized queue
            const newAccessToken = await handle401WithTokenRefresh();

            if (newAccessToken) {
                console.log(`[NotificationAPI] Token refreshed, retrying ${path}...`);
                // Retry the original request with the new token
                const retryHeaders: HeadersInit = {
                    ...(options.body instanceof FormData
                        ? {}
                        : { "Content-Type": "application/json" }),
                    Authorization: `Bearer ${newAccessToken}`,
                    ...options.headers,
                };

                return notificationRequest<T>(
                    path,
                    {
                        ...options,
                        headers: retryHeaders,
                    },
                    true // Mark as retry to prevent infinite loops
                );
            } else {
                console.error(`[NotificationAPI] Token refresh failed for ${path}`);
            }
        }

        throw new Error(error.message || `HTTP ${response.status}`);
    }

    if (response.status === 204) {
        return null as T;
    }

    const data = await response.json();
    return data.data || data;
}

/**
 * Get notifications for the current user
 */
export const getNotifications = async (
    page: number = 0,
    size: number = 20
): Promise<ApiResponse<NotificationPage>> => {
    try {
        const data = await notificationRequest<NotificationPage>(
            `?page=${page}&size=${size}`,
            { method: "GET" }
        );
        return { success: true, data };
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return {
            success: false,
            message:
                error instanceof Error ? error.message : "An error occurred",
        };
    }
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (): Promise<
    ApiResponse<UnreadCountResponse>
> => {
    try {
        const data = await notificationRequest<UnreadCountResponse>(
            "/unread-count",
            { method: "GET" }
        );
        return { success: true, data };
    } catch (error) {
        console.error("Error fetching unread count:", error);
        return {
            success: false,
            message:
                error instanceof Error ? error.message : "An error occurred",
        };
    }
};

/**
 * Mark a notification as read
 */
export const markAsRead = async (
    notificationId: string
): Promise<ApiResponse<Notification>> => {
    try {
        const data = await notificationRequest<Notification>(
            `/${notificationId}/read`,
            { method: "PUT" }
        );
        return { success: true, data };
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return {
            success: false,
            message:
                error instanceof Error ? error.message : "An error occurred",
        };
    }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (): Promise<ApiResponse<void>> => {
    try {
        await notificationRequest<void>(
            "/read-all",
            { method: "PUT" }
        );
        return { success: true };
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        return {
            success: false,
            message:
                error instanceof Error ? error.message : "An error occurred",
        };
    }
};
