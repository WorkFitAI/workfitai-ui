// Profile-related TypeScript interfaces

import { UserRole } from "./auth";

// User Profile
export interface UserProfile {
    userId: string;
    username: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    role: UserRole;
    userStatus: "PENDING" | "WAIT_APPROVED" | "ACTIVE" | "INACTIVE";
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;

    // Company info (for HR/HR_MANAGER only)
    companyId?: string;
    companyNo?: string;
    companyName?: string;
    department?: string;
    address?: string;
}

// Avatar Upload
export interface AvatarUploadResponse {
    avatarUrl: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
}

export interface AvatarInfo {
    avatarUrl: string;
    publicId: string;
}

// Profile Update
export interface UpdateProfileRequest {
    fullName?: string;
    phoneNumber?: string;
    department?: string;
    address?: string;
}

// Account Actions
export interface DeactivateAccountRequest {
    reason: "TAKING_A_BREAK" | "FOUND_JOB" | "PRIVACY_CONCERNS" | "OTHER";
    feedback?: string;
    password: string;
}

export interface DeactivateAccountResponse {
    deactivatedAt: string;
    deleteScheduledAt: string;
}

export interface DeleteAccountRequest {
    password: string;
    reason?: string;
    feedback?: string;
}

export interface DeleteAccountResponse {
    deletionScheduledAt: string;
    cancellationDeadline: string;
}
