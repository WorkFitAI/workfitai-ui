"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    fetchActiveSessions,
    logoutSession,
    logoutAllOtherSessions,
    selectSessions,
    selectProfileLoading,
} from "@/redux/features/profile/profileSlice";
import ChangePasswordForm from "./ChangePasswordForm";
import Enable2FAModal from "./Enable2FAModal";

export default function SecuritySettings() {
    const dispatch = useAppDispatch();
    const sessions = useAppSelector(selectSessions);
    const loading = useAppSelector(selectProfileLoading);

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [is2FAEnabled, setIs2FAEnabled] = useState(false); // TODO: Get from profile state

    useEffect(() => {
        dispatch(fetchActiveSessions());
    }, [dispatch]);

    const handleLogoutSession = async (sessionId: string) => {
        if (!confirm("Are you sure you want to logout this session?")) {
            return;
        }

        try {
            await dispatch(logoutSession(sessionId)).unwrap();
        } catch (error) {
            console.error("Failed to logout session:", error);
        }
    };

    const handleLogoutAllSessions = async () => {
        const count = sessions.others.length;
        if (!confirm(`Are you sure you want to logout all ${count} other session(s)?`)) {
            return;
        }

        try {
            await dispatch(logoutAllOtherSessions()).unwrap();
        } catch (error) {
            console.error("Failed to logout all sessions:", error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getDeviceIcon = (deviceName: string) => {
        const lower = deviceName.toLowerCase();
        if (lower.includes("iphone") || lower.includes("android")) return "fi-rr-smartphone";
        if (lower.includes("ipad") || lower.includes("tablet")) return "fi-rr-tablet";
        return "fi-rr-computer";
    };

    return (
        <div className="security-settings">
            {/* Change Password Section */}
            <div className="settings-section">
                <div className="settings-section-header">
                    <div className="settings-section-title">
                        <i className="fi-rr-lock"></i>
                        <h5>Password</h5>
                    </div>
                    <button
                        type="button"
                        className="btn btn-sm btn-border"
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                    >
                        {showPasswordForm ? "Cancel" : "Change Password"}
                    </button>
                </div>

                {showPasswordForm && (
                    <div className="password-form-container mt-3">
                        <ChangePasswordForm />
                    </div>
                )}

                {!showPasswordForm && (
                    <p className="text-muted">
                        <i className="fi-rr-info"></i> Last changed: Not available
                    </p>
                )}
            </div>

            {/* 2FA Section */}
            <div className="settings-section mt-4">
                <div className="settings-section-header">
                    <div className="settings-section-title">
                        <i className="fi-rr-shield-check"></i>
                        <h5>Two-Factor Authentication</h5>
                    </div>
                    <span className={`badge ${is2FAEnabled ? 'bg-success' : 'bg-secondary'}`}>
                        {is2FAEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                </div>
                <p className="text-muted">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                    {is2FAEnabled && ' Your account is currently protected by 2FA.'}
                </p>
                <button
                    type="button"
                    className={`btn ${is2FAEnabled ? 'btn-danger' : 'btn-brand-2'}`}
                    onClick={() => setShow2FAModal(true)}
                >
                    <i className={`fi-rr-${is2FAEnabled ? 'shield-exclamation' : 'plus'}`}></i>
                    {is2FAEnabled ? ' Disable 2FA' : ' Enable 2FA'}
                </button>
            </div>

            {/* 2FA Modal */}
            <Enable2FAModal
                show={show2FAModal}
                onHide={() => setShow2FAModal(false)}
                currentlyEnabled={is2FAEnabled}
            />

            {/* Active Sessions */}
            <div className="settings-section mt-4">
                <div className="settings-section-header">
                    <div className="settings-section-title">
                        <i className="fi-rr-devices"></i>
                        <h5>Active Sessions</h5>
                    </div>
                    {sessions.others.length > 0 && (
                        <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={handleLogoutAllSessions}
                            disabled={loading}
                        >
                            <i className="fi-rr-sign-out-alt"></i> Logout All Others
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="sessions-list">
                        {/* Current Session */}
                        {sessions.current && (
                            <div className="session-card current-session">
                                <div className="session-icon">
                                    <i className={getDeviceIcon(sessions.current.deviceName)}></i>
                                </div>
                                <div className="session-info">
                                    <div className="session-device">
                                        <strong>{sessions.current.deviceName}</strong>
                                        <span className="badge bg-success ms-2">Current Session</span>
                                    </div>
                                    <div className="session-details">
                                        <span className="session-detail-item">
                                            <i className="fi-rr-globe"></i> {sessions.current.ipAddress}
                                        </span>
                                        {sessions.current.location && (
                                            <span className="session-detail-item">
                                                <i className="fi-rr-marker"></i> {sessions.current.location}
                                            </span>
                                        )}
                                        <span className="session-detail-item">
                                            <i className="fi-rr-time-forward"></i> Active {formatDate(sessions.current.lastActivityAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Other Sessions */}
                        {sessions.others.map((session) => (
                            <div key={session.sessionId} className="session-card">
                                <div className="session-icon">
                                    <i className={getDeviceIcon(session.deviceName)}></i>
                                </div>
                                <div className="session-info">
                                    <div className="session-device">
                                        <strong>{session.deviceName}</strong>
                                    </div>
                                    <div className="session-details">
                                        <span className="session-detail-item">
                                            <i className="fi-rr-globe"></i> {session.ipAddress}
                                        </span>
                                        {session.location && (
                                            <span className="session-detail-item">
                                                <i className="fi-rr-marker"></i> {session.location}
                                            </span>
                                        )}
                                        <span className="session-detail-item">
                                            <i className="fi-rr-calendar"></i> Login {formatDate(session.loginAt)}
                                        </span>
                                    </div>
                                </div>
                                <div className="session-actions">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-border text-danger"
                                        onClick={() => handleLogoutSession(session.sessionId)}
                                    >
                                        <i className="fi-rr-sign-out-alt"></i> Logout
                                    </button>
                                </div>
                            </div>
                        ))}

                        {sessions.others.length === 0 && (
                            <div className="alert alert-info">
                                <i className="fi-rr-info"></i> You don't have any other active sessions.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Danger Zone */}
            <div className="settings-section mt-4 danger-zone">
                <div className="settings-section-header">
                    <div className="settings-section-title">
                        <i className="fi-rr-exclamation-triangle"></i>
                        <h5>Danger Zone</h5>
                    </div>
                </div>

                <div className="danger-zone-content">
                    <div className="danger-action">
                        <div>
                            <strong>Deactivate Account</strong>
                            <p className="text-muted">Temporarily disable your account. You can reactivate within 30 days.</p>
                        </div>
                        <button type="button" className="btn btn-border" disabled>
                            Deactivate (Coming Soon)
                        </button>
                    </div>

                    <hr />

                    <div className="danger-action">
                        <div>
                            <strong>Delete Account Permanently</strong>
                            <p className="text-muted text-danger">
                                Once deleted, your data cannot be recovered. This action is irreversible.
                            </p>
                        </div>
                        <button type="button" className="btn btn-danger" disabled>
                            Delete Account (Coming Soon)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
