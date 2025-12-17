"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    fetchPrivacySettings,
    updatePrivacySettings,
    selectPrivacySettings,
    selectSavingSettings,
    selectProfileError,
} from "@/redux/features/profile/profileSlice";
import type { PrivacySettings, ProfileVisibility } from "@/types/settings";

export default function PrivacySettingsForm() {
    const dispatch = useAppDispatch();
    const settings = useAppSelector(selectPrivacySettings);
    const saving = useAppSelector(selectSavingSettings);
    const error = useAppSelector(selectProfileError);

    const [localSettings, setLocalSettings] = useState<PrivacySettings | null>(null);
    const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
    const [showSaved, setShowSaved] = useState(false);

    useEffect(() => {
        dispatch(fetchPrivacySettings());
    }, [dispatch]);

    useEffect(() => {
        if (settings) {
            setLocalSettings(settings);
        }
    }, [settings]);

    // Debounced auto-save
    const debouncedSave = useCallback(
        (newSettings: PrivacySettings) => {
            if (saveTimeout) {
                clearTimeout(saveTimeout);
            }

            const timeout = setTimeout(async () => {
                try {
                    await dispatch(updatePrivacySettings(newSettings)).unwrap();
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

    const handleVisibilityChange = (visibility: ProfileVisibility) => {
        if (!localSettings) return;

        const newSettings = {
            ...localSettings,
            profileVisibility: visibility,
        };
        setLocalSettings(newSettings);
        debouncedSave(newSettings);
    };

    const handleToggle = (key: keyof PrivacySettings, value: boolean) => {
        if (!localSettings) return;

        const newSettings = {
            ...localSettings,
            [key]: value,
        };
        setLocalSettings(newSettings);
        debouncedSave(newSettings);
    };

    if (!localSettings) {
        return (
            <div className="privacy-settings-loading">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="privacy-settings-form">
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

            {/* Profile Visibility */}
            <div className="settings-section">
                <div className="settings-section-header">
                    <div className="settings-section-title">
                        <i className="fi-rr-eye"></i>
                        <h5>Profile Visibility</h5>
                    </div>
                </div>

                <div className="profile-visibility-options">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="profileVisibility"
                            id="visibility-public"
                            checked={localSettings.profileVisibility === "PUBLIC"}
                            onChange={() => handleVisibilityChange("PUBLIC")}
                            disabled={saving}
                        />
                        <label className="form-check-label" htmlFor="visibility-public">
                            <div className="visibility-option">
                                <i className="fi-rr-world"></i>
                                <div>
                                    <strong>Public</strong>
                                    <span className="d-block text-muted">Anyone can view your profile</span>
                                </div>
                            </div>
                        </label>
                    </div>

                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="profileVisibility"
                            id="visibility-connections"
                            checked={localSettings.profileVisibility === "CONNECTIONS_ONLY"}
                            onChange={() => handleVisibilityChange("CONNECTIONS_ONLY")}
                            disabled={saving}
                        />
                        <label className="form-check-label" htmlFor="visibility-connections">
                            <div className="visibility-option">
                                <i className="fi-rr-users"></i>
                                <div>
                                    <strong>Connections Only</strong>
                                    <span className="d-block text-muted">Only your connections can view</span>
                                </div>
                            </div>
                        </label>
                    </div>

                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="profileVisibility"
                            id="visibility-private"
                            checked={localSettings.profileVisibility === "PRIVATE"}
                            onChange={() => handleVisibilityChange("PRIVATE")}
                            disabled={saving}
                        />
                        <label className="form-check-label" htmlFor="visibility-private">
                            <div className="visibility-option">
                                <i className="fi-rr-lock"></i>
                                <div>
                                    <strong>Private</strong>
                                    <span className="d-block text-muted">Only you can view your profile</span>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Information Visibility */}
            <div className="settings-section mt-4">
                <div className="settings-section-header">
                    <div className="settings-section-title">
                        <i className="fi-rr-info"></i>
                        <h5>Information Visibility</h5>
                    </div>
                </div>

                <div className="settings-list">
                    <div className="setting-row">
                        <div className="setting-info">
                            <div className="setting-label">
                                <i className="fi-rr-envelope"></i>
                                <span>Show Email</span>
                            </div>
                            <p className="setting-description">Display email on your profile</p>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={localSettings.showEmail}
                                onChange={(e) => handleToggle("showEmail", e.target.checked)}
                                disabled={saving}
                            />
                        </div>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <div className="setting-label">
                                <i className="fi-rr-phone-call"></i>
                                <span>Show Phone</span>
                            </div>
                            <p className="setting-description">Display phone number on your profile</p>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={localSettings.showPhone}
                                onChange={(e) => handleToggle("showPhone", e.target.checked)}
                                disabled={saving}
                            />
                        </div>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <div className="setting-label">
                                <i className="fi-rr-marker"></i>
                                <span>Show Location</span>
                            </div>
                            <p className="setting-description">Display your city/location</p>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={localSettings.showLocation}
                                onChange={(e) => handleToggle("showLocation", e.target.checked)}
                                disabled={saving}
                            />
                        </div>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <div className="setting-label">
                                <i className="fi-rr-download"></i>
                                <span>Allow CV Download</span>
                            </div>
                            <p className="setting-description">Let recruiters download your CV</p>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={localSettings.allowCvDownload}
                                onChange={(e) => handleToggle("allowCvDownload", e.target.checked)}
                                disabled={saving}
                            />
                        </div>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <div className="setting-label">
                                <i className="fi-rr-comment"></i>
                                <span>Allow Messaging</span>
                            </div>
                            <p className="setting-description">Allow recruiters to send you messages</p>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={localSettings.allowMessaging}
                                onChange={(e) => handleToggle("allowMessaging", e.target.checked)}
                                disabled={saving}
                            />
                        </div>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <div className="setting-label">
                                <i className="fi-rr-time-forward"></i>
                                <span>Show Activity Status</span>
                            </div>
                            <p className="setting-description">Show "last active" timestamp</p>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={localSettings.showActivityStatus}
                                onChange={(e) => handleToggle("showActivityStatus", e.target.checked)}
                                disabled={saving}
                            />
                        </div>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <div className="setting-label">
                                <i className="fi-rr-circle"></i>
                                <span>Show Online Status</span>
                            </div>
                            <p className="setting-description">Display online indicator (green dot)</p>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={localSettings.showOnlineStatus}
                                onChange={(e) => handleToggle("showOnlineStatus", e.target.checked)}
                                disabled={saving}
                            />
                        </div>
                    </div>

                    <div className="setting-row">
                        <div className="setting-info">
                            <div className="setting-label">
                                <i className="fi-rr-search"></i>
                                <span>Allow Search Indexing</span>
                            </div>
                            <p className="setting-description">Appear in search results</p>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={localSettings.searchIndexing}
                                onChange={(e) => handleToggle("searchIndexing", e.target.checked)}
                                disabled={saving}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Box */}
            <div className="alert alert-info mt-4">
                <i className="fi-rr-info"></i>
                <span>
                    Your privacy settings help control who can see your information and how recruiters can interact with you.
                </span>
            </div>
        </div>
    );
}
