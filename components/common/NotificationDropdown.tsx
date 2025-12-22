"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Notification } from "@/types/notification";
import { markAsRead, markAllAsRead } from "@/lib/notificationApi";
import styles from "@/styles/NotificationDropdown.module.css";

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    onNotificationRead: () => void;
    notifications: Notification[];
    updateNotification: (id: string, updates: Partial<Notification>) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
    isOpen,
    onClose,
    onNotificationRead,
    notifications: initialNotifications,
    updateNotification,
}) => {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Update local state when parent notifications change
    useEffect(() => {
        setNotifications(initialNotifications);
    }, [initialNotifications]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

    const handleNotificationClick = async (notification: Notification) => {
        // Mark as read if not already read
        if (!notification.read) {
            const response = await markAsRead(notification.id);
            if (response.success) {
                // Update local state
                setNotifications((prev) =>
                    prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
                );
                // Update parent state
                updateNotification(notification.id, { read: true });
                // No need to call onNotificationRead() - WebSocket will push unread count update
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
            // Update local state
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            // Update parent state for all notifications
            notifications.forEach((n) => {
                if (!n.read) {
                    updateNotification(n.id, { read: true });
                }
            });
            // No need to call onNotificationRead() - WebSocket will push unread count update (count=0)
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "application_submitted":
            case "application_status_changed":
                return "fi-rr-file-invoice";
            case "application_accepted":
                return "fi-rr-badge-check";
            case "application_rejected":
                return "fi-rr-cross-circle";
            case "account_approved":
            case "account_activated":
            case "ACCOUNT_ACTIVATED":
                return "fi-rr-user-check";
            case "job_posted":
                return "fi-rr-briefcase";
            case "job_matching":
            case "job_recommendation":
                return "fi-rr-rocket-lunch";
            case "new_applicant":
                return "fi-rr-users-alt";
            case "cv_viewed":
                return "fi-rr-eye";
            case "cv_downloaded":
                return "fi-rr-download";
            case "interview_scheduled":
                return "fi-rr-calendar";
            case "system_announcement":
            case "system_alert":
                return "fi-rr-megaphone";
            case "message_received":
                return "fi-rr-envelope";
            case "otp_verification":
                return "fi-rr-lock";
            case "general":
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
        <div ref={dropdownRef} className={styles.dropdown}>
            {/* Header */}
            <div className={styles.header}>
                <h5>Notifications</h5>
                {notifications.some((n) => !n.read) && (
                    <button onClick={handleMarkAllAsRead} className={styles.markAllButton}>
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Notification List */}
            <div className={styles.notificationList}>
                {loading ? (
                    <div className={styles.loading}>Loading...</div>
                ) : notifications.length === 0 ? (
                    <div className={styles.emptyState}>
                        <i className="fi-rr-bell-slash"></i>
                        <p>No notifications yet</p>
                        <p style={{ fontSize: "0.75rem", marginTop: "0.5rem" }}>
                            We'll notify you when something arrives
                        </p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`${styles.notificationItem} ${!notification.read ? styles.unread : ""}`}
                        >
                            <div className={styles.notificationContent}>
                                <div
                                    className={`${styles.iconWrapper} ${notification.read ? styles.read : styles.unread
                                        }`}
                                >
                                    <i className={getNotificationIcon(notification.type)}></i>
                                </div>
                                <div className={styles.textContent}>
                                    <div className={styles.titleRow}>
                                        <h6
                                            className={`${styles.title} ${notification.read ? styles.read : styles.unread
                                                }`}
                                        >
                                            {notification.title}
                                        </h6>
                                        {!notification.read && <div className={styles.unreadDot}></div>}
                                    </div>
                                    <p className={styles.message}>{notification.message}</p>
                                    <p className={styles.timestamp}>{formatTimeAgo(notification.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer 
            {notifications.length > 0 && (
                <div className={styles.footer}>
                    <button
                        onClick={() => {
                            router.push("/notifications");
                            onClose();
                        }}
                        className={styles.viewAllButton}
                    >
                        View all notifications →
                    </button>
                </div>
            )}
                */}
        </div>
    );
};

export default NotificationDropdown;
