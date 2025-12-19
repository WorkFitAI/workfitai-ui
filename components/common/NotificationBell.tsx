"use client";

import React, { useState, useEffect } from "react";
import NotificationDropdown from "./NotificationDropdown";
import { useNotifications } from "@/hooks/useNotifications";

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
        // Refresh unread count when a notification is read
        refreshUnreadCount();
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div style={{ position: "relative" }}>
            <button
                onClick={toggleDropdown}
                style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    position: "relative",
                    padding: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                aria-label="Notifications"
                title={isWebSocketConnected ? "Real-time notifications enabled" : "Using polling mode"}
            >
                <i
                    className="fi-rr-bell"
                    style={{
                        fontSize: "1.25rem",
                        color: "#374151",
                    }}
                ></i>
                {mounted && unreadCount > 0 && (
                    <span
                        style={{
                            position: "absolute",
                            top: "0.25rem",
                            right: "0.25rem",
                            backgroundColor: "#ef4444",
                            color: "white",
                            borderRadius: "9999px",
                            padding: "0.125rem 0.375rem",
                            fontSize: "0.625rem",
                            fontWeight: 600,
                            minWidth: "1.25rem",
                            height: "1.25rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            lineHeight: 1,
                        }}
                    >
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
                {/* WebSocket connection indicator */}
                {mounted && isWebSocketConnected && (
                    <span
                        style={{
                            position: "absolute",
                            bottom: "0.25rem",
                            right: "0.25rem",
                            width: "0.5rem",
                            height: "0.5rem",
                            backgroundColor: "#10b981",
                            borderRadius: "9999px",
                            border: "2px solid white",
                        }}
                        title="Real-time connected"
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
