// Settings-related TypeScript interfaces

// Notification Settings - Match backend structure
export interface EmailNotificationSettings {
    jobAlerts: boolean;
    applicationUpdates: boolean;
    messages: boolean;
    newsletter: boolean;
    marketingEmails: boolean;
    securityAlerts: boolean;
}

export interface PushNotificationSettings {
    jobAlerts: boolean;
    applicationUpdates: boolean;
    messages: boolean;
    reminders: boolean;
}

export interface SmsNotificationSettings {
    jobAlerts: boolean;
    securityAlerts: boolean;
    importantUpdates: boolean;
}

export interface NotificationSettings {
    email: EmailNotificationSettings;
    push: PushNotificationSettings;
    sms: SmsNotificationSettings;
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
    qrCodeUrl?: string; // For TOTP (data URI)
    method?: string; // The enabled method
    message?: string; // Success message
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
