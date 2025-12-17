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
import type { NotificationSettings } from "@/types/settings";

export default function NotificationSettingsForm() {
    const dispatch = useAppDispatch();
    const settings = useAppSelector(selectNotificationSettings);
    const saving = useAppSelector(selectSavingSettings);
    const error = useAppSelector(selectProfileError);

    const [localSettings, setLocalSettings] = useState<NotificationSettings | null>(null);
    const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
    const [showSaved, setShowSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                await dispatch(fetchNotificationSettings()).unwrap();
            } catch (err: any) {
                console.error("Failed to load notification settings:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadSettings();
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
            }, 800);

            setSaveTimeout(timeout);
        },
        [dispatch, saveTimeout]
    );

    const handleToggle = useCallback(
        (category: "email" | "push" | "sms", field: string) => {
            if (!localSettings) return;

            const newSettings = {
                ...localSettings,
                [category]: {
                    ...localSettings[category],
                    [field]: !(localSettings[category] as any)[field],
                },
            };

            setLocalSettings(newSettings);
            debouncedSave(newSettings);
        },
        [localSettings, debouncedSave]
    );

    if (isLoading) {
        return (
            <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!localSettings) return null;

    return (
        <div className="notification-settings-enhanced">
            {/* Save Indicator */}
            {showSaved && (
                <div className="alert alert-success alert-sm mb-3">
                    <i className="fi-rr-check-circle me-2"></i>
                    Settings saved
                </div>
            )}

            {/* Email Notifications */}
            <div className="settings-section">
                <div className="section-header">
                    <div className="section-icon bg-primary">
                        <i className="fi-rr-envelope"></i>
                    </div>
                    <div>
                        <h6 className="mb-0">Email Notifications</h6>
                        <small className="text-muted">Manage email preferences</small>
                    </div>
                </div>
                <div className="settings-list">
                    <div className="setting-row">
                        <div className="setting-info">
                            <i className="fi-rr-briefcase text-primary"></i>
                            <div>
                                <label>Job Alerts</label>
                                <small>Get notified about new job matches</small>
                            </div>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={localSettings.email.jobAlerts}
                                onChange={() => handleToggle("email", "jobAlerts")}
                            />
                        </div>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <i className="fi-rr-document text-success"></i>
                            <div>
                                <label>Application Updates</label>
                                <small>Status changes on your applications</small>
                            </div>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={localSettings.email.applicationUpdates}
                                onChange={() => handleToggle("email", "applicationUpdates")}
                            />
                        </div>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <i className="fi-rr-comment text-info"></i>
                            <div>
                                <label>Messages</label>
                                <small>New messages from recruiters</small>
                            </div>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={localSettings.email.messages}
                                onChange={() => handleToggle("email", "messages")}
                            />
                        </div>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <i className="fi-rr-newspaper text-warning"></i>
                            <div>
                                <label>Newsletter</label>
                                <small>Weekly job market insights</small>
                            </div>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={localSettings.email.newsletter}
                                onChange={() => handleToggle("email", "newsletter")}
                            />
                        </div>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <i className="fi-rr-megaphone text-danger"></i>
                            <div>
                                <label>Marketing Emails</label>
                                <small>Promotional offers and updates</small>
                            </div>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={localSettings.email.marketingEmails}
                                onChange={() => handleToggle("email", "marketingEmails")}
                            />
                        </div>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <i className="fi-rr-shield-check text-success"></i>
                            <div>
                                <label>Security Alerts</label>
                                <small>Account security notifications</small>
                            </div>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={localSettings.email.securityAlerts}
                                onChange={() => handleToggle("email", "securityAlerts")}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Push Notifications */}
            <div className="settings-section">
                <div className="section-header">
                    <div className="section-icon bg-success">
                        <i className="fi-rr-bell"></i>
                    </div>
                    <div>
                        <h6 className="mb-0">Push Notifications</h6>
                        <small className="text-muted">Browser and mobile alerts</small>
                    </div>
                </div>
                <div className="settings-list">
                    <div className="setting-row">
                        <div className="setting-info">
                            <i className="fi-rr-briefcase text-primary"></i>
                            <div>
                                <label>Job Alerts</label>
                                <small>Instant job match notifications</small>
                            </div>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={localSettings.push.jobAlerts}
                                onChange={() => handleToggle("push", "jobAlerts")}
                            />
                        </div>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <i className="fi-rr-document text-success"></i>
                            <div>
                                <label>Application Updates</label>
                                <small>Real-time application status</small>
                            </div>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={localSettings.push.applicationUpdates}
                                onChange={() => handleToggle("push", "applicationUpdates")}
                            />
                        </div>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <i className="fi-rr-comment text-info"></i>
                            <div>
                                <label>Messages</label>
                                <small>New message alerts</small>
                            </div>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={localSettings.push.messages}
                                onChange={() => handleToggle("push", "messages")}
                            />
                        </div>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <i className="fi-rr-clock text-warning"></i>
                            <div>
                                <label>Reminders</label>
                                <small>Application deadlines & tasks</small>
                            </div>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={localSettings.push.reminders}
                                onChange={() => handleToggle("push", "reminders")}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* SMS Notifications */}
            <div className="settings-section">
                <div className="section-header">
                    <div className="section-icon bg-warning">
                        <i className="fi-rr-mobile"></i>
                    </div>
                    <div>
                        <h6 className="mb-0">SMS Notifications</h6>
                        <small className="text-muted">Text message alerts</small>
                    </div>
                </div>
                <div className="settings-list">
                    <div className="setting-row">
                        <div className="setting-info">
                            <i className="fi-rr-briefcase text-primary"></i>
                            <div>
                                <label>Job Alerts</label>
                                <small>Critical job opportunities</small>
                            </div>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={localSettings.sms.jobAlerts}
                                onChange={() => handleToggle("sms", "jobAlerts")}
                            />
                        </div>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <i className="fi-rr-shield-check text-success"></i>
                            <div>
                                <label>Security Alerts</label>
                                <small>Important security updates</small>
                            </div>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={localSettings.sms.securityAlerts}
                                onChange={() => handleToggle("sms", "securityAlerts")}
                            />
                        </div>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <i className="fi-rr-exclamation text-danger"></i>
                            <div>
                                <label>Important Updates</label>
                                <small>Urgent account notifications</small>
                            </div>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={localSettings.sms.importantUpdates}
                                onChange={() => handleToggle("sms", "importantUpdates")}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
