import { monitoringClient } from "@/lib/axios-client";
import type { AxiosError } from "axios";

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
  action?: string;
  requestId?: string;
  level: string;
  isError: boolean;
  logType?: string;
  message?: string;
  displayMessage: string;
  relativeTime: string;
  icon?: string;
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
  extra?: Record<string, unknown>;
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

// Generic request wrapper using axios client
async function monitoringRequest<T>(
  endpoint: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  try {
    const response = await monitoringClient.request<T>({
      url: endpoint,
      method: options.method || "GET",
      data: options.body,
    });

    // Handle 204 No Content
    if (response.status === 204) {
      return null as T;
    }

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message ||
        axiosError.message ||
        "Request failed"
    );
  }
}

export const monitoringApi = {
  /**
   * Get user activities for admin dashboard
   */
  getUserActivities: async (params: {
    username?: string;
    role?: string;
    hours?: number;
    page?: number;
    size?: number;
  }): Promise<UserActivityResponse> => {
    const queryParams = new URLSearchParams();
    if (params.username) queryParams.append("username", params.username);
    if (params.role) queryParams.append("role", params.role);
    if (params.hours !== undefined)
      queryParams.append("hours", String(params.hours));
    if (params.page !== undefined)
      queryParams.append("page", String(params.page));
    if (params.size !== undefined)
      queryParams.append("size", String(params.size));

    const response = await monitoringRequest<
      ResponseData<UserActivityResponse>
    >(`/api/admin/user-activities?${queryParams.toString()}`);

    return (
      response.data || {
        total: 0,
        page: 0,
        size: 0,
        totalPages: 0,
        activities: [],
      }
    );
  },

  /**
   * Get user activity (deprecated - use getUserActivities)
   * @deprecated Use getUserActivities instead
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
    if (params.page !== undefined)
      queryParams.append("page", String(params.page));
    if (params.size !== undefined)
      queryParams.append("size", String(params.size));

    return monitoringRequest<UserActivityResponse>(
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
    if (params.page !== undefined)
      queryParams.append("page", String(params.page));
    if (params.size !== undefined)
      queryParams.append("size", String(params.size));

    return monitoringRequest<UserActivityResponse>(
      `/api/logs/activity/user/${username}?${queryParams.toString()}`
    );
  },

  /**
   * Get currently active/online users
   */
  getOnlineUsers: async (
    minutes: number = 15
  ): Promise<UserActivityResponse> => {
    return monitoringRequest<UserActivityResponse>(
      `/api/admin/online-users?minutes=${minutes}`
    );
  },

  /**
   * Get activity summary statistics
   */
  getActivitySummary: async (hours: number = 24): Promise<ActivitySummary> => {
    const response = await monitoringRequest<ResponseData<ActivitySummary>>(
      `/api/admin/activity-summary?hours=${hours}`
    );

    return (
      response.data || {
        activeUsers: 0,
        totalActions: 0,
        errorCount: 0,
      }
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
      params.levels.forEach((l) => queryParams.append("levels", l));
    }
    if (params.username) queryParams.append("username", params.username);
    if (params.requestId) queryParams.append("requestId", params.requestId);
    if (params.from) queryParams.append("from", params.from);
    if (params.to) queryParams.append("to", params.to);
    if (params.traceId) queryParams.append("traceId", params.traceId);
    if (params.page !== undefined)
      queryParams.append("page", String(params.page));
    if (params.size !== undefined)
      queryParams.append("size", String(params.size));

    return monitoringRequest<LogSearchResponse>(
      `/api/logs/search?${queryParams.toString()}`
    );
  },

  /**
   * Get log statistics
   */
  getStatistics: async (hours: number = 24): Promise<LogStatistics> => {
    return monitoringRequest<LogStatistics>(`/api/logs/stats?hours=${hours}`);
  },

  /**
   * Get recent errors
   */
  getRecentErrors: async (minutes: number = 15): Promise<LogEntry[]> => {
    return monitoringRequest<LogEntry[]>(
      `/api/logs/errors/recent?minutes=${minutes}`
    );
  },

  /**
   * Get logs by trace ID
   */
  getLogsByTraceId: async (traceId: string): Promise<LogEntry[]> => {
    return monitoringRequest<LogEntry[]>(`/api/logs/trace/${traceId}`);
  },
};
