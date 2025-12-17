// Settings-related TypeScript interfaces

// Notification Settings
export interface EmailNotificationSettings {
    enabled: boolean;
    newJobMatch: boolean;
    applicationStatus: boolean;
    messages: boolean;
    weeklyDigest: boolean;
    promotions: boolean;
}

export interface PushNotificationSettings {
    enabled: boolean;
    newJobMatch: boolean;
    applicationStatus: boolean;
    messages: boolean;
}

export type NotificationFrequency = "REAL_TIME" | "DAILY_DIGEST" | "WEEKLY_DIGEST" | "NONE";

export interface NotificationSettings {
    emailNotifications: EmailNotificationSettings;
    pushNotifications: PushNotificationSettings;
    frequency: NotificationFrequency;
}

// Privacy Settings
export type ProfileVisibility = "PUBLIC" | "PRIVATE" | "CONNECTIONS_ONLY";

export interface PrivacySettings {
    profileVisibility: ProfileVisibility;
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    allowCvDownload: boolean;
    allowMessaging: boolean;
    showActivityStatus: boolean;
    showOnlineStatus: boolean;
    searchIndexing: boolean;
}

// Security Settings
export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ChangePasswordResponse {
    message: string;
}

export interface Enable2FARequest {
    method: "EMAIL" | "SMS" | "TOTP";
}

export interface Enable2FAResponse {
    twoFactorEnabled: boolean;
    twoFactorMethod: "EMAIL" | "SMS" | "TOTP";
    backupCodes: string[];
    secret?: string; // For TOTP
    qrCode?: string; // For TOTP (data URI)
}

export interface Disable2FARequest {
    password: string;
    code: string;
}

export interface RegenerateBackupCodesRequest {
    password: string;
}

export interface RegenerateBackupCodesResponse {
    backupCodes: string[];
    generatedAt: string;
}

// Active Sessions
export interface SessionInfo {
    sessionId: string;
    deviceId: string;
    deviceName: string;
    ipAddress: string;
    location?: string;
    loginAt: string;
    lastActivityAt: string;
    expiresAt: string;
    isCurrent: boolean;
}

export interface SessionsResponse {
    current: SessionInfo;
    others: SessionInfo[];
}

export interface LogoutSessionResponse {
    message: string;
}

export interface LogoutAllSessionsResponse {
    message: string;
    terminatedCount: number;
}
