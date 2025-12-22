"use client";

import React, { useState, useEffect } from "react";
import NotificationDropdown from "./NotificationDropdown";
import { useNotifications } from "@/hooks/useNotifications";
import styles from "@/styles/NotificationBell.module.css";

const NotificationBell: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Use WebSocket-enabled notifications hook
    const {
        unreadCount,
        notifications,
        isWebSocketConnected,
        refreshUnreadCount,
        updateNotification,
    } = useNotifications();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleNotificationRead = () => {
        // No need to refresh - WebSocket will push unread count update automatically
        // Backend NotificationPersistenceService.markAsRead() already pushes update via WebSocket
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className={styles.bellContainer} >
            <button
                onClick={toggleDropdown}
                className={styles.bellButton}
                aria-label="Notifications"
                title={isWebSocketConnected ? "Real-time notifications enabled" : "Using polling mode"}
            >
                <i className={`fi-rr-bell ${styles.bellIcon}`}></i>
                {mounted && unreadCount > 0 && (
                    <span className={styles.badge}>
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
                {/* WebSocket connection indicator */}
                {mounted && (
                    <span
                        className={`${styles.connectionIndicator} ${!isWebSocketConnected ? styles.disconnected : ''}`}
                        title={isWebSocketConnected ? "Real-time connected" : "Polling mode"}
                    />
                )}
            </button>

            {mounted && (
                <NotificationDropdown
                    isOpen={isDropdownOpen}
                    onClose={() => setIsDropdownOpen(false)}
                    onNotificationRead={handleNotificationRead}
                    notifications={notifications}
                    updateNotification={updateNotification}
                />
            )}
        </div>
    );
};

export default NotificationBell;
