"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getHRDashboardStats } from "@/lib/applicationApi";
import StatusBreakdownChart from "@/components/application/control/Analytics/StatusBreakdownChart";
import StatusDistributionChart from "@/components/application/control/Analytics/StatusDistributionChart";
import type { DashboardStats } from "@/types/application/application";

export default function HRDashboardPage(): React.ReactElement {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await getHRDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading || !stats) {
    return (
      <>
        <div className="col-lg-12">
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="col-lg-12">
        <div className="section-box">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>My Dashboard</h3>
              <button
                onClick={fetchStats}
                className="btn btn-sm btn-outline-primary"
                aria-label="Refresh dashboard"
              >
                Refresh
              </button>
            </div>

            {/* Metrics Cards */}
            <div className="row mb-4">
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h6 className="text-muted">Assigned to Me</h6>
                    <h2 className="mb-0">{stats.assignedToMe || 0}</h2>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h6 className="text-muted">In Review</h6>
                    <h2 className="mb-0">
                      {stats.statusBreakdown?.REVIEWING || 0}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h6 className="text-muted">Interview Stage</h6>
                    <h2 className="mb-0">
                      {stats.statusBreakdown?.INTERVIEW || 0}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h6 className="text-muted">This Week</h6>
                    <h2 className="mb-0">{stats.weeklyTrend?.thisWeek || 0}</h2>
                    <small
                      className={
                        stats.weeklyTrend?.change &&
                        stats.weeklyTrend.change >= 0
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      {stats.weeklyTrend?.change &&
                      stats.weeklyTrend.change >= 0
                        ? "+"
                        : ""}
                      {stats.weeklyTrend?.change?.toFixed(1) || "0.0"}% vs last
                      week
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="row mb-4">
              <div className="col-lg-6 mb-3">
                <div className="card">
                  <div className="card-header">
                    <h5>Status Breakdown</h5>
                  </div>
                  <div className="card-body">
                    <StatusBreakdownChart
                      data={
                        stats.statusBreakdown
                          ? Object.entries(stats.statusBreakdown).map(
                              ([status, count]) => ({
                                status:
                                  status as import("@/types/application/application").ApplicationStatus,
                                count,
                              })
                            )
                          : []
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="col-lg-6 mb-3">
                <div className="card">
                  <div className="card-header">
                    <h5>Status Distribution</h5>
                  </div>
                  <div className="card-body">
                    <StatusDistributionChart
                      data={
                        stats.statusBreakdown
                          ? Object.entries(stats.statusBreakdown).map(
                              ([status, count]) => ({
                                status:
                                  status as import("@/types/application/application").ApplicationStatus,
                                count,
                              })
                            )
                          : []
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header">
                    <h5>Recent Applications</h5>
                  </div>
                  <div className="card-body">
                    {stats.recentApplications &&
                    stats.recentApplications.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Candidate</th>
                              <th>Job Title</th>
                              <th>Status</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stats.recentApplications.map((app) => (
                              <tr key={app.id}>
                                <td>
                                  <div>
                                    <div className="fw-medium">
                                      {app.username}
                                    </div>
                                    <div className="text-muted small">
                                      {app.email}
                                    </div>
                                  </div>
                                </td>
                                <td>{app.jobSnapshot?.title || "N/A"}</td>
                                <td>
                                  <span
                                    className={`badge bg-${getStatusColor(
                                      app.status
                                    )}`}
                                  >
                                    {app.status}
                                  </span>
                                </td>
                                <td className="text-muted">
                                  {new Date(
                                    app.submittedAt || app.createdAt
                                  ).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted">
                        No recent applications
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    APPLIED: "primary",
    REVIEWING: "warning",
    INTERVIEW: "info",
    OFFER: "success",
    HIRED: "success",
    REJECTED: "danger",
    WITHDRAWN: "secondary",
  };
  return colors[status] || "secondary";
}
