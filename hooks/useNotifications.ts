"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useWebSocket } from "./useWebSocket";
import {
    getNotifications as fetchNotifications,
    getUnreadCount as fetchUnreadCount,
} from "@/lib/notificationApi";
import type { Notification } from "@/types/notification";

interface UseNotificationsReturn {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    isWebSocketConnected: boolean;
    loadNotifications: (page?: number, size?: number) => Promise<void>;
    refreshUnreadCount: () => Promise<void>;
    addNotification: (notification: Notification) => void;
    updateNotification: (id: string, updates: Partial<Notification>) => void;
}

/**
 * Unified notifications hook that combines WebSocket real-time updates with REST API
 * Provides automatic fallback to polling if WebSocket is unavailable
 */
export function useNotifications(): UseNotificationsReturn {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const hasWebSocketReceivedDataRef = useRef(false);

    // Only initialize WebSocket on client side
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // WebSocket connection (only on client side)
    const { subscribe, unsubscribe, isConnected } = useWebSocket({
        autoConnect: isMounted, // Only auto-connect after component mounts
        onConnect: () => {
            console.log("[useNotifications] WebSocket connected, stopping polling");
            stopPolling();

            // Subscribe to notification streams
            subscribe("/user/queue/notifications", handleNewNotification);
            subscribe("/user/queue/unread-count", handleUnreadCountUpdate);

            // Fetch initial data
            loadNotifications();
            refreshUnreadCount();
        },
        onDisconnect: () => {
            console.log("[useNotifications] WebSocket disconnected, starting fallback polling");
            startPolling();
        },
        onError: () => {
            console.log("[useNotifications] WebSocket error, starting fallback polling");
            startPolling();
        },
    });

    /**
     * Handle incoming notification via WebSocket
     */
    const handleNewNotification = useCallback((notification: Notification) => {
        console.log("[useNotifications] Received new notification via WebSocket:", notification);
        hasWebSocketReceivedDataRef.current = true;

        setNotifications((prev) => {
            // Avoid duplicates
            if (prev.some((n) => n.id === notification.id)) {
                return prev;
            }
            return [notification, ...prev];
        });

        // Update unread count if notification is unread
        if (!notification.read) {
            setUnreadCount((prev) => prev + 1);
        }

        // Show browser notification if permission granted
        if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            new Notification(notification.title || "New Notification", {
                body: notification.message,
                icon: "/favicon.ico",
                tag: notification.id,
            });
        }
    }, []);

    /**
     * Handle unread count update via WebSocket
     */
    const handleUnreadCountUpdate = useCallback((data: { count: number }) => {
        console.log("[useNotifications] Received unread count update via WebSocket:", data.count);
        hasWebSocketReceivedDataRef.current = true;
        setUnreadCount(data.count);
    }, []);

    /**
     * Load notifications from REST API
     */
    const loadNotifications = useCallback(async (page: number = 0, size: number = 20) => {
        setIsLoading(true);
        try {
            const response = await fetchNotifications(page, size);
            if (response.success && response.data) {
                setNotifications(response.data.content);
            }
        } catch (error) {
            console.error("[useNotifications] Error loading notifications:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Refresh unread count from REST API
     */
    const refreshUnreadCount = useCallback(async () => {
        try {
            const response = await fetchUnreadCount();
            if (response.success && response.data) {
                setUnreadCount(response.data.count);
            }
        } catch (error) {
            console.error("[useNotifications] Error fetching unread count:", error);
        }
    }, []);

    /**
     * Manually add notification (useful for optimistic updates)
     */
    const addNotification = useCallback((notification: Notification) => {
        setNotifications((prev) => {
            if (prev.some((n) => n.id === notification.id)) {
                return prev;
            }
            return [notification, ...prev];
        });
        if (!notification.read) {
            setUnreadCount((prev) => prev + 1);
        }
    }, []);

    /**
     * Update notification (e.g., mark as read)
     */
    const updateNotification = useCallback((id: string, updates: Partial<Notification>) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
        );

        // If marking as read, decrement unread count
        if (updates.read === true) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
        }
    }, []);

    /**
     * Start polling fallback (when WebSocket is unavailable)
     */
    const startPolling = useCallback(() => {
        if (pollingIntervalRef.current) {
            return; // Already polling
        }

        console.log("[useNotifications] Starting polling fallback (30s interval)");

        // Immediate fetch
        refreshUnreadCount();

        // Poll every 30 seconds
        pollingIntervalRef.current = setInterval(() => {
            if (!isConnected && !hasWebSocketReceivedDataRef.current) {
                console.log("[useNotifications] Polling for unread count...");
                refreshUnreadCount();
            }
        }, 30000);
    }, [isConnected, refreshUnreadCount]);

    /**
     * Stop polling (when WebSocket is available)
     */
    const stopPolling = useCallback(() => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
            console.log("[useNotifications] Stopped polling");
        }
    }, []);

    // Request browser notification permission on mount
    useEffect(() => {
        if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
            Notification.requestPermission().then((permission) => {
                console.log("[useNotifications] Notification permission:", permission);
            });
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopPolling();
            unsubscribe("/user/queue/notifications");
            unsubscribe("/user/queue/unread-count");
        };
    }, [stopPolling, unsubscribe]);

    return {
        notifications,
        unreadCount,
        isLoading,
        isWebSocketConnected: isConnected,
        loadNotifications,
        refreshUnreadCount,
        addNotification,
        updateNotification,
    };
}
