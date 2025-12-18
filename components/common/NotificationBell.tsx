"use client";

import React, { useState, useEffect } from "react";
import NotificationDropdown from "./NotificationDropdown";
import { getUnreadCount } from "@/lib/notificationApi";

const NotificationBell: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchUnreadCount();

        // Poll for unread count every 30 seconds
        const interval = setInterval(() => {
            fetchUnreadCount();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const response = await getUnreadCount();
            if (response.success && response.data) {
                setUnreadCount(response.data.count);
            }
        } catch (error) {
            console.error("Error fetching unread count:", error);
        }
    };

    const handleNotificationRead = () => {
        // Refresh unread count when a notification is read
        fetchUnreadCount();
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    if (!mounted) {
        return null;
    }

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
            >
                <i
                    className="fi-rr-bell"
                    style={{
                        fontSize: "1.25rem",
                        color: "#374151",
                    }}
                ></i>
                {unreadCount > 0 && (
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
            </button>

            <NotificationDropdown
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                onNotificationRead={handleNotificationRead}
            />
        </div>
    );
};

export default NotificationBell;
