"use client";

import { useEffect, useState } from "react";
import {
  monitoringApi,
  UserActivityEntry,
  ActivitySummary,
} from "@/lib/monitoringApi";
import { showToast } from "@/lib/toast";
import { useAppSelector } from "@/redux/hooks";
import { selectUserRole } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import "./user-activity.scss";

// Helper to get user role display name
const getRoleDisplayName = (roles?: string): string => {
  if (!roles) return "User";
  if (roles.includes("HR_MANAGER")) return "HR Manager";
  if (roles.includes("HR")) return "HR";
  if (roles.includes("CANDIDATE")) return "Candidate";
  if (roles.includes("ADMIN")) return "Admin";
  return "User";
};

// Helper to get role class
const getRoleClass = (roles?: string): string => {
  if (!roles) return "candidate";
  if (roles.includes("HR_MANAGER")) return "hr-manager";
  if (roles.includes("HR")) return "hr";
  if (roles.includes("ADMIN")) return "admin";
  return "candidate";
};

export default function UserActivityPage() {
  const router = useRouter();
  const userRole = useAppSelector(selectUserRole);

  const [activities, setActivities] = useState<UserActivityEntry[]>([]);
  const [summary, setSummary] = useState<ActivitySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [mounted, setMounted] = useState(false);

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
    fetchSummary();
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchActivities(true);
      fetchSummary(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [page, usernameFilter, roleFilter, timeRange]);

  const fetchSummary = async (silent = false) => {
    if (!silent) setSummaryLoading(true);
    try {
      const hours = parseInt(timeRange);
      const summaryData = await monitoringApi.getActivitySummary(hours);
      setSummary(summaryData);
    } catch (error: unknown) {
      if (!silent) {
        showToast.error("Failed to load activity summary");
      }
      console.error(error);
    } finally {
      if (!silent) setSummaryLoading(false);
    }
  };

  const fetchActivities = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      // Use new admin endpoint with hours parameter
      const hours = parseInt(timeRange);

      const response = await monitoringApi.getUserActivities({
        username: usernameFilter || undefined,
        role: roleFilter || undefined,
        hours: hours,
        page,
        size: 20,
      });

      const filteredActivities = response.activities || [];

      setActivities(filteredActivities);
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

  const clearFilters = () => {
    setUsernameFilter("");
    setRoleFilter("");
    setTimeRange("24");
    setPage(0);
  };

  const formatAbsoluteTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Calculate success rate from summary
  const getSuccessRate = (): number => {
    if (!summary || summary.totalActions === 0) return 100;
    return Math.round(
      ((summary.totalActions - summary.errorCount) / summary.totalActions) * 100
    );
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

  const actionsByUser = summary?.actionsByUser || {};
  const actionsByService = summary?.actionsByService || {};
  const topActions = summary?.topActions || {};
  const successRate = getSuccessRate();

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
              <h2 className="stat-value">
                {summaryLoading ? (
                  <span className="skeleton">...</span>
                ) : (
                  summary?.activeUsers || 0
                )}
              </h2>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-3">
            <div className="stat-card">
              <div className="stat-icon success">
                <i className="fi-rr-chart-histogram"></i>
              </div>
              <div className="stat-label">Total Actions</div>
              <h2 className="stat-value">
                {summaryLoading ? (
                  <span className="skeleton">...</span>
                ) : (
                  summary?.totalActions || 0
                )}
              </h2>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-3">
            <div className="stat-card">
              <div className="stat-icon danger">
                <i className="fi-rr-exclamation"></i>
              </div>
              <div className="stat-label">Error Actions</div>
              <h2 className="stat-value">
                {summaryLoading ? (
                  <span className="skeleton">...</span>
                ) : (
                  summary?.errorCount || 0
                )}
              </h2>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-3">
            <div className="stat-card">
              <div className="stat-icon warning">
                <i className="fi-rr-chart-pie"></i>
              </div>
              <div className="stat-label">Success Rate</div>
              <h2 className="stat-value">
                {summaryLoading ? (
                  <span className="skeleton">...</span>
                ) : (
                  `${successRate}%`
                )}
              </h2>
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
          {/* Actions by User */}
          <div className="insight-card">
            <div className="insight-title">Activity by User</div>
            {summaryLoading ? (
              <div className="loading-placeholder">Loading...</div>
            ) : Object.keys(actionsByUser).length === 0 ? (
              <div className="empty-placeholder">No data available</div>
            ) : (
              Object.entries(actionsByUser)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([user, count]) => {
                  const percentage =
                    summary && summary.totalActions > 0
                      ? (count / summary.totalActions) * 100
                      : 0;
                  return (
                    <div key={user} className="insight-item">
                      <div className="item-label">
                        <span className="user-badge">{user}</span>
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
                })
            )}
          </div>

          {/* Top Actions */}
          <div className="insight-card">
            <div className="insight-title">Top Actions</div>
            {summaryLoading ? (
              <div className="loading-placeholder">Loading...</div>
            ) : Object.keys(topActions).length === 0 ? (
              <div className="empty-placeholder">No data available</div>
            ) : (
              Object.entries(topActions)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([action, count]) => {
                  const percentage =
                    summary && summary.totalActions > 0
                      ? (count / summary.totalActions) * 100
                      : 0;
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
                })
            )}
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
                    const isError = activity.isError;
                    const isWarning = activity.level === "WARN";

                    return (
                      <tr
                        key={activity.id}
                        className={
                          isError ? "error-row" : isWarning ? "warning-row" : ""
                        }
                      >
                        <td className="time-cell">
                          <span className="relative-time">
                            {activity.relativeTime}
                          </span>
                          <span className="absolute-time">
                            {formatAbsoluteTime(activity.timestamp)}
                          </span>
                        </td>
                        <td className="user-cell">
                          <span className="user-name">{activity.username}</span>
                        </td>
                        <td>
                          <span
                            className={`user-role ${getRoleClass(
                              activity.roles
                            )}`}
                          >
                            {getRoleDisplayName(activity.roles)}
                          </span>
                        </td>
                        <td className="action-cell">
                          <div className="action-text">
                            {activity.icon && (
                              <span className="activity-icon">
                                {activity.icon}
                              </span>
                            )}
                            <span>{activity.displayMessage}</span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${
                              isError
                                ? "error"
                                : isWarning
                                ? "warning"
                                : "success"
                            }`}
                          >
                            {isError
                              ? "Failed"
                              : isWarning
                              ? "Warning"
                              : "Success"}
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
                      onClick={() =>
                        setPage(Math.min(totalPages - 1, page + 1))
                      }
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
