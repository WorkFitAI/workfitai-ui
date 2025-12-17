"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    fetchProfile,
    selectProfile,
    selectProfileLoading,
    selectProfileError,
    selectProfileSuccessMessage,
    clearSuccessMessage,
} from "@/redux/features/profile/profileSlice";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs, { ProfileTab } from "@/components/profile/ProfileTabs";
import AvatarUploader from "@/components/profile/AvatarUploader";
import NotificationSettingsForm from "@/components/profile/NotificationSettingsForm";
import PrivacySettingsForm from "@/components/profile/PrivacySettingsForm";
import SecuritySettings from "@/components/profile/SecuritySettings";

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();

    const profile = useAppSelector(selectProfile);
    const loading = useAppSelector(selectProfileLoading);
    const error = useAppSelector(selectProfileError);
    const successMessage = useAppSelector(selectProfileSuccessMessage);

    const [activeTab, setActiveTab] = useState<ProfileTab>("overview");
    const [showAvatarUploader, setShowAvatarUploader] = useState(false);

    // Load profile on mount
    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    // Sync tab with URL
    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab && (tab === "overview" || tab === "settings" || tab === "security")) {
            setActiveTab(tab as ProfileTab);
        }
    }, [searchParams]);

    // Auto-hide success message
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                dispatch(clearSuccessMessage());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, dispatch]);

    const handleTabChange = (tab: ProfileTab) => {
        setActiveTab(tab);
    };

    if (loading && !profile) {
        return (
            <div className="section-box">
                <div className="container">
                    <div className="panel-white text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading profile...</span>
                        </div>
                        <p className="mt-3 text-muted">Loading your profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !profile) {
        return (
            <div className="section-box">
                <div className="container">
                    <div className="alert alert-danger">
                        <i className="fi-rr-exclamation"></i> {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return null;
    }

    return (
        <>
            <div className="section-box">
                <div className="container">
                    {/* Success Message */}
                    {successMessage && (
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                            <i className="fi-rr-check-circle"></i> {successMessage}
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => dispatch(clearSuccessMessage())}
                                aria-label="Close"
                            ></button>
                        </div>
                    )}

                    {/* Profile Header */}
                    <ProfileHeader
                        profile={profile}
                        onEdit={() => setShowAvatarUploader(!showAvatarUploader)}
                    />

                    {/* Avatar Uploader (Toggle) */}
                    {showAvatarUploader && (
                        <div className="panel-white mt-3">
                            <h5 className="mb-3">
                                <i className="fi-rr-portrait"></i> Update Avatar
                            </h5>
                            <AvatarUploader
                                currentAvatar={profile.avatarUrl}
                                onUploadSuccess={() => {
                                    dispatch(fetchProfile());
                                    setShowAvatarUploader(false);
                                }}
                            />
                        </div>
                    )}

                    {/* Tabs Navigation */}
                    <div className="mt-4">
                        <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />
                    </div>

                    {/* Tab Content */}
                    <div className="tab-content mt-4">
                        {/* Overview Tab */}
                        {activeTab === "overview" && (
                            <div className="panel-white">
                                <h5 className="mb-4">
                                    <i className="fi-rr-user"></i> Basic Information
                                </h5>

                                <div className="profile-overview-grid">
                                    <div className="profile-info-row">
                                        <span className="info-label">Full Name:</span>
                                        <span className="info-value">{profile.fullName}</span>
                                    </div>

                                    <div className="profile-info-row">
                                        <span className="info-label">Email:</span>
                                        <span className="info-value">{profile.email}</span>
                                    </div>

                                    <div className="profile-info-row">
                                        <span className="info-label">Username:</span>
                                        <span className="info-value">@{profile.username}</span>
                                    </div>

                                    <div className="profile-info-row">
                                        <span className="info-label">Phone:</span>
                                        <span className="info-value">{profile.phoneNumber || "Not provided"}</span>
                                    </div>

                                    <div className="profile-info-row">
                                        <span className="info-label">Role:</span>
                                        <span className="info-value">
                                            <span className="badge bg-info">{profile.role}</span>
                                        </span>
                                    </div>

                                    <div className="profile-info-row">
                                        <span className="info-label">Status:</span>
                                        <span className="info-value">
                                            <span className="badge bg-success">{profile.userStatus}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Company Info (for HR/HR_MANAGER) */}
                                {(profile.role === "HR" || profile.role === "HR_MANAGER") && profile.companyName && (
                                    <>
                                        <hr className="my-4" />
                                        <h5 className="mb-4">
                                            <i className="fi-rr-building"></i> Company Information
                                        </h5>

                                        <div className="profile-overview-grid">
                                            <div className="profile-info-row">
                                                <span className="info-label">Company:</span>
                                                <span className="info-value"><strong>{profile.companyName}</strong></span>
                                            </div>

                                            {profile.department && (
                                                <div className="profile-info-row">
                                                    <span className="info-label">Department:</span>
                                                    <span className="info-value">{profile.department}</span>
                                                </div>
                                            )}

                                            {profile.address && (
                                                <div className="profile-info-row">
                                                    <span className="info-label">Address:</span>
                                                    <span className="info-value">{profile.address}</span>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                <hr className="my-4" />
                                <h5 className="mb-4">
                                    <i className="fi-rr-time-forward"></i> Account Activity
                                </h5>

                                <div className="profile-overview-grid">
                                    <div className="profile-info-row">
                                        <span className="info-label">Created:</span>
                                        <span className="info-value">
                                            {new Date(profile.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>

                                    <div className="profile-info-row">
                                        <span className="info-label">Last Updated:</span>
                                        <span className="info-value">
                                            {new Date(profile.updatedAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === "settings" && (
                            <div className="panel-white">
                                <h5 className="mb-4">
                                    <i className="fi-rr-settings"></i> Notification & Privacy Settings
                                </h5>

                                <NotificationSettingsForm />

                                <hr className="my-5" />

                                <PrivacySettingsForm />
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === "security" && (
                            <div className="panel-white">
                                <h5 className="mb-4">
                                    <i className="fi-rr-shield-check"></i> Security & Account
                                </h5>

                                <SecuritySettings />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
