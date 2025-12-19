import {
    getCurrentAccessToken,
    handle401WithTokenRefresh,
} from "./tokenRefreshHandler";
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

/**
 * Get notifications for the current user
 */
export const getNotifications = async (
    page: number = 0,
    size: number = 20
): Promise<ApiResponse<NotificationPage>> => {
    try {
        const token = getCurrentAccessToken();
        if (!token) {
            return { success: false, message: "No authentication token" };
        }

        const response = await fetch(
            `${NOTIFICATION_SERVICE_URL}?page=${page}&size=${size}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.status === 401) {
            return handle401WithTokenRefresh(() =>
                getNotifications(page, size)
            );
        }

        if (!response.ok) {
            const errorText = await response.text();
            return {
                success: false,
                message: errorText || "Failed to fetch notifications",
            };
        }

        const data: NotificationPage = await response.json();
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
        const token = getCurrentAccessToken();
        if (!token) {
            return { success: false, message: "No authentication token" };
        }

        const response = await fetch(
            `${NOTIFICATION_SERVICE_URL}/unread-count`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.status === 401) {
            return handle401WithTokenRefresh(() => getUnreadCount());
        }

        if (!response.ok) {
            const errorText = await response.text();
            return {
                success: false,
                message: errorText || "Failed to fetch unread count",
            };
        }

        const data: UnreadCountResponse = await response.json();
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
        const token = getCurrentAccessToken();
        if (!token) {
            return { success: false, message: "No authentication token" };
        }

        const response = await fetch(
            `${NOTIFICATION_SERVICE_URL}/${notificationId}/read`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.status === 401) {
            return handle401WithTokenRefresh(() => markAsRead(notificationId));
        }

        if (!response.ok) {
            const errorText = await response.text();
            return {
                success: false,
                message: errorText || "Failed to mark notification as read",
            };
        }

        const data: Notification = await response.json();
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
        const token = getCurrentAccessToken();
        if (!token) {
            return { success: false, message: "No authentication token" };
        }

        const response = await fetch(`${NOTIFICATION_SERVICE_URL}/read-all`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (response.status === 401) {
            return handle401WithTokenRefresh(() => markAllAsRead());
        }

        if (!response.ok) {
            const errorText = await response.text();
            return {
                success: false,
                message: errorText || "Failed to mark all notifications as read",
            };
        }

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
