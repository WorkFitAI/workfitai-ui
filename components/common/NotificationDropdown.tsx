"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Notification } from "@/types/notification";
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
} from "@/lib/notificationApi";

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    onNotificationRead: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
    isOpen,
    onClose,
    onNotificationRead,
}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await getNotifications(0, 10);
            if (response.success && response.data) {
                setNotifications(response.data.content);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        // Mark as read if not already read
        if (!notification.read) {
            const response = await markAsRead(notification.id);
            if (response.success) {
                setNotifications((prev) =>
                    prev.map((n) =>
                        n.id === notification.id ? { ...n, read: true } : n
                    )
                );
                onNotificationRead();
            }
        }

        // Navigate to action URL if available
        if (notification.actionUrl) {
            router.push(notification.actionUrl);
            onClose();
        }
    };

    const handleMarkAllAsRead = async () => {
        const response = await markAllAsRead();
        if (response.success) {
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, read: true }))
            );
            onNotificationRead();
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "application_submitted":
            case "application_status_changed":
                return "fi-rr-document";
            case "application_accepted":
                return "fi-rr-check-circle";
            case "application_rejected":
                return "fi-rr-cross-circle";
            case "account_approved":
            case "account_activated":
                return "fi-rr-user-check";
            case "job_posted":
            case "job_matching":
                return "fi-rr-briefcase";
            case "new_applicant":
                return "fi-rr-users-alt";
            case "cv_viewed":
            case "cv_downloaded":
                return "fi-rr-eye";
            case "system_announcement":
                return "fi-rr-megaphone";
            default:
                return "fi-rr-bell";
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return "just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        const weeks = Math.floor(days / 7);
        if (weeks < 4) return `${weeks}w ago`;
        const months = Math.floor(days / 30);
        return `${months}mo ago`;
    };

    if (!isOpen) return null;

    return (
        <div
            ref={dropdownRef}
            className="notification-dropdown"
            style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "0.5rem",
                width: "400px",
                maxHeight: "600px",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                zIndex: 1000,
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: "1rem",
                    borderBottom: "1px solid #e5e7eb",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h5 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>
                    Notifications
                </h5>
                {notifications.some((n) => !n.read) && (
                    <button
                        onClick={handleMarkAllAsRead}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#3b82f6",
                            fontSize: "0.875rem",
                            cursor: "pointer",
                            padding: 0,
                        }}
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Notification List */}
            <div
                style={{
                    maxHeight: "500px",
                    overflowY: "auto",
                }}
            >
                {loading ? (
                    <div
                        style={{
                            padding: "2rem",
                            textAlign: "center",
                            color: "#6b7280",
                        }}
                    >
                        Loading...
                    </div>
                ) : notifications.length === 0 ? (
                    <div
                        style={{
                            padding: "2rem",
                            textAlign: "center",
                            color: "#6b7280",
                        }}
                    >
                        <i
                            className="fi-rr-bell-slash"
                            style={{ fontSize: "2rem", marginBottom: "0.5rem" }}
                        ></i>
                        <p style={{ margin: 0 }}>No notifications</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            style={{
                                padding: "1rem",
                                borderBottom: "1px solid #f3f4f6",
                                cursor: notification.actionUrl
                                    ? "pointer"
                                    : "default",
                                backgroundColor: notification.read
                                    ? "white"
                                    : "#eff6ff",
                                transition: "background-color 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                if (notification.actionUrl) {
                                    e.currentTarget.style.backgroundColor =
                                        "#f9fafb";
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    notification.read ? "white" : "#eff6ff";
                            }}
                        >
                            <div style={{ display: "flex", gap: "0.75rem" }}>
                                <div
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        backgroundColor: notification.read
                                            ? "#f3f4f6"
                                            : "#dbeafe",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    <i
                                        className={getNotificationIcon(
                                            notification.type
                                        )}
                                        style={{
                                            fontSize: "1.25rem",
                                            color: notification.read
                                                ? "#6b7280"
                                                : "#3b82f6",
                                        }}
                                    ></i>
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "start",
                                            marginBottom: "0.25rem",
                                        }}
                                    >
                                        <h6
                                            style={{
                                                margin: 0,
                                                fontSize: "0.875rem",
                                                fontWeight: notification.read
                                                    ? 500
                                                    : 600,
                                                color: "#111827",
                                            }}
                                        >
                                            {notification.title}
                                        </h6>
                                        {!notification.read && (
                                            <div
                                                style={{
                                                    width: "8px",
                                                    height: "8px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "#3b82f6",
                                                    flexShrink: 0,
                                                    marginLeft: "0.5rem",
                                                }}
                                            ></div>
                                        )}
                                    </div>
                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize: "0.8125rem",
                                            color: "#6b7280",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                        }}
                                    >
                                        {notification.message}
                                    </p>
                                    <p
                                        style={{
                                            margin: "0.25rem 0 0 0",
                                            fontSize: "0.75rem",
                                            color: "#9ca3af",
                                        }}
                                    >
                                        {formatTimeAgo(notification.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div
                    style={{
                        padding: "0.75rem",
                        borderTop: "1px solid #e5e7eb",
                        textAlign: "center",
                    }}
                >
                    <button
                        onClick={() => {
                            router.push("/notifications");
                            onClose();
                        }}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#3b82f6",
                            fontSize: "0.875rem",
                            cursor: "pointer",
                            fontWeight: 500,
                        }}
                    >
                        View all notifications
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
