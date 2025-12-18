"use client";

import { useEffect, useState } from "react";
import { monitoringApi, UserActivityEntry, ActivitySummary } from "@/lib/monitoringApi";
import { showToast } from "@/lib/toast";
import { useAppSelector } from "@/redux/hooks";
import { selectUserRole } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import RecentErrors from "@/components/monitoring/RecentErrors";
import ActivityInsights from "@/components/monitoring/ActivityInsights";

export default function UserActivityPage() {
    const router = useRouter();
    const userRole = useAppSelector(selectUserRole);

    const [activities, setActivities] = useState<UserActivityEntry[]>([]);
    const [summary, setSummary] = useState<ActivitySummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);

    // Filters
    const [usernameFilter, setUsernameFilter] = useState("");
    const [serviceFilter, setServiceFilter] = useState("");
    const [levelFilter, setLevelFilter] = useState("");
    const [timeRange, setTimeRange] = useState("24"); // hours

    // Redirect if not admin
    useEffect(() => {
        if (userRole && userRole !== "ADMIN") {
            router.replace("/");
        }
    }, [userRole, router]);

    useEffect(() => {
        fetchActivities();
        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            fetchActivities(true);
        }, 30000);
        return () => clearInterval(interval);
    }, [page, usernameFilter, serviceFilter, levelFilter, timeRange]);

    const fetchActivities = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const fromTime = new Date(Date.now() - parseInt(timeRange) * 60 * 60 * 1000).toISOString();

            const response = await monitoringApi.getUserActivity({
                username: usernameFilter || undefined,
                service: serviceFilter || undefined,
                from: fromTime,
                includeSummary: true,
                page,
                size: 50,
            });

            setActivities(response.activities || []);
            setSummary(response.summary || null);
            setTotal(response.total);
            setTotalPages(response.totalPages);
        } catch (error: any) {
            if (!silent) {
                showToast.error("Failed to load user activities");
            }
            console.error(error);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const handleFilterChange = () => {
        setPage(0);
    };

    const getActivityBadgeClass = (level?: string, isError?: boolean) => {
        if (isError || level === "ERROR") return "badge bg-danger";
        if (level === "WARN") return "badge bg-warning";
        return "badge bg-success";
    };

    const getServiceBadgeClass = (service: string) => {
        const colors: Record<string, string> = {
            "auth-service": "bg-primary",
            "user-service": "bg-info",
            "job-service": "bg-success",
            "application-service": "bg-warning",
            "cv-service": "bg-secondary",
        };
        return `badge ${colors[service] || "bg-dark"}`;
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;

        return date.toLocaleString();
    };

    if (userRole !== "ADMIN") {
        return null;
    }

    return (
        <div className="box-content">
            <div className="box-heading">
                <div className="box-title">
                    <h3 className="mb-35">User Activity Monitor</h3>
                </div>
            </div>

            {/* Alerts & Warnings Section */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card card-style-1">
                        <div className="card-header bg-danger text-white">
                            <h5 className="mb-0">
                                <i className="fi-rr-exclamation-triangle me-2"></i>
                                Recent Errors & Alerts
                            </h5>
                        </div>
                        <div className="card-body p-0">
                            <RecentErrors minutes={15} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Summary */}
            {summary && (
                <div className="row mb-4">
                    <div className="col-lg-3 col-md-6 mb-3">
                        <div className="card card-style-1">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        <p className="text-muted mb-1">Active Users</p>
                                        <h4 className="mb-0">{summary.activeUsers}</h4>
                                    </div>
                                    <div className="avatar-sm">
                                        <span className="avatar-title bg-soft-primary rounded">
                                            <i className="fi-rr-users text-primary"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">
                        <div className="card card-style-1">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        <p className="text-muted mb-1">Total Actions</p>
                                        <h4 className="mb-0">{summary.totalActions}</h4>
                                    </div>
                                    <div className="avatar-sm">
                                        <span className="avatar-title bg-soft-success rounded">
                                            <i className="fi-rr-stats text-success"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">
                        <div className="card card-style-1">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        <p className="text-muted mb-1">Errors</p>
                                        <h4 className="mb-0 text-danger">{summary.errorCount}</h4>
                                    </div>
                                    <div className="avatar-sm">
                                        <span className="avatar-title bg-soft-danger rounded">
                                            <i className="fi-rr-exclamation text-danger"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">
                        <div className="card card-style-1">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        <p className="text-muted mb-1">Services</p>
                                        <h4 className="mb-0">
                                            {summary.actionsByService ? Object.keys(summary.actionsByService).length : 0}
                                        </h4>
                                    </div>
                                    <div className="avatar-sm">
                                        <span className="avatar-title bg-soft-info rounded">
                                            <i className="fi-rr-apps text-info"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Activity Insights */}
            {summary && <ActivityInsights summary={summary} />}

            {/* Filters */}
            <div className="card card-style-1 mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Filter by username"
                                value={usernameFilter}
                                onChange={(e) => {
                                    setUsernameFilter(e.target.value);
                                    handleFilterChange();
                                }}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Service</label>
                            <select
                                className="form-select"
                                value={serviceFilter}
                                onChange={(e) => {
                                    setServiceFilter(e.target.value);
                                    handleFilterChange();
                                }}
                            >
                                <option value="">All Services</option>
                                <option value="auth-service">Auth Service</option>
                                <option value="user-service">User Service</option>
                                <option value="job-service">Job Service</option>
                                <option value="application-service">Application Service</option>
                                <option value="cv-service">CV Service</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Level</label>
                            <select
                                className="form-select"
                                value={levelFilter}
                                onChange={(e) => {
                                    setLevelFilter(e.target.value);
                                    handleFilterChange();
                                }}
                            >
                                <option value="">All Levels</option>
                                <option value="INFO">Info</option>
                                <option value="WARN">Warning</option>
                                <option value="ERROR">Error</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Time Range</label>
                            <select
                                className="form-select"
                                value={timeRange}
                                onChange={(e) => {
                                    setTimeRange(e.target.value);
                                    handleFilterChange();
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
            </div>

            {/* Activity List */}
            <div className="card card-style-1">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Recent Activities ({total})</h5>
                    <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => fetchActivities()}
                        disabled={loading}
                    >
                        <i className="fi-rr-refresh me-1"></i>
                        Refresh
                    </button>
                </div>
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center p-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="text-center p-5">
                            <p className="text-muted">No activities found</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>User</th>
                                        <th>Service</th>
                                        <th>Action</th>
                                        <th>Method</th>
                                        <th>Path</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activities.map((activity) => (
                                        <tr
                                            key={activity.id}
                                            className={activity.isError ? "table-danger" : ""}
                                        >
                                            <td className="text-muted small">
                                                {formatTimestamp(activity.timestamp)}
                                            </td>
                                            <td>
                                                <div>
                                                    <strong>{activity.username}</strong>
                                                    {activity.roles && (
                                                        <div className="small text-muted">
                                                            {activity.roles}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={getServiceBadgeClass(activity.service)}>
                                                    {activity.service}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="text-truncate" style={{ maxWidth: "300px" }}>
                                                    {activity.action}
                                                </div>
                                            </td>
                                            <td>
                                                {activity.method && (
                                                    <span className="badge bg-secondary">
                                                        {activity.method}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="small text-muted">
                                                {activity.path || "-"}
                                            </td>
                                            <td>
                                                <span className={getActivityBadgeClass(activity.level, activity.isError)}>
                                                    {activity.level}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="card-footer">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="text-muted small">
                                Showing page {page + 1} of {totalPages}
                            </div>
                            <div className="btn-group">
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => setPage(Math.max(0, page - 1))}
                                    disabled={page === 0 || loading}
                                >
                                    <i className="fi-rr-angle-left"></i> Previous
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                    disabled={page >= totalPages - 1 || loading}
                                >
                                    Next <i className="fi-rr-angle-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
