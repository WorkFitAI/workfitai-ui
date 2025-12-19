import {
    handle401WithTokenRefresh,
    getCurrentAccessToken,
} from "./tokenRefreshHandler";

const MONITORING_API_URL = process.env.NEXT_PUBLIC_MONITORING_API_URL || "http://localhost:9085/monitoring";

interface ResponseData<T> {
    status: number;
    message?: string;
    data?: T;
    timestamp?: string;
    source?: string;
}

export interface UserActivityEntry {
    id: string;
    timestamp: string;
    username: string;
    roles?: string;
    service: string;
    method?: string;
    path?: string;
    action: string;
    requestId?: string;
    level: string;
    isError?: boolean;
}

export interface ActivitySummary {
    activeUsers: number;
    totalActions: number;
    errorCount: number;
    actionsByUser?: Record<string, number>;
    actionsByService?: Record<string, number>;
    topActions?: Record<string, number>;
}

export interface UserActivityResponse {
    total: number;
    page: number;
    size: number;
    totalPages: number;
    activities: UserActivityEntry[];
    summary?: ActivitySummary;
}

export interface LogEntry {
    id: string;
    timestamp: string;
    level: string;
    service: string;
    logger?: string;
    message: string;
    thread?: string;
    method?: string;
    path?: string;
    requestId?: string;
    userId?: string;
    username?: string;
    roles?: string;
    traceId?: string;
    spanId?: string;
    exception?: string;
    stackTrace?: string;
    extra?: Record<string, any>;
}

export interface LogSearchResponse {
    total: number;
    page: number;
    size: number;
    totalPages: number;
    logs: LogEntry[];
}

export interface LogStatistics {
    totalLogs: number;
    errorCount: number;
    warnCount: number;
    infoCount: number;
    debugCount: number;
    logsByService: Record<string, number>;
    logsByLevel: Record<string, number>;
    recentErrors: LogEntry[];
}

async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const accessToken = getCurrentAccessToken();

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    const response = await fetch(`${MONITORING_API_URL}${endpoint}`, config);

    // Handle 401 Unauthorized - attempt token refresh
    if (response.status === 401) {
        const refreshed = await handle401WithTokenRefresh();
        if (refreshed) {
            // Retry request with new token
            const newToken = getCurrentAccessToken();
            if (newToken) {
                headers["Authorization"] = `Bearer ${newToken}`;
                const retryResponse = await fetch(`${MONITORING_API_URL}${endpoint}`, {
                    ...config,
                    headers,
                });
                if (!retryResponse.ok) {
                    throw new Error(`HTTP error! status: ${retryResponse.status}`);
                }
                return retryResponse.json();
            }
        }
        throw new Error("Unauthorized - please login again");
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message ||
            `API request failed: ${response.status} ${response.statusText}`
        );
    }

    return response.json();
}

export const monitoringApi = {
    /**
     * Get user activity for admin dashboard
     */
    getUserActivity: async (params: {
        username?: string;
        service?: string;
        from?: string;
        to?: string;
        includeSummary?: boolean;
        page?: number;
        size?: number;
    }): Promise<UserActivityResponse> => {
        const queryParams = new URLSearchParams();
        if (params.username) queryParams.append("username", params.username);
        if (params.service) queryParams.append("service", params.service);
        if (params.from) queryParams.append("from", params.from);
        if (params.to) queryParams.append("to", params.to);
        if (params.includeSummary !== undefined) {
            queryParams.append("includeSummary", String(params.includeSummary));
        }
        if (params.page !== undefined) queryParams.append("page", String(params.page));
        if (params.size !== undefined) queryParams.append("size", String(params.size));

        return apiRequest<UserActivityResponse>(
            `/api/logs/activity?${queryParams.toString()}`
        );
    },

    /**
     * Get activity for a specific user
     */
    getUserActivityByUsername: async (
        username: string,
        params: {
            from?: string;
            to?: string;
            hours?: number;
            page?: number;
            size?: number;
        } = {}
    ): Promise<UserActivityResponse> => {
        const queryParams = new URLSearchParams();
        if (params.from) queryParams.append("from", params.from);
        if (params.to) queryParams.append("to", params.to);
        if (params.hours) queryParams.append("hours", String(params.hours));
        if (params.page !== undefined) queryParams.append("page", String(params.page));
        if (params.size !== undefined) queryParams.append("size", String(params.size));

        return apiRequest<UserActivityResponse>(
            `/api/logs/activity/user/${username}?${queryParams.toString()}`
        );
    },

    /**
     * Get currently active/online users
     */
    getOnlineUsers: async (minutes: number = 15): Promise<UserActivityResponse> => {
        return apiRequest<UserActivityResponse>(
            `/api/logs/activity/online?minutes=${minutes}`
        );
    },

    /**
     * Search logs with advanced filters
     */
    searchLogs: async (params: {
        query?: string;
        service?: string;
        level?: string;
        levels?: string[];
        username?: string;
        requestId?: string;
        from?: string;
        to?: string;
        traceId?: string;
        page?: number;
        size?: number;
    }): Promise<LogSearchResponse> => {
        const queryParams = new URLSearchParams();
        if (params.query) queryParams.append("query", params.query);
        if (params.service) queryParams.append("service", params.service);
        if (params.level) queryParams.append("level", params.level);
        if (params.levels) {
            params.levels.forEach(l => queryParams.append("levels", l));
        }
        if (params.username) queryParams.append("username", params.username);
        if (params.requestId) queryParams.append("requestId", params.requestId);
        if (params.from) queryParams.append("from", params.from);
        if (params.to) queryParams.append("to", params.to);
        if (params.traceId) queryParams.append("traceId", params.traceId);
        if (params.page !== undefined) queryParams.append("page", String(params.page));
        if (params.size !== undefined) queryParams.append("size", String(params.size));

        return apiRequest<LogSearchResponse>(
            `/api/logs/search?${queryParams.toString()}`
        );
    },

    /**
     * Get log statistics
     */
    getStatistics: async (hours: number = 24): Promise<LogStatistics> => {
        return apiRequest<LogStatistics>(`/api/logs/stats?hours=${hours}`);
    },

    /**
     * Get recent errors
     */
    getRecentErrors: async (minutes: number = 15): Promise<LogEntry[]> => {
        return apiRequest<LogEntry[]>(`/api/logs/errors/recent?minutes=${minutes}`);
    },

    /**
     * Get logs by trace ID
     */
    getLogsByTraceId: async (traceId: string): Promise<LogEntry[]> => {
        return apiRequest<LogEntry[]>(`/api/logs/trace/${traceId}`);
    },
};
