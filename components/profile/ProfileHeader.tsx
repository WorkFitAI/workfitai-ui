"use client";

import React from "react";
import type { UserProfile } from "@/types/profile";
import AvatarUploader from "./AvatarUploader";

interface ProfileHeaderProps {
    profile: UserProfile;
    onEdit?: () => void;
}

export default function ProfileHeader({ profile, onEdit }: ProfileHeaderProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getRoleBadgeClass = (role: string) => {
        const roleMap: Record<string, string> = {
            ADMIN: "bg-danger",
            HR_MANAGER: "bg-warning",
            HR: "bg-info",
            CANDIDATE: "bg-success",
        };
        return roleMap[role] || "bg-secondary";
    };

    const getStatusBadgeClass = (status: string) => {
        const statusMap: Record<string, string> = {
            ACTIVE: "bg-success",
            PENDING: "bg-warning",
            WAIT_APPROVED: "bg-info",
            INACTIVE: "bg-secondary",
        };
        return statusMap[status] || "bg-secondary";
    };

    return (
        <div className="profile-header-card">
            <div className="card-style-1 profile-header-content">
                {/* Left: Avatar */}
                <div className="profile-avatar-section">
                    <div className="profile-avatar-display">
                        <img
                            src={profile.avatarUrl || "/assets/imgs/avatar/ava_1.png"}
                            alt={profile.fullName}
                            className="profile-avatar-img"
                        />
                    </div>
                </div>

                {/* Center: Profile Info */}
                <div className="profile-info-section">
                    <div className="profile-name-row">
                        <h3 className="profile-name">{profile.fullName}</h3>
                        <div className="profile-badges">
                            <span className={`badge ${getRoleBadgeClass(profile.role)}`}>
                                {profile.role}
                            </span>
                            <span className={`badge ${getStatusBadgeClass(profile.userStatus)}`}>
                                {profile.userStatus}
                            </span>
                        </div>
                    </div>

                    <div className="profile-details-grid">
                        <div className="profile-detail-item">
                            <i className="fi-rr-envelope"></i>
                            <span>{profile.email}</span>
                        </div>

                        <div className="profile-detail-item">
                            <i className="fi-rr-user"></i>
                            <span>@{profile.username}</span>
                        </div>

                        {profile.phoneNumber && (
                            <div className="profile-detail-item">
                                <i className="fi-rr-phone-call"></i>
                                <span>{profile.phoneNumber}</span>
                            </div>
                        )}

                        <div className="profile-detail-item">
                            <i className="fi-rr-calendar"></i>
                            <span>Joined {formatDate(profile.createdAt)}</span>
                        </div>
                    </div>

                    {/* Company Info for HR/HR_MANAGER */}
                    {(profile.role === "HR" || profile.role === "HR_MANAGER") && profile.companyName && (
                        <div className="profile-company-info mt-3">
                            <div className="company-info-grid">
                                <div className="profile-detail-item">
                                    <i className="fi-rr-building"></i>
                                    <span><strong>{profile.companyName}</strong></span>
                                </div>

                                {profile.department && (
                                    <div className="profile-detail-item">
                                        <i className="fi-rr-briefcase"></i>
                                        <span>{profile.department}</span>
                                    </div>
                                )}

                                {profile.address && (
                                    <div className="profile-detail-item">
                                        <i className="fi-rr-marker"></i>
                                        <span>{profile.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Actions */}
                <div className="profile-actions-section">
                    {onEdit && (
                        <button
                            type="button"
                            onClick={onEdit}
                            className="btn btn-brand-1"
                        >
                            <i className="fi-rr-edit"></i> Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
