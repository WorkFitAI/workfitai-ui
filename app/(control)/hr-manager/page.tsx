"use client";

<<<<<<< HEAD
import React from "react";
import { useRouter } from "next/navigation";

export default function HRManagerDashboard(): React.ReactElement {
    const router = useRouter();

    const menuItems = [
        {
            title: "Manage Applications",
            description: "Review and manage all job applications",
            icon: "📝",
            path: "/hr-manager/manage-applications",
            color: "border-primary",
        },
        {
            title: "Company Applications",
            description: "View applications across all companies",
            icon: "💼",
            path: "/hr-manager/company-applications",
            color: "border-success",
        },
        {
            title: "HR Approvals",
            description: "Approve or reject HR account requests",
            icon: "✅",
            path: "/hr-manager/approvals/hr",
            color: "border-warning",
        },
        {
            title: "HR Management",
            description: "Manage HR accounts and permissions",
            icon: "👥",
            path: "/hr-manager/hr-management",
            color: "border-info",
        },
        {
            title: "User Management",
            description: "Manage all platform users",
            icon: "👤",
            path: "/hr-manager/users",
            color: "border-danger",
        },
        {
            title: "Application Analytics",
            description: "View detailed application statistics",
            icon: "📊",
            path: "/hr-manager/application-analytics",
            color: "border-secondary",
        },
    ];

    return (
        <div className="col-lg-12">
            <div className="section-box">
                <div className="container">
                    <div className="mb-5">
                        <h2 className="mb-2">HR Manager Dashboard</h2>
                        <p className="text-muted">
                            Welcome to your management hub. Select an option below to get started.
                        </p>
                    </div>

                    <div className="row g-4">
                        {menuItems.map((item, index) => (
                            <div key={index} className="col-lg-4 col-md-6">
                                <div
                                    className={`card h-100 border-2 ${item.color}`}
                                    onClick={() => router.push(item.path)}
                                    style={{
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-5px)";
                                        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    <div className="card-body">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="me-3" style={{ fontSize: "2rem" }}>
                                                {item.icon}
                                            </div>
                                            <h5 className="mb-0">{item.title}</h5>
                                        </div>
                                        <p className="text-muted mb-0">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Stats Section */}
                    <div className="row mt-5">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header bg-light">
                                    <h5 className="mb-0">Quick Access</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-4 mb-3 mb-md-0">
                                            <button
                                                onClick={() => router.push("/hr-manager/manage-applications")}
                                                className="btn btn-primary w-100"
                                            >
                                                📝 View All Applications
                                            </button>
                                        </div>
                                        <div className="col-md-4 mb-3 mb-md-0">
                                            <button
                                                onClick={() => router.push("/hr-manager/approvals/hr")}
                                                className="btn btn-warning w-100"
                                            >
                                                ✅ Pending Approvals
                                            </button>
                                        </div>
                                        <div className="col-md-4">
                                            <button
                                                onClick={() => router.push("/hr-manager/application-analytics")}
                                                className="btn btn-info w-100"
                                            >
                                                📊 View Analytics
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
=======
import { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { selectAuthUser } from "@/redux/features/auth/authSlice";
import { getManagerStats, getHRActivities } from "@/lib/applicationApi";
import type { ManagerStats, HRActivity } from "@/types/application/application";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function HRManagerDashboard() {
  const user = useAppSelector(selectAuthUser);
  const companyId = user?.companyId;

  const [stats, setStats] = useState<ManagerStats | null>(null);
  const [activities, setActivities] = useState<HRActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activitiesPage, setActivitiesPage] = useState(0);
  const [hasMoreActivities, setHasMoreActivities] = useState(true);

  useEffect(() => {
    if (!companyId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(
          "[HRManager] Fetching dashboard data for company:",
          companyId
        );

        const [statsData, activitiesData] = await Promise.all([
          getManagerStats(companyId),
          getHRActivities(companyId, 0, 10),
        ]);

        console.log("[HRManager] Stats data:", statsData);
        console.log("[HRManager] Activities data:", activitiesData);

        if (!statsData) {
          throw new Error("Stats data is undefined");
        }

        if (!activitiesData) {
          throw new Error("Activities data is undefined");
        }

        setStats(statsData);
        setActivities(activitiesData.items || []);
        setHasMoreActivities(activitiesData.meta?.hasNext || false);
      } catch (err) {
        console.error("[HRManager] Failed to fetch dashboard data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  const loadMoreActivities = async () => {
    if (!companyId || !hasMoreActivities) return;

    try {
      const nextPage = activitiesPage + 1;
      const activitiesData = await getHRActivities(companyId, nextPage, 10);

      if (activitiesData && activitiesData.items) {
        setActivities([...activities, ...activitiesData.items]);
        setActivitiesPage(nextPage);
        setHasMoreActivities(activitiesData.meta?.hasNext || false);
      }
    } catch (err) {
      console.error("[HRManager] Failed to load more activities:", err);
    }
  };

  const getActionLabel = (action: string): string => {
    const labels: Record<string, string> = {
      STATUS_UPDATED: "Status Updated",
      APPLICATION_ASSIGNED: "Application Assigned",
      NOTE_ADDED: "Note Added",
      APPLICATION_CREATED: "Application Created",
    };
    return labels[action] || action;
  };

  const getActionIcon = (action: string): string => {
    const icons: Record<string, string> = {
      STATUS_UPDATED: "📝",
      APPLICATION_ASSIGNED: "👤",
      NOTE_ADDED: "💬",
      APPLICATION_CREATED: "✨",
    };
    return icons[action] || "📋";
  };

  if (loading) {
    return (
      <div className="section-box">
        <div className="container">
          <div className="panel-white">
            <div
              className="panel-body text-center"
              style={{ padding: "60px 20px" }}
            >
              <div
                style={{
                  display: "inline-block",
                  width: "40px",
                  height: "40px",
                  border: "4px solid #F8F9FA",
                  borderTop: "4px solid #3498DB",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              <p style={{ marginTop: "20px", color: "#6C757D" }}>
                Loading dashboard...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="section-box">
        <div className="container">
          <div className="panel-white">
            <div
              className="panel-body text-center"
              style={{ padding: "60px 20px" }}
            >
              <p style={{ color: "#E74C3C", marginBottom: "20px" }}>
                {error || "Failed to load dashboard"}
              </p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "10px 24px",
                  backgroundColor: "#3498DB",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate key metrics
  const successfulHires = stats?.byStatus?.HIRED || 0;
  const totalApplications = stats?.totalApplications || 0;
  const successRate =
    totalApplications > 0 ? (successfulHires / totalApplications) * 100 : 0;

  const pendingApplications =
    (stats?.byStatus?.APPLIED || 0) +
    (stats?.byStatus?.REVIEWING || 0) +
    (stats?.byStatus?.INTERVIEW || 0);

  // Calculate monthly metrics (simplified - using available data)
  const thisMonthApplications = totalApplications;
  const monthlyChange = totalApplications > 0 ? 15 : 0; // Placeholder for growth indicator
  const isGrowth = monthlyChange > 0;

  return (
    <>
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>

      {/* Header Section */}
      <div
        className="section-box"
        style={{ paddingTop: "30px", paddingBottom: "0", paddingLeft: "30px" }}
      >
        <div className="container">
          <div style={{ marginBottom: "30px" }}>
            <h2 style={{ marginBottom: "8px", color: "#2C3E50" }}>
              HR Manager Dashboard
            </h2>
            <p style={{ color: "#6C757D", fontSize: "14px" }}>
              Overview of your company&apos;s application metrics and team
              performance
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="section-box" style={{ paddingLeft: "30px" }}>
        <div className="container">
          <div className="row">
            {/* Total Applications */}
            <div className="col-xxl-2 col-xl-4 col-lg-4 col-md-6 col-sm-6">
              <div className="card-style-1 hover-up">
                <div className="card-image">
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#E8F4F8",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                    }}
                  >
                    📊
                  </div>
                </div>
                <div className="card-info">
                  <div className="card-title">
                    <h3 style={{ fontSize: "28px", marginBottom: "4px" }}>
                      {totalApplications.toLocaleString()}
                    </h3>
                  </div>
                  <p
                    className="color-text-paragraph-2"
                    style={{ fontSize: "12px", marginBottom: "6px" }}
                  >
                    Total Applications
                  </p>
                  <div
                    style={{
                      fontSize: "11px",
                      color: isGrowth ? "#27AE60" : "#E74C3C",
                      fontWeight: "600",
                    }}
                  >
                    {isGrowth ? "↑" : "↓"} {Math.abs(monthlyChange).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* This Month */}
            <div className="col-xxl-2 col-xl-4 col-lg-4 col-md-6 col-sm-6">
              <div className="card-style-1 hover-up">
                <div className="card-image">
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#F3E8FE",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                    }}
                  >
                    📅
                  </div>
                </div>
                <div className="card-info">
                  <div className="card-title">
                    <h3 style={{ fontSize: "28px", marginBottom: "4px" }}>
                      {thisMonthApplications.toLocaleString()}
                    </h3>
                  </div>
                  <p
                    className="color-text-paragraph-2"
                    style={{ fontSize: "12px", marginBottom: "6px" }}
                  >
                    This Month
                  </p>
                  <div style={{ fontSize: "11px", color: "#6C757D" }}>
                    {isGrowth ? "↑" : "↓"} {Math.abs(monthlyChange)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Review */}
            <div className="col-xxl-2 col-xl-4 col-lg-4 col-md-6 col-sm-6">
              <div className="card-style-1 hover-up">
                <div className="card-image">
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#FEF3E8",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                    }}
                  >
                    ⏳
                  </div>
                </div>
                <div className="card-info">
                  <div className="card-title">
                    <h3 style={{ fontSize: "28px", marginBottom: "4px" }}>
                      {pendingApplications.toLocaleString()}
                    </h3>
                  </div>
                  <p
                    className="color-text-paragraph-2"
                    style={{ fontSize: "12px", marginBottom: "6px" }}
                  >
                    Pending Review
                  </p>
                  <div style={{ fontSize: "11px", color: "#6C757D" }}>
                    In progress
                  </div>
                </div>
              </div>
            </div>

            {/* Successful Hires */}
            <div className="col-xxl-2 col-xl-4 col-lg-4 col-md-6 col-sm-6">
              <div className="card-style-1 hover-up">
                <div className="card-image">
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#E8F8F1",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                    }}
                  >
                    🎯
                  </div>
                </div>
                <div className="card-info">
                  <div className="card-title">
                    <h3 style={{ fontSize: "28px", marginBottom: "4px" }}>
                      {successfulHires.toLocaleString()}
                    </h3>
                  </div>
                  <p
                    className="color-text-paragraph-2"
                    style={{ fontSize: "12px", marginBottom: "6px" }}
                  >
                    Successful Hires
                  </p>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#27AE60",
                      fontWeight: "600",
                    }}
                  >
                    {successRate.toFixed(1)}% rate
                  </div>
                </div>
              </div>
            </div>

            {/* Active Offers */}
            <div className="col-xxl-2 col-xl-4 col-lg-4 col-md-6 col-sm-6">
              <div className="card-style-1 hover-up">
                <div className="card-image">
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#FEE8F8",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                    }}
                  >
                    💼
                  </div>
                </div>
                <div className="card-info">
                  <div className="card-title">
                    <h3 style={{ fontSize: "28px", marginBottom: "4px" }}>
                      {(stats?.byStatus?.OFFER || 0).toLocaleString()}
                    </h3>
                  </div>
                  <p
                    className="color-text-paragraph-2"
                    style={{ fontSize: "12px", marginBottom: "6px" }}
                  >
                    Active Offers
                  </p>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#9B59B6",
                      fontWeight: "600",
                    }}
                  >
                    Pending
                  </div>
                </div>
              </div>
            </div>

            {/* HR Team Size */}
            <div className="col-xxl-2 col-xl-4 col-lg-4 col-md-6 col-sm-6">
              <div className="card-style-1 hover-up">
                <div className="card-image">
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#FEE8E8",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                    }}
                  >
                    👥
                  </div>
                </div>
                <div className="card-info">
                  <div className="card-title">
                    <h3 style={{ fontSize: "28px", marginBottom: "4px" }}>
                      {stats?.teamPerformance?.length || 0}
                    </h3>
                  </div>
                  <p
                    className="color-text-paragraph-2"
                    style={{ fontSize: "12px", marginBottom: "6px" }}
                  >
                    Team Members
                  </p>
                  <div style={{ fontSize: "11px", color: "#6C757D" }}>
                    Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Performance & Top Jobs */}
      <div className="section-box" style={{ paddingLeft: "30px" }}>
        <div className="container">
          <div className="row">
            {/* Team Performance Comparison */}
            <div className="col-xxl-5 col-xl-5 col-lg-6">
              <div
                className="panel-white"
                style={{
                  height: "100%",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  border: "1px solid #E9ECEF",
                  borderRadius: "16px",
                }}
              >
                <div
                  className="panel-head"
                  style={{
                    borderBottom: "2px solid #F8F9FA",
                    paddingBottom: "16px",
                  }}
                >
                  <h5
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#2C3E50",
                    }}
                  >
                    <span style={{ fontSize: "22px" }}>⭐</span>
                    Team Performance
                  </h5>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#6C757D",
                      margin: "8px 0 0 0",
                    }}
                  >
                    Top performers by completion rate
                  </p>
                </div>
                <div className="panel-body">
                  <div style={{ padding: "10px 0" }}>
                    {(stats?.teamPerformance || []).length === 0 ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "40px 20px",
                          color: "#6C757D",
                        }}
                      >
                        <p>No team data available</p>
                      </div>
                    ) : (
                      (stats?.teamPerformance || [])
                        .sort((a, b) => (b.reviewed || 0) - (a.reviewed || 0))
                        .map((member, index) => {
                          const completionRate =
                            member.assigned && member.assigned > 0
                              ? (member.reviewed / member.assigned) * 100
                              : 0;
                          return (
                            <div
                              key={member.hrUsername}
                              style={{
                                padding: "20px",
                                marginBottom: "16px",
                                backgroundColor:
                                  index === 0 ? "#FFF9E6" : "white",
                                borderRadius: "12px",
                                border: `2px solid ${
                                  index === 0 ? "#F39C12" : "#E9ECEF"
                                }`,
                                boxShadow:
                                  index === 0
                                    ? "0 4px 12px rgba(243, 156, 18, 0.15)"
                                    : "0 2px 6px rgba(0,0,0,0.04)",
                                transition: "all 0.2s ease",
                                cursor: "pointer",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow =
                                  index === 0
                                    ? "0 6px 16px rgba(243, 156, 18, 0.25)"
                                    : "0 4px 12px rgba(0,0,0,0.08)";
                                e.currentTarget.style.transform =
                                  "translateY(-2px)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow =
                                  index === 0
                                    ? "0 4px 12px rgba(243, 156, 18, 0.15)"
                                    : "0 2px 6px rgba(0,0,0,0.04)";
                                e.currentTarget.style.transform =
                                  "translateY(0)";
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  marginBottom: "14px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                  }}
                                >
                                  {index === 0 && (
                                    <span style={{ fontSize: "24px" }}>🏆</span>
                                  )}
                                  <div
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "50%",
                                      backgroundColor: "#3498DB",
                                      color: "white",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontWeight: "700",
                                      fontSize: "16px",
                                    }}
                                  >
                                    {member.hrUsername.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div
                                      style={{
                                        fontSize: "15px",
                                        fontWeight: "600",
                                        color: "#2C3E50",
                                      }}
                                    >
                                      {member.hrUsername}
                                    </div>
                                    {index === 0 && (
                                      <div
                                        style={{
                                          fontSize: "11px",
                                          color: "#F39C12",
                                          fontWeight: "600",
                                        }}
                                      >
                                        Top Performer
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div
                                  style={{
                                    padding: "4px 12px",
                                    backgroundColor:
                                      completionRate >= 80
                                        ? "#E8F8F1"
                                        : completionRate >= 60
                                        ? "#E8F4F8"
                                        : "#FFF4E6",
                                    color:
                                      completionRate >= 80
                                        ? "#27AE60"
                                        : completionRate >= 60
                                        ? "#3498DB"
                                        : "#F39C12",
                                    borderRadius: "6px",
                                    fontWeight: "700",
                                    fontSize: "14px",
                                  }}
                                >
                                  {(completionRate || 0).toFixed(0)}%
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: "12px" }}>
                                <div style={{ flex: 1 }}>
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      color: "#6C757D",
                                      marginBottom: "6px",
                                    }}
                                  >
                                    Assigned
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "20px",
                                      fontWeight: "700",
                                      color: "#3498DB",
                                    }}
                                  >
                                    {member.assigned || 0}
                                  </div>
                                  <div
                                    style={{
                                      marginTop: "6px",
                                      height: "6px",
                                      backgroundColor: "#F1F2F4",
                                      borderRadius: "3px",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "#3498DB",
                                      }}
                                    />
                                  </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      color: "#6C757D",
                                      marginBottom: "6px",
                                    }}
                                  >
                                    Completed
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "20px",
                                      fontWeight: "700",
                                      color: "#27AE60",
                                    }}
                                  >
                                    {member.reviewed || 0}
                                  </div>
                                  <div
                                    style={{
                                      marginTop: "6px",
                                      height: "6px",
                                      backgroundColor: "#F1F2F4",
                                      borderRadius: "3px",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: `${completionRate}%`,
                                        height: "100%",
                                        backgroundColor: "#27AE60",
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Top Jobs */}
            <div className="col-xxl-7 col-xl-7 col-lg-6">
              <div
                className="panel-white"
                style={{
                  height: "100%",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  border: "1px solid #E9ECEF",
                  borderRadius: "16px",
                }}
              >
                <div
                  className="panel-head"
                  style={{
                    borderBottom: "2px solid #F8F9FA",
                    paddingBottom: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h5
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#2C3E50",
                        margin: 0,
                      }}
                    >
                      <span style={{ fontSize: "22px" }}>🏆</span>
                      Top Performing Jobs
                    </h5>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#6C757D",
                        margin: "8px 0 0 0",
                      }}
                    >
                      Most popular positions
                    </p>
                  </div>
                </div>
                <div className="panel-body">
                  <div style={{ padding: "10px 0" }}>
                    {(stats?.topJobs || []).length === 0 ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "40px 20px",
                          color: "#6C757D",
                        }}
                      >
                        <p>No jobs data available</p>
                      </div>
                    ) : (
                      (stats?.topJobs || []).slice(0, 5).map((job, index) => (
                        <div
                          key={job.jobId}
                          style={{
                            padding: "20px",
                            marginBottom: "16px",
                            backgroundColor: index === 0 ? "#FFF9E6" : "white",
                            borderRadius: "12px",
                            border: `2px solid ${
                              index === 0
                                ? "#F39C12"
                                : index === 1
                                ? "#BDC3C7"
                                : index === 2
                                ? "#CD7F32"
                                : "#E9ECEF"
                            }`,
                            boxShadow:
                              index === 0
                                ? "0 4px 12px rgba(243, 156, 18, 0.15)"
                                : index === 1
                                ? "0 3px 10px rgba(189, 195, 199, 0.15)"
                                : index === 2
                                ? "0 3px 10px rgba(205, 127, 50, 0.15)"
                                : "0 2px 6px rgba(0,0,0,0.04)",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(-3px)";
                            e.currentTarget.style.boxShadow =
                              index === 0
                                ? "0 6px 20px rgba(243, 156, 18, 0.25)"
                                : "0 6px 16px rgba(0,0,0,0.12)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow =
                              index === 0
                                ? "0 4px 12px rgba(243, 156, 18, 0.15)"
                                : index === 1
                                ? "0 3px 10px rgba(189, 195, 199, 0.15)"
                                : index === 2
                                ? "0 3px 10px rgba(205, 127, 50, 0.15)"
                                : "0 2px 6px rgba(0,0,0,0.04)";
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              gap: "12px",
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  marginBottom: "8px",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    color: "white",
                                    backgroundColor:
                                      index === 0 ? "#F39C12" : "#3498DB",
                                    padding: "4px 10px",
                                    borderRadius: "6px",
                                    minWidth: "32px",
                                    textAlign: "center",
                                  }}
                                >
                                  #{index + 1}
                                </span>
                                <h6
                                  style={{
                                    margin: 0,
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    color: "#2C3E50",
                                    lineHeight: "1.4",
                                  }}
                                >
                                  {job.jobTitle}
                                </h6>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "16px",
                                  marginTop: "8px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "13px",
                                      color: "#6C757D",
                                    }}
                                  >
                                    <strong style={{ color: "#2C3E50" }}>
                                      {job.applicantCount}
                                    </strong>{" "}
                                    applicants
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "8px 12px",
                                backgroundColor: "white",
                                borderRadius: "8px",
                                border: "2px solid #E9ECEF",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "22px",
                                  fontWeight: "700",
                                  color: "#3498DB",
                                  lineHeight: "1",
                                }}
                              >
                                {job.applicantCount}
                              </div>
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "#95A5A6",
                                  marginTop: "2px",
                                }}
                              >
                                applicants
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="section-box" style={{ paddingLeft: "30px", paddingTop: "20px" }}>
        <div className="container">
          <div
            className="panel-white"
            style={{
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              border: "1px solid #E9ECEF",
              borderRadius: "16px",
            }}
          >
            <div
              className="panel-head"
              style={{
                borderBottom: "2px solid #F8F9FA",
                paddingBottom: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <h5
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#2C3E50",
                    margin: 0,
                  }}
                >
                  Recent HR Activities
                </h5>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#6C757D",
                    margin: "8px 0 0 0",
                  }}
                >
                  Latest updates and actions
                </p>
              </div>
            </div>
            <div className="panel-body">
              {activities.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    color: "#6C757D",
                  }}
                >
                  <p>No recent activities</p>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table" style={{ marginBottom: 0 }}>
                      <thead>
                        <tr
                          style={{
                            borderBottom: "2px solid #E9ECEF",
                            backgroundColor: "#F8F9FA",
                          }}
                        >
                          <th
                            style={{
                              color: "#2C3E50",
                              fontWeight: "700",
                              fontSize: "13px",
                              padding: "16px",
                              width: "60px",
                            }}
                          >
                            Type
                          </th>
                          <th
                            style={{
                              color: "#2C3E50",
                              fontWeight: "700",
                              fontSize: "13px",
                            }}
                          >
                            Performer
                          </th>
                          <th
                            style={{
                              color: "#2C3E50",
                              fontWeight: "700",
                              fontSize: "13px",
                            }}
                          >
                            Action
                          </th>
                          <th
                            style={{
                              color: "#2C3E50",
                              fontWeight: "700",
                              fontSize: "13px",
                            }}
                          >
                            Description
                          </th>
                          <th
                            style={{
                              color: "#2C3E50",
                              fontWeight: "700",
                              fontSize: "13px",
                              width: "120px",
                            }}
                          >
                            Role
                          </th>
                          <th
                            style={{
                              color: "#2C3E50",
                              fontWeight: "700",
                              fontSize: "13px",
                              width: "150px",
                              textAlign: "right",
                            }}
                          >
                            Time
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {activities.map((activity) => (
                          <tr
                            key={activity.id}
                            style={{
                              borderBottom: "1px solid #F1F2F4",
                              transition: "all 0.2s ease",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#F8F9FA";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                            }}
                          >
                            <td style={{ padding: "16px" }}>
                              <div
                                style={{
                                  fontSize: "24px",
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                {getActionIcon(activity.action)}
                              </div>
                            </td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <div
                                  style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    backgroundColor: "#3498DB",
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: "700",
                                    fontSize: "14px",
                                  }}
                                >
                                  {activity.performerFullName
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                                <div
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    color: "#2C3E50",
                                  }}
                                >
                                  {activity.performerFullName}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span
                                style={{
                                  padding: "4px 12px",
                                  backgroundColor: "#E8F4F8",
                                  color: "#3498DB",
                                  borderRadius: "6px",
                                  fontWeight: "600",
                                  fontSize: "13px",
                                  display: "inline-block",
                                }}
                              >
                                {getActionLabel(activity.action)}
                              </span>
                            </td>
                            <td>
                              <span
                                style={{
                                  fontSize: "13px",
                                  color: "#6C757D",
                                }}
                              >
                                {activity.metadata.description || "-"}
                              </span>
                            </td>
                            <td>
                              <span
                                style={{
                                  padding: "4px 10px",
                                  backgroundColor: "#F1F2F4",
                                  color: "#6C757D",
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                  display: "inline-block",
                                }}
                              >
                                {activity.performerRole}
                              </span>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <span
                                style={{
                                  fontSize: "12px",
                                  color: "#95A5A6",
                                }}
                              >
                                {formatDistanceToNow(
                                  new Date(activity.performedAt),
                                  { addSuffix: true }
                                )}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {hasMoreActivities && (
                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "24px",
                        paddingTop: "20px",
                        borderTop: "2px solid #F8F9FA",
                      }}
                    >
                      <button
                        onClick={loadMoreActivities}
                        style={{
                          padding: "12px 28px",
                          backgroundColor: "#3498DB",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "14px",
                          boxShadow: "0 2px 8px rgba(52, 152, 219, 0.25)",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#2980B9";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(52, 152, 219, 0.35)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#3498DB";
                          e.currentTarget.style.boxShadow =
                            "0 2px 8px rgba(52, 152, 219, 0.25)";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        Load More Activities
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
>>>>>>> origin/dev
}
