"use client";

import React, { useState } from "react";
import type { UserProfile } from "@/types/profile";
import { useAppDispatch } from "@/redux/hooks";
import { updateProfile } from "@/redux/features/profile/profileSlice";
import Avatar from "@/components/common/Avatar";

interface ProfileOverviewProps {
    profile: UserProfile;
    isOwnProfile: boolean;
    onAvatarClick?: () => void;
}

export default function ProfileOverview({ profile, isOwnProfile, onAvatarClick }: ProfileOverviewProps) {
    const dispatch = useAppDispatch();
    const [editMode, setEditMode] = useState({
        basic: false,
        contact: false,
        company: false,
    });

    const [formData, setFormData] = useState({
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber || "",
        address: profile.address || "",
        department: profile.department || "",
    });

    const handleEdit = (section: keyof typeof editMode) => {
        setEditMode(prev => ({ ...prev, [section]: true }));
    };

    const handleCancel = (section: keyof typeof editMode) => {
        setEditMode(prev => ({ ...prev, [section]: false }));
        // Reset form data
        setFormData({
            fullName: profile.fullName,
            phoneNumber: profile.phoneNumber || "",
            address: profile.address || "",
            department: profile.department || "",
        });
    };

    const handleSave = async (section: keyof typeof editMode) => {
        const updateData: any = {};

        if (section === "basic") {
            updateData.fullName = formData.fullName;
        } else if (section === "contact") {
            updateData.phoneNumber = formData.phoneNumber;
        } else if (section === "company") {
            updateData.address = formData.address;
            updateData.department = formData.department;
        }

        // Get user role and pass it
        const userRole = (profile.role || profile.userRole) as "CANDIDATE" | "HR" | "HR_MANAGER" | "ADMIN";
        updateData.role = userRole;

        await dispatch(updateProfile(updateData));
        setEditMode(prev => ({ ...prev, [section]: false }));
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="profile-overview-container">
            {/* Enhanced Profile Header */}
            <div className="profile-header-enhanced">
                <div className="profile-header-bg"></div>
                <div className="profile-header-content">
                    <div className="profile-avatar-section">
                        <div
                            className={`profile-avatar-wrapper ${isOwnProfile && onAvatarClick ? 'clickable' : ''}`}
                            onClick={isOwnProfile && onAvatarClick ? onAvatarClick : undefined}
                            role={isOwnProfile && onAvatarClick ? 'button' : undefined}
                            tabIndex={isOwnProfile && onAvatarClick ? 0 : undefined}
                        >
                            <Avatar
                                src={profile.avatarUrl}
                                username={profile.username}
                                size={140}
                            />
                            {isOwnProfile && onAvatarClick && (
                                <div className="avatar-overlay-enhanced">
                                    <i className="fi-rr-camera"></i>
                                    <span>Change Photo</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="profile-info-section">
                        <div className="profile-main-info">
                            <h2 className="profile-name">{profile.fullName}</h2>
                            <p className="profile-username">@{profile.username}</p>
                            <div className="profile-badges-enhanced">
                                <span className={`badge-status ${profile.userStatus === 'ACTIVE' ? 'active' : 'inactive'}`}>
                                    <i className="fi-rr-check-circle"></i> {profile.userStatus}
                                </span>
                                <span className="badge-role">
                                    <i className="fi-rr-user"></i> {profile.role}
                                </span>
                            </div>
                        </div>

                        {/* Stats
                        <div className="profile-stats-enhanced">
                            <div className="stat-item">
                                <div className="stat-icon bg-primary">
                                    <i className="fi-rr-briefcase"></i>
                                </div>
                                <div className="stat-info">
                                    <h4>{(profile as any).applications?.length || 0}</h4>
                                    <span>Applications</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon bg-success">
                                    <i className="fi-rr-bookmark"></i>
                                </div>
                                <div className="stat-info">
                                    <h4>{(profile as any).savedJobs?.length || 0}</h4>
                                    <span>Saved Jobs</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon bg-info">
                                    <i className="fi-rr-eye"></i>
                                </div>
                                <div className="stat-info">
                                    <h4>{(profile as any).profileViews || 0}</h4>
                                    <span>Views</span>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            <div className="panel-white">
                {/* Basic Information */}
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">
                            <i className="fi-rr-user me-2"></i> Basic Information
                        </h5>
                        {isOwnProfile && !editMode.basic && (
                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEdit("basic")}
                            >
                                <i className="fi-rr-edit me-1"></i> Edit
                            </button>
                        )}
                    </div>

                    <div className="profile-overview-grid">
                        <div className="profile-info-row">
                            <span className="info-label">Full Name:</span>
                            {editMode.basic ? (
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    value={formData.fullName}
                                    onChange={(e) => handleChange("fullName", e.target.value)}
                                />
                            ) : (
                                <span className="info-value">{profile.fullName}</span>
                            )}
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
                            <span className="info-label">Role:</span>
                            <span className="info-value">
                                <span className={`badge ${profile.role === 'ADMIN' ? 'bg-danger' :
                                    profile.role === 'HR_MANAGER' ? 'bg-warning' :
                                        profile.role === 'HR' ? 'bg-info' :
                                            'bg-success'
                                    }`}>{profile.role}</span>
                            </span>
                        </div>

                        <div className="profile-info-row">
                            <span className="info-label">Status:</span>
                            <span className="info-value">
                                <span className={`badge ${profile.userStatus === 'ACTIVE' ? 'bg-success' :
                                    profile.userStatus === 'PENDING' ? 'bg-warning' :
                                        'bg-secondary'
                                    }`}>{profile.userStatus}</span>
                            </span>
                        </div>
                    </div>

                    {editMode.basic && (
                        <div className="mt-3 d-flex gap-2">
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleSave("basic")}
                            >
                                <i className="fi-rr-check me-1"></i> Save
                            </button>
                            <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => handleCancel("basic")}
                            >
                                <i className="fi-rr-cross me-1"></i> Cancel
                            </button>
                        </div>
                    )}
                </div>

                {/* Contact Information */}
                {isOwnProfile && (
                    <>
                        <hr className="my-4" />
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">
                                    <i className="fi-rr-phone-call me-2"></i> Contact Information
                                </h5>
                                {!editMode.contact && (
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => handleEdit("contact")}
                                    >
                                        <i className="fi-rr-edit me-1"></i> Edit
                                    </button>
                                )}
                            </div>

                            <div className="profile-overview-grid">
                                <div className="profile-info-row">
                                    <span className="info-label">Phone:</span>
                                    {editMode.contact ? (
                                        <input
                                            type="tel"
                                            className="form-control form-control-sm"
                                            value={formData.phoneNumber}
                                            onChange={(e) => handleChange("phoneNumber", e.target.value)}
                                            placeholder="Enter phone number"
                                        />
                                    ) : (
                                        <span className="info-value">{profile.phoneNumber || "Not provided"}</span>
                                    )}
                                </div>
                            </div>

                            {editMode.contact && (
                                <div className="mt-3 d-flex gap-2">
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleSave("contact")}
                                    >
                                        <i className="fi-rr-check me-1"></i> Save
                                    </button>
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => handleCancel("contact")}
                                    >
                                        <i className="fi-rr-cross me-1"></i> Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Company Info (for HR/HR_MANAGER) */}
                {((profile.role || profile.userRole) === "HR" || (profile.role || profile.userRole) === "HR_MANAGER") && (
                    <>
                        <hr className="my-4" />
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">
                                    <i className="fi-rr-building me-2"></i> Company Information
                                </h5>
                                {isOwnProfile && !editMode.company && (
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => handleEdit("company")}
                                    >
                                        <i className="fi-rr-edit me-1"></i> Edit
                                    </button>
                                )}
                            </div>

                            <div className="profile-overview-grid">
                                <div className="profile-info-row">
                                    <span className="info-label">Company:</span>
                                    <span className="info-value"><strong>{profile.companyName}</strong></span>
                                </div>

                                <div className="profile-info-row">
                                    <span className="info-label">Department:</span>
                                    {editMode.company ? (
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={formData.department}
                                            onChange={(e) => handleChange("department", e.target.value)}
                                            placeholder="Enter department"
                                        />
                                    ) : (
                                        <span className="info-value">{profile.department || "Not provided"}</span>
                                    )}
                                </div>

                                {isOwnProfile && (
                                    <div className="profile-info-row">
                                        <span className="info-label">Address:</span>
                                        {editMode.company ? (
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                value={formData.address}
                                                onChange={(e) => handleChange("address", e.target.value)}
                                                placeholder="Enter company address"
                                            />
                                        ) : (
                                            <span className="info-value">{profile.address || "Not provided"}</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {editMode.company && (
                                <div className="mt-3 d-flex gap-2">
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleSave("company")}
                                    >
                                        <i className="fi-rr-check me-1"></i> Save
                                    </button>
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => handleCancel("company")}
                                    >
                                        <i className="fi-rr-cross me-1"></i> Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Account Activity */}
                {isOwnProfile && (
                    <>
                        <hr className="my-4" />
                        <h5 className="mb-4">
                            <i className="fi-rr-time-forward me-2"></i> Account Activity
                        </h5>

                        <div className="profile-overview-grid">
                            <div className="profile-info-row">
                                <span className="info-label">Created:</span>
                                <span className="info-value">
                                    {new Date(profile.createdAt || profile.createdDate).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>

                            <div className="profile-info-row">
                                <span className="info-label">Last Updated:</span>
                                <span className="info-value">
                                    {new Date(profile.updatedAt || profile.lastModifiedDate).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>        </div>
    );
}