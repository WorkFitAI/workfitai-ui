import { notificationClient } from "@/lib/axios-client";
import type { AxiosError } from "axios";
import type {
    Notification,
    NotificationPage,
    UnreadCountResponse,
} from "@/types/notification";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

// Generic request wrapper using axios client
async function notificationRequest<T>(
    path: string,
    options: { method?: string; body?: unknown } = {}
): Promise<T> {
    try {
        const response = await notificationClient.request<{ data?: T } | T>({
            url: path,
            method: options.method || "GET",
            data: options.body,
        });

        // Handle 204 No Content
        if (response.status === 204) {
            return null as T;
        }

        const responseData = response.data;
        // Unwrap data if nested
        if (responseData && typeof responseData === "object" && "data" in responseData) {
            return (responseData as { data: T }).data;
        }
        return responseData as T;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        throw new Error(
            axiosError.response?.data?.message ||
                axiosError.message ||
                "Request failed"
        );
    }
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
            `?page=${page}&size=${size}`
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
            "/unread-count"
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
