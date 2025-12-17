"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    fetchNotificationSettings,
    updateNotificationSettings,
    selectNotificationSettings,
    selectSavingSettings,
    selectProfileError,
} from "@/redux/features/profile/profileSlice";
import type {
    NotificationSettings,
    NotificationFrequency,
    EmailNotificationSettings,
    PushNotificationSettings
} from "@/types/settings";

export default function NotificationSettingsForm() {
    const dispatch = useAppDispatch();
    const settings = useAppSelector(selectNotificationSettings);
    const saving = useAppSelector(selectSavingSettings);
    const error = useAppSelector(selectProfileError);

    const [localSettings, setLocalSettings] = useState<NotificationSettings | null>(null);
    const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
    const [showSaved, setShowSaved] = useState(false);

    useEffect(() => {
        dispatch(fetchNotificationSettings());
    }, [dispatch]);

    useEffect(() => {
        if (settings) {
            setLocalSettings(settings);
        }
    }, [settings]);

    // Debounced auto-save
    const debouncedSave = useCallback(
        (newSettings: NotificationSettings) => {
            if (saveTimeout) {
                clearTimeout(saveTimeout);
            }

            const timeout = setTimeout(async () => {
                try {
                    await dispatch(updateNotificationSettings(newSettings)).unwrap();
                    setShowSaved(true);
                    setTimeout(() => setShowSaved(false), 2000);
                } catch (error) {
                    console.error("Failed to save settings:", error);
                }
            }, 500);

            setSaveTimeout(timeout);
        },
        [dispatch, saveTimeout]
    );

    const handleEmailMasterToggle = (enabled: boolean) => {
        if (!localSettings) return;

        const newSettings = {
            ...localSettings,
            emailNotifications: {
                ...localSettings.emailNotifications,
                enabled,
            },
        };
        setLocalSettings(newSettings);
        debouncedSave(newSettings);
    };

    const handleEmailToggle = (key: keyof EmailNotificationSettings, value: boolean) => {
        if (!localSettings) return;

        const newSettings = {
            ...localSettings,
            emailNotifications: {
                ...localSettings.emailNotifications,
                [key]: value,
            },
        };
        setLocalSettings(newSettings);
        debouncedSave(newSettings);
    };

    const handlePushMasterToggle = (enabled: boolean) => {
        if (!localSettings) return;

        const newSettings = {
            ...localSettings,
            pushNotifications: {
                ...localSettings.pushNotifications,
                enabled,
            },
        };
        setLocalSettings(newSettings);
        debouncedSave(newSettings);
    };

    const handlePushToggle = (key: keyof PushNotificationSettings, value: boolean) => {
        if (!localSettings) return;

        const newSettings = {
            ...localSettings,
            pushNotifications: {
                ...localSettings.pushNotifications,
                [key]: value,
            },
        };
        setLocalSettings(newSettings);
        debouncedSave(newSettings);
    };

    const handleFrequencyChange = (frequency: NotificationFrequency) => {
        if (!localSettings) return;

        const newSettings = {
            ...localSettings,
            frequency,
        };
        setLocalSettings(newSettings);
        debouncedSave(newSettings);
    };

    if (!localSettings) {
        return (
            <div className="notification-settings-loading">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="notification-settings-form">
            {/* Save Indicator */}
            {showSaved && (
                <div className="alert alert-success save-indicator">
                    <i className="fi-rr-check-circle"></i> Settings saved automatically
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger">
                    <i className="fi-rr-exclamation"></i> {error}
                </div>
            )}

            {/* Email Notifications */}
            <div className="settings-section">
                <div className="settings-section-header">
                    <div className="settings-section-title">
                        <i className="fi-rr-envelope"></i>
                        <h5>Email Notifications</h5>
                    </div>
                    <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            checked={localSettings.emailNotifications.enabled}
                            onChange={(e) => handleEmailMasterToggle(e.target.checked)}
                            disabled={saving}
                        />
                    </div>
                </div>

                <div className="settings-list">
                    <div className="setting-row">
                        <div className="setting-info">
                            <div className="setting-label">
                                <i className="fi-rr-briefcase"></i>
                                <span>New Job Match</span>
                            </div>
                            <p className="setting-description">Get notified when jobs match your profile</p>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={localSettings.emailNotifications.newJobMatch}
                                onChange={(e) => handleEmailToggle("newJobMatch", e.target.checked)}
                                disabled={!localSettings.emailNotifications.enabled || saving}
                            />
                        </div>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <div className="setting-label">
                                <i className="fi-rr-document"></i>
                                <span>Application Status</span>
                            </div>
                            <p className="setting-description">Updates on your job applications</p>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={localSettings.emailNotifications.applicationStatus}
                                onChange={(e) => handleEmailToggle("applicationStatus", e.target.checked)}
                                disabled={!localSettings.emailNotifications.enabled || saving}
                            />
                        </div>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <div className="setting-label">
                                <i className="fi-rr-comment"></i>
                                <span>Messages</span>
                            </div>
                            <p className="setting-description">New messages from recruiters</p>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={localSettings.emailNotifications.messages}
                                onChange={(e) => handleEmailToggle("messages", e.target.checked)}
                                disabled={!localSettings.emailNotifications.enabled || saving}
                            />
                        </div>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <div className="setting-label">
                                <i className="fi-rr-calendar"></i>
                                <span>Weekly Digest</span>
                            </div>
                            <p className="setting-description">Weekly summary of activity</p>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={localSettings.emailNotifications.weeklyDigest}
                                onChange={(e) => handleEmailToggle("weeklyDigest", e.target.checked)}
                                disabled={!localSettings.emailNotifications.enabled || saving}
                            />
                        </div>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <div className="setting-label">
                                <i className="fi-rr-megaphone"></i>
                                <span>Promotions</span>
                            </div>
                            <p className="setting-description">Marketing and promotional emails</p>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={localSettings.emailNotifications.promotions}
                                onChange={(e) => handleEmailToggle("promotions", e.target.checked)}
                                disabled={!localSettings.emailNotifications.enabled || saving}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Push Notifications */}
            <div className="settings-section mt-4">
                <div className="settings-section-header">
                    <div className="settings-section-title">
                        <i className="fi-rr-bell"></i>
                        <h5>Push Notifications</h5>
                    </div>
                    <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            checked={localSettings.pushNotifications.enabled}
                            onChange={(e) => handlePushMasterToggle(e.target.checked)}
                            disabled={saving}
                        />
                    </div>
                </div>

                <div className="settings-list">
                    <div className="setting-row">
                        <div className="setting-info">
                            <div className="setting-label">
                                <i className="fi-rr-briefcase"></i>
                                <span>New Job Match</span>
                            </div>
                            <p className="setting-description">Push notifications for job matches</p>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={localSettings.pushNotifications.newJobMatch}
                                onChange={(e) => handlePushToggle("newJobMatch", e.target.checked)}
                                disabled={!localSettings.pushNotifications.enabled || saving}
                            />
                        </div>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <div className="setting-label">
                                <i className="fi-rr-document"></i>
                                <span>Application Status</span>
                            </div>
                            <p className="setting-description">Push notifications for application updates</p>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={localSettings.pushNotifications.applicationStatus}
                                onChange={(e) => handlePushToggle("applicationStatus", e.target.checked)}
                                disabled={!localSettings.pushNotifications.enabled || saving}
                            />
                        </div>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <div className="setting-label">
                                <i className="fi-rr-comment"></i>
                                <span>Messages</span>
                            </div>
                            <p className="setting-description">Push notifications for new messages</p>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={localSettings.pushNotifications.messages}
                                onChange={(e) => handlePushToggle("messages", e.target.checked)}
                                disabled={!localSettings.pushNotifications.enabled || saving}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Frequency */}
            <div className="settings-section mt-4">
                <div className="settings-section-header">
                    <div className="settings-section-title">
                        <i className="fi-rr-time-forward"></i>
                        <h5>Notification Frequency</h5>
                    </div>
                </div>

                <div className="frequency-options">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="frequency"
                            id="freq-realtime"
                            checked={localSettings.frequency === "REAL_TIME"}
                            onChange={() => handleFrequencyChange("REAL_TIME")}
                            disabled={saving}
                        />
                        <label className="form-check-label" htmlFor="freq-realtime">
                            <strong>Real-time</strong>
                            <span className="d-block text-muted">Receive notifications instantly</span>
                        </label>
                    </div>

                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="frequency"
                            id="freq-daily"
                            checked={localSettings.frequency === "DAILY_DIGEST"}
                            onChange={() => handleFrequencyChange("DAILY_DIGEST")}
                            disabled={saving}
                        />
                        <label className="form-check-label" htmlFor="freq-daily">
                            <strong>Daily Digest</strong>
                            <span className="d-block text-muted">Once per day at 9:00 AM</span>
                        </label>
                    </div>

                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="frequency"
                            id="freq-weekly"
                            checked={localSettings.frequency === "WEEKLY_DIGEST"}
                            onChange={() => handleFrequencyChange("WEEKLY_DIGEST")}
                            disabled={saving}
                        />
                        <label className="form-check-label" htmlFor="freq-weekly">
                            <strong>Weekly Digest</strong>
                            <span className="d-block text-muted">Every Monday at 9:00 AM</span>
                        </label>
                    </div>

                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="frequency"
                            id="freq-none"
                            checked={localSettings.frequency === "NONE"}
                            onChange={() => handleFrequencyChange("NONE")}
                            disabled={saving}
                        />
                        <label className="form-check-label" htmlFor="freq-none">
                            <strong>None</strong>
                            <span className="d-block text-muted">Disable all notifications</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
