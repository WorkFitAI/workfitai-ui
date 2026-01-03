// Profile-related TypeScript interfaces

import { UserRole } from "./auth";

// User Profile
export interface UserProfile {
    userId: string;
    username: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    userRole: UserRole; // API returns userRole
    role?: UserRole; // For backward compatibility
    userStatus: "PENDING" | "WAIT_APPROVED" | "ACTIVE" | "INACTIVE";
    avatarUrl?: string | null;
    createdDate: string; // API returns createdDate
    createdAt?: string; // For backward compatibility
    lastModifiedDate: string; // API returns lastModifiedDate
    updatedAt?: string; // For backward compatibility

    // Company info (for HR/HR_MANAGER only)
    companyId?: string;
    companyNo?: string;
    companyName?: string;
    department?: string;
    address?: string;

    // Additional fields from API
    careerObjective?: string | null;
    summary?: string | null;
    totalExperience?: number;
    education?: string | null;
    certifications?: string | null;
    portfolioLink?: string | null;
    linkedinUrl?: string | null;
    githubUrl?: string | null;
    expectedPosition?: string | null;
    twoFactorEnabled?: boolean;
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
