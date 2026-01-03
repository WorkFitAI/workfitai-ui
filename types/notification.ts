export type NotificationType =
    | "account_activated"
    | "account_approved"
    | "account_pending_approval"
    | "password_changed"
    | "application_submitted"
    | "application_viewed"
    | "application_status_changed"
    | "application_accepted"
    | "application_rejected"
    | "job_posted"
    | "job_expired"
    | "job_matching"
    | "new_applicant"
    | "cv_viewed"
    | "cv_downloaded"
    | "cv_analysis_complete"
    | "system_announcement"
    | "general";

export interface Notification {
    id: string;
    userId: string;
    userEmail: string;
    type: NotificationType;
    title: string;
    message: string;
    actionUrl?: string;
    data?: Record<string, any>;
    sourceService?: string;
    referenceId?: string;
    referenceType?: string;
    read: boolean;
    readAt?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface NotificationPage {
    content: Notification[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface UnreadCountResponse {
    count: number;
}
