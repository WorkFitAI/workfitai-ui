"use client";

import { useEffect, useState } from "react";
import { monitoringApi, UserActivityEntry, ActivitySummary } from "@/lib/monitoringApi";
import { showToast } from "@/lib/toast";
import { useAppSelector } from "@/redux/hooks";
import { selectUserRole } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import "./user-activity.scss";

// Helper to get user role display name
const getRoleDisplayName = (roles?: string) => {
    if (!roles) return "User";
    if (roles.includes("HR_MANAGER")) return "HR Manager";
    if (roles.includes("HR")) return "HR";
    if (roles.includes("CANDIDATE")) return "Candidate";
    if (roles.includes("ADMIN")) return "Admin";
    return "User";
};

// Helper to get role class
const getRoleClass = (roles?: string) => {
    if (!roles) return "candidate";
    if (roles.includes("HR_MANAGER")) return "hr-manager";
    if (roles.includes("HR")) return "hr";
    if (roles.includes("ADMIN")) return "admin";
    return "candidate";
};

// Helper to extract user-friendly action from log entry
const getActionDescription = (activity: UserActivityEntry): string => {
    const path = activity.path?.toLowerCase() || "";
    const method = activity.method;
    const message = activity.action;

    // Authentication
    if (path.includes("/login") || message.includes("login")) {
        if (activity.level === "ERROR") return "Login failed";
        return "Logged in";
    }
    if (path.includes("/logout") || message.includes("logout")) return "Logged out";
    if (path.includes("/register")) {
        if (activity.level === "ERROR") return "Registration failed";
        return "Registered account";
    }
    if (path.includes("/verify")) return "Verified account";
    if (path.includes("/forgot-password")) return "Requested password reset";
    if (path.includes("/reset-password")) return "Reset password";

    // Profile
    if (path.includes("/profile")) {
        if (method === "PUT" || method === "PATCH") return "Updated profile";
        if (method === "GET") return "Viewed profile";
        return "Profile action";
    }

    // Job-related
    if (path.includes("/job")) {
        if (method === "POST") return "Created job posting";
        if (method === "PUT" || method === "PATCH") return "Updated job posting";
        if (method === "DELETE") return "Deleted job posting";
        if (path.includes("/approve")) return "Approved job posting";
        if (method === "GET") return "Viewed jobs";
        return "Job action";
    }

    // Application-related
    if (path.includes("/application")) {
        if (method === "POST") return "Submitted application";
        if (method === "PUT" || method === "PATCH") return "Updated application";
        if (method === "DELETE") return "Withdrew application";
        if (path.includes("/approve")) return "Approved application";
        if (path.includes("/reject")) return "Rejected application";
        if (method === "GET") return "Viewed applications";
        return "Application action";
    }

    // CV-related
    if (path.includes("/cv") || path.includes("/resume")) {
        if (method === "POST") return "Uploaded CV";
        if (method === "PUT" || method === "PATCH") return "Updated CV";
        if (method === "DELETE") return "Deleted CV";
        if (method === "GET") return "Viewed CV";
        return "CV action";
    }

    // User management
    if (path.includes("/user")) {
        if (path.includes("/block")) return "Blocked user";
        if (path.includes("/unblock")) return "Unblocked user";
        if (path.includes("/delete")) return "Deleted user";
        if (path.includes("/approve")) return "Approved user";
        if (method === "PUT" || method === "PATCH") return "Updated user";
        if (method === "GET") return "Viewed user details";
        return "User management action";
    }

    // HR-related
    if (path.includes("/approval") || path.includes("/approve")) {
        return "Approval action";
    }

    // Notification
    if (path.includes("/notification")) {
        if (method === "GET") return "Checked notifications";
        if (method === "PUT" || method === "PATCH") return "Updated notification settings";
        return "Notification action";
    }

    // Default - show cleaner action
    const cleanPath = path.split("?")[0].split("/").filter(p => p).pop() || "page";
    if (method) {
        return `${method} /${cleanPath}`;
    }
    return message && message.length < 100 ? message : "User action";
};

