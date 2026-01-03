/**
 * User management types for admin dashboard
 * Corresponds to backend DTOs from user-service
 */

/**
 * Basic user information returned by PostgreSQL queries
 * Maps to UserBaseResponse from backend
 */
export interface UserListItem {
    userId: string;
    username: string;
    email: string;
    fullName?: string;
    phoneNumber?: string;
    avatarUrl?: string;
    role: UserRole;
    status: UserStatus;
    blocked: boolean;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    // HR/HR_MANAGER specific fields
    department?: string;
    address?: string;
    companyId?: string;
    companyNo?: string;
    companyName?: string;
}

/**
 * User roles in the system
 */
export enum UserRole {
    ADMIN = 'ADMIN',
    HR_MANAGER = 'HR_MANAGER',
    HR = 'HR',
    CANDIDATE = 'CANDIDATE'
}

/**
 * User account status
 */
export enum UserStatus {
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
    DELETED = 'DELETED',
    PENDING = 'PENDING'
}

/**
 * Search filters for user queries
 * Used with both PostgreSQL and Elasticsearch endpoints
 */
export interface UserSearchFilters {
    query?: string;              // Full-text search (Elasticsearch only)
    keyword?: string;            // Simple keyword search (PostgreSQL)
    role?: string;               // Filter by role
    status?: string;             // Filter by status
    blocked?: boolean;           // Filter by blocked status
    includeDeleted?: boolean;    // Include deleted users
    companyNo?: string;          // Filter by company number (HR multi-tenancy)
    companyName?: string;        // Filter by company name
    createdAfter?: string;       // Date range start (ISO 8601)
    createdBefore?: string;      // Date range end (ISO 8601)
    page?: number;               // Page number (0-based)
    size?: number;               // Page size (default: 10)
    sortField?: string;          // Sort field (default: createdAt)
    sortOrder?: 'asc' | 'desc';  // Sort order (default: desc)
}

/**
 * Elasticsearch search request
 * Maps to UserSearchRequest from backend
 */
export interface UserSearchRequest {
    query?: string;
    role?: string;
    status?: string;
    blocked?: boolean;
    includeDeleted?: boolean;
    companyNo?: string;          // Filter by company number
    companyName?: string;        // Filter by company name
    createdAfter?: string;
    createdBefore?: string;
    from: number;                // Offset for pagination
    size: number;                // Number of results
    sortField: string;
    sortOrder: 'asc' | 'desc';
    includeAggregations: boolean; // Include role/status counts
}

/**
 * User search hit from Elasticsearch
 * Extends UserListItem with search-specific fields
 */
export interface UserSearchHit extends UserListItem {
    score: number;                           // Relevance score
    highlights: Record<string, string[]>;    // Highlighted matched terms
}

/**
 * Elasticsearch search response
 * Maps to UserSearchResponse from backend
 */
export interface UserSearchResponse {
    hits: UserSearchHit[];
    totalHits: number;
    from: number;
    size: number;
    roleAggregations?: Record<string, number>;   // Count by role
    statusAggregations?: Record<string, number>; // Count by status
}

/**
 * Pagination response wrapper
 * Generic type for paginated lists from PostgreSQL
 */
export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;           // Current page (0-based)
    numberOfElements: number; // Items in current page
    first: boolean;
    last: boolean;
    empty: boolean;
}

/**
 * Standard API response wrapper
 * Maps to ResponseData<T> from backend
 */
export interface ResponseData<T> {
    success: boolean;
    status: number;
    message?: string;
    data?: T;
    error?: string;
    timestamp?: string;
}

/**
 * Bulk reindex request
 */
export interface ReindexRequest {
    batchSize?: number; // Default: 100
}

/**
 * Reindex job response
 */
export interface ReindexJobResponse {
    jobId: string;
    status: 'COMPLETED' | 'FAILED' | 'RUNNING';
    totalUsers: number;
    processedUsers: number;
    failedUsers: number;
    startTime: string;
    endTime?: string;
    durationMs?: number;
    errorMessage?: string;
}

/**
 * Full user profile (role-specific)
 * Can be CandidateResponse | HRResponse | AdminResponse
 */
export interface FullUserProfile {
    // Base user info
    userId: string;
    username: string;
    email: string;
    fullName?: string;
    phoneNumber?: string;
    role: UserRole;
    status: UserStatus;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;

    // Role-specific data (varies by role)
    [key: string]: any;
}

/**
 * User action types for UI
 */
export enum UserAction {
    VIEW_DETAILS = 'VIEW_DETAILS',
    BLOCK = 'BLOCK',
    UNBLOCK = 'UNBLOCK',
    DELETE = 'DELETE',
    VIEW_FULL_PROFILE = 'VIEW_FULL_PROFILE'
}

/**
 * User table column configuration
 */
export interface UserTableColumn {
    key: string;
    label: string;
    sortable: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
    render?: (value: any, user: UserListItem) => React.ReactNode;
}
