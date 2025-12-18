"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    fetchProfile,
    fetch2FAStatus,
    selectProfile,
    selectProfileLoading,
    selectProfileError,
    selectProfileSuccessMessage,
    selectTwoFactorStatus,
    clearSuccessMessage,
} from "@/redux/features/profile/profileSlice";
import { selectAuthUser } from "@/redux/features/auth/authSlice";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileOverview from "@/components/profile/ProfileOverview";
import AvatarUploader from "@/components/profile/AvatarUploader";
import NotificationSettingsForm from "@/components/profile/NotificationSettingsForm";
import PrivacySettingsForm from "@/components/profile/PrivacySettingsForm";
import SecuritySettings from "@/components/profile/SecuritySettings";

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const profile = useAppSelector(selectProfile);
    const authUser = useAppSelector(selectAuthUser);
    const loading = useAppSelector(selectProfileLoading);
    const error = useAppSelector(selectProfileError);
    const successMessage = useAppSelector(selectProfileSuccessMessage);
    const twoFactorStatus = useAppSelector(selectTwoFactorStatus);

    const [showAvatarUploader, setShowAvatarUploader] = useState(false);

    // Always viewing own profile in this route
    const isOwnProfile = true;

    // Load profile on mount
    useEffect(() => {
        dispatch(fetchProfile());
        dispatch(fetch2FAStatus());
    }, [dispatch]);

    // Auto-hide success message
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                dispatch(clearSuccessMessage());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, dispatch]);

    if (loading && !profile) {
        return (
            <div className="section-box mt-20">
                <div className="container">
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading profile...</span>
                        </div>
                        <p className="mt-3 text-muted">Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !profile) {
        return (
            <div className="section-box mt-20">
                <div className="container">
                    <div className="alert alert-danger">
                        <i className="fi-rr-exclamation me-2"></i>
                        <strong>Error loading profile</strong>
                        <p className="mb-0 mt-2">{error}</p>
                        <p className="mb-0 mt-2 small text-muted">
                            This might be due to incomplete user registration. Please contact support if the issue persists.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return null;
    }

    return (
        <div className="section-box mt-20">
            <div className="container">
                {/* Success Message */}
                {successMessage && (
                    <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
                        <i className="fi-rr-check-circle me-2"></i> {successMessage}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => dispatch(clearSuccessMessage())}
                            aria-label="Close"
                        ></button>
                    </div>
                )}

                {/* Avatar Upload Modal */}
                {showAvatarUploader && (
                    <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        <i className="fi-rr-portrait me-2"></i> Update Avatar
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowAvatarUploader(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <AvatarUploader
                                        currentAvatar={profile.avatarUrl || null}
                                        onUploadSuccess={() => {
                                            dispatch(fetchProfile());
                                            setShowAvatarUploader(false);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Profile Content */}
                <ProfileOverview
                    profile={profile}
                    isOwnProfile={isOwnProfile}
                    onAvatarClick={() => setShowAvatarUploader(true)}
                />

                {/* Settings Grid - 2x2 layout */}
                <div className="row mt-4 g-4">
                    {/* Row 1: Notifications */}
                    <div className="col-lg-6">
                        <div className="card card-style-1">
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-4">
                                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                        style={{ width: '48px', height: '48px', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                                        <i className="fi-rr-bell" style={{ color: '#3b82f6', fontSize: '20px' }}></i>
                                    </div>
                                    <div>
                                        <h5 className="mb-1">Notifications</h5>
                                        <p className="text-muted mb-0 small">Manage your notification preferences</p>
                                    </div>
                                </div>
                                <NotificationSettingsForm />
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Privacy */}
                    <div className="col-lg-6">
                        <div className="card card-style-1">
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-4">
                                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                        style={{ width: '48px', height: '48px', backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                                        <i className="fi-rr-eye" style={{ color: '#22c55e', fontSize: '20px' }}></i>
                                    </div>
                                    <div>
                                        <h5 className="mb-1">Privacy</h5>
                                        <p className="text-muted mb-0 small">Control who can see your profile</p>
                                    </div>
                                </div>
                                <PrivacySettingsForm />
                            </div>
                        </div>
                    </div>

                    {/* Row 3: Security - Full Width */}
                    <div className="col-12">
                        <div className="card card-style-1">
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-4">
                                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                        style={{ width: '48px', height: '48px', backgroundColor: 'rgba(251, 191, 36, 0.1)' }}>
                                        <i className="fi-rr-shield-check" style={{ color: '#fbbf24', fontSize: '20px' }}></i>
                                    </div>
                                    <div>
                                        <h5 className="mb-1">Security</h5>
                                        <p className="text-muted mb-0 small">Password & account security</p>
                                    </div>
                                </div>
                                <SecuritySettings twoFactorStatus={twoFactorStatus} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