export default function UserActivityPage() {
    const router = useRouter();
    const userRole = useAppSelector(selectUserRole);

    const [activities, setActivities] = useState<UserActivityEntry[]>([]);
    const [summary, setSummary] = useState<ActivitySummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [mounted, setMounted] = useState(false);

    // User statistics
    const [stats, setStats] = useState({
        activeUsers: 0,
        totalActions: 0,
        errorActions: 0,
        successRate: 100,
    });

    // Filters
    const [usernameFilter, setUsernameFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [timeRange, setTimeRange] = useState("24"); // hours

    // Set mounted state
    useEffect(() => {
        setMounted(true);
    }, []);

    // Redirect if not admin
    useEffect(() => {
        if (mounted && userRole && userRole !== "ADMIN") {
            router.replace("/");
        }
    }, [mounted, userRole, router]);

    useEffect(() => {
        fetchActivities();
        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            fetchActivities(true);
        }, 30000);
        return () => clearInterval(interval);
    }, [page, usernameFilter, roleFilter, timeRange]);

    const fetchActivities = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const fromTime = new Date(Date.now() - parseInt(timeRange) * 60 * 60 * 1000).toISOString();

            const response = await monitoringApi.getUserActivity({
                username: usernameFilter || undefined,
                from: fromTime,
                includeSummary: true,
                page,
                size: 20,
            });

            let filteredActivities = response.activities || [];

            // Apply role filter on frontend
            if (roleFilter) {
                filteredActivities = filteredActivities.filter((activity) =>
                    activity.roles?.includes(roleFilter)
                );
            }

            setActivities(filteredActivities);
            setSummary(response.summary || null);
            setTotal(response.total);
            setTotalPages(response.totalPages);

            // Calculate statistics
            const activeUsersSet = new Set(filteredActivities.map((a) => a.username));
            const errorCount = filteredActivities.filter(
                (a) => a.isError || a.level === "ERROR"
            ).length;
            const successRate =
                filteredActivities.length > 0
                    ? ((filteredActivities.length - errorCount) / filteredActivities.length) * 100
                    : 100;

            setStats({
                activeUsers: activeUsersSet.size,
                totalActions: filteredActivities.length,
                errorActions: errorCount,
                successRate: Math.round(successRate),
            });
        } catch (error: any) {
            if (!silent) {
                showToast.error("Failed to load user activities");
            }
            console.error(error);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const clearFilters = () => {
        setUsernameFilter("");
        setRoleFilter("");
        setTimeRange("24");
        setPage(0);
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;

        return date.toLocaleDateString();
    };

    // Get role distribution from activities
    const getRoleDistribution = () => {
        const distribution: Record<string, number> = {};
        activities.forEach((activity) => {
            const role = getRoleDisplayName(activity.roles);
            distribution[role] = (distribution[role] || 0) + 1;
        });
        return distribution;
    };

    // Get action type distribution
    const getActionDistribution = () => {
        const distribution: Record<string, number> = {};
        activities.forEach((activity) => {
            const action = getActionDescription(activity);
            const category = action.split(" ")[0]; // Get first word as category
            distribution[category] = (distribution[category] || 0) + 1;
        });
        return Object.entries(distribution)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    };

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="user-activity-page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (userRole !== "ADMIN") {
        return null;
    }

    const roleDistribution = getRoleDistribution();
    const actionDistribution = getActionDistribution();

    return (
        <div className="user-activity-page">
            {/* Statistics Cards */}
            <div className="stats-section">
                <div className="row">
                    <div className="col-lg-3 col-md-6 mb-3">
                        <div className="stat-card">
                            <div className="stat-icon primary">
                                <i className="fi-rr-users"></i>
                            </div>
                            <div className="stat-label">Active Users</div>
                            <h2 className="stat-value">{stats.activeUsers}</h2>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">
                        <div className="stat-card">
                            <div className="stat-icon success">
                                <i className="fi-rr-chart-histogram"></i>
                            </div>
                            <div className="stat-label">Total Actions</div>
                            <h2 className="stat-value">{stats.totalActions}</h2>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">
                        <div className="stat-card">
                            <div className="stat-icon danger">
                                <i className="fi-rr-exclamation"></i>
                            </div>
                            <div className="stat-label">Error Actions</div>
                            <h2 className="stat-value">{stats.errorActions}</h2>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">
                        <div className="stat-card">
                            <div className="stat-icon warning">
                                <i className="fi-rr-chart-pie"></i>
                            </div>
                            <div className="stat-label">Success Rate</div>
                            <h2 className="stat-value">{stats.successRate}%</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Insights */}
            <div className="insights-section">
                <h4 className="section-title">
                    <i className="fi-rr-stats"></i>
                    Activity Insights
                </h4>
                <div className="insight-grid">
                    {/* Role Distribution */}
                    <div className="insight-card">
                        <div className="insight-title">Activity by Role</div>
                        {Object.entries(roleDistribution).map(([role, count]) => {
                            const percentage =
                                stats.totalActions > 0 ? (count / stats.totalActions) * 100 : 0;
                            return (
                                <div key={role} className="insight-item">
                                    <div className="item-label">
                                        <span className={`role-badge ${getRoleClass(role)}`}>
                                            {role}
                                        </span>
                                    </div>
                                    <div className="item-bar">
                                        <div
                                            className="bar-fill"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="item-value">{count}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Top Actions */}
                    <div className="insight-card">
                        <div className="insight-title">Top Actions</div>
                        {actionDistribution.map(([action, count]) => {
                            const percentage =
                                stats.totalActions > 0 ? (count / stats.totalActions) * 100 : 0;
                            return (
                                <div key={action} className="insight-item">
                                    <div className="item-label">{action}</div>
                                    <div className="item-bar">
                                        <div
                                            className="bar-fill"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="item-value">{count}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="filter-header">
                    <h5>
                        <i className="fi-rr-filter"></i>
                        Filters
                    </h5>
                    <span className="clear-filters" onClick={clearFilters}>
                        Clear all filters
                    </span>
                </div>
                <div className="filter-grid">
                    <div className="filter-item">
                        <label>Username / Email</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by username..."
                            value={usernameFilter}
                            onChange={(e) => {
                                setUsernameFilter(e.target.value);
                                setPage(0);
                            }}
                        />
                    </div>

                    <div className="filter-item">
                        <label>User Role</label>
                        <select
                            className="form-select"
                            value={roleFilter}
                            onChange={(e) => {
                                setRoleFilter(e.target.value);
                                setPage(0);
                            }}
                        >
                            <option value="">All Roles</option>
                            <option value="CANDIDATE">Candidate</option>
                            <option value="HR">HR</option>
                            <option value="HR_MANAGER">HR Manager</option>
                        </select>
                    </div>

                    <div className="filter-item">
                        <label>Time Range</label>
                        <select
                            className="form-select"
                            value={timeRange}
                            onChange={(e) => {
                                setTimeRange(e.target.value);
                                setPage(0);
                            }}
                        >
                            <option value="1">Last Hour</option>
                            <option value="6">Last 6 Hours</option>
                            <option value="24">Last 24 Hours</option>
                            <option value="72">Last 3 Days</option>
                            <option value="168">Last Week</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Activity Table */}
            <div className="activity-table-section">
                <div className="table-header">
                    <h5>
                        Recent Activities <span className="count">({total})</span>
                    </h5>
                    <button
                        className="refresh-btn"
                        onClick={() => fetchActivities()}
                        disabled={loading}
                    >
                        <i className="fi-rr-refresh"></i>
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading activities...</p>
                    </div>
                ) : activities.length === 0 ? (
                    <div className="empty-state">
                        <i className="fi-rr-document"></i>
                        <h5>No Activities Found</h5>
                        <p>Try adjusting your filters or check back later</p>
                    </div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>User</th>
                                        <th>Role</th>
                                        <th>Action</th>
                                        <th>Result</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activities.map((activity) => {
                                        const isError = activity.isError || activity.level === "ERROR";
                                        const isWarning = activity.level === "WARN";

                                        return (
                                            <tr
                                                key={activity.id}
                                                className={
                                                    isError
                                                        ? "error-row"
                                                        : isWarning
                                                            ? "warning-row"
                                                            : ""
                                                }
                                            >
                                                <td className="time-cell">
                                                    <span className="relative-time">
                                                        {formatTimestamp(activity.timestamp)}
                                                    </span>
                                                    <span className="absolute-time">
                                                        {new Date(activity.timestamp).toLocaleTimeString()}
                                                    </span>
                                                </td>
                                                <td className="user-cell">
                                                    <span className="user-name">{activity.username}</span>
                                                </td>
                                                <td>
                                                    <span className={`user-role ${getRoleClass(activity.roles)}`}>
                                                        {getRoleDisplayName(activity.roles)}
                                                    </span>
                                                </td>
                                                <td className="action-cell">
                                                    <div className="action-text">
                                                        {isError && (
                                                            <i className="fi-rr-cross-circle error-icon"></i>
                                                        )}
                                                        {isWarning && (
                                                            <i className="fi-rr-exclamation warning-icon"></i>
                                                        )}
                                                        {!isError && !isWarning && (
                                                            <i className="fi-rr-check-circle success-icon"></i>
                                                        )}
                                                        <span>{getActionDescription(activity)}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`status-badge ${isError
                                                            ? "error"
                                                            : isWarning
                                                                ? "warning"
                                                                : "success"
                                                            }`}
                                                    >
                                                        {isError ? "Failed" : isWarning ? "Warning" : "Success"}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="table-footer">
                                <div className="pagination-wrapper">
                                    <div className="page-info">
                                        Page {page + 1} of {totalPages}
                                    </div>
                                    <div className="pagination-controls">
                                        <button
                                            onClick={() => setPage(Math.max(0, page - 1))}
                                            disabled={page === 0 || loading}
                                        >
                                            <i className="fi-rr-angle-left"></i>
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                            disabled={page >= totalPages - 1 || loading}
                                        >
                                            Next
                                            <i className="fi-rr-angle-right"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
