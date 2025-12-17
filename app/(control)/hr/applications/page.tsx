"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchApplicationsForJob,
  fetchAssignedApplications,
  selectApplications,
  selectApplicationLoading,
  selectApplicationMeta,
} from "@/redux/features/application/applicationSlice";
import ApplicationTable from "@/components/application/control/ApplicationTable";
import { useToast } from "@/components/application/common/Toast";
import { ErrorBoundary } from "@/components/application/common/ErrorBoundary";
import type { ApplicationFilters } from "@/components/application/control/SearchFilters";

export default function ApplicationsPage(): React.ReactElement {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const allApplications = useAppSelector(selectApplications);
  const loading = useAppSelector(selectApplicationLoading);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("submittedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentStatus, setCurrentStatus] = useState<string | undefined>(
    searchParams.get("status") || undefined
  );

  const jobId = searchParams.get("jobId");
  const page = parseInt(searchParams.get("page") || "0");
  const size = parseInt(searchParams.get("size") || "5");
  const paginationMeta = useAppSelector(selectApplicationMeta);

  // Fetch applications on initial load and when dependencies change
  useEffect(() => {
    if (jobId) {
      // Fetch applications for a specific job (supports status filter)
      dispatch(
        fetchApplicationsForJob({
          jobId,
          page,
          size,
          status: currentStatus,
        })
      );
    } else {
      // Fetch assigned applications (no status filter in API, filter client-side)
      dispatch(
        fetchAssignedApplications({
          page,
          size,
        })
      );
    }
  }, [dispatch, jobId, page, size, currentStatus]);

  // Filter applications client-side by status when no jobId
  const applications = useMemo(() => {
    if (jobId || !currentStatus) {
      return allApplications;
    }
    return allApplications.filter((app) => app.status === currentStatus);
  }, [allApplications, currentStatus, jobId]);

  // Handlers for pagination - update URL params which triggers API refetch
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handlePageSizeChange = (newSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("size", newSize.toString());
    params.set("page", "0"); // Reset to first page when changing size
    router.push(`?${params.toString()}`);
  };

  // Calculate status counts from all applications
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      DRAFT: 0,
      APPLIED: 0,
      REVIEWING: 0,
      INTERVIEW: 0,
      OFFER: 0,
      HIRED: 0,
      REJECTED: 0,
      WITHDRAWN: 0,
    };

    allApplications.forEach((app) => {
      if (counts[app.status] !== undefined) {
        counts[app.status]++;
      }
    });

    return counts;
  }, [allApplications]);

  const handleFiltersChange = (filters: ApplicationFilters) => {
    // Update current status filter which will trigger client-side filtering
    setCurrentStatus(filters.status?.[0]);
  };

  const handleReset = () => {
    setCurrentStatus(undefined);
    // Additional reset logic if needed
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleRowAction = (action: string, applicationId: string) => {
    switch (action) {
      case "view":
        router.push(`/hr/applications/${applicationId}`);
        break;
      case "updateStatus":
        // Status update is now handled in TableActions with modal
        break;
      case "assign":
        showToast({
          type: "info",
          title: "Assign Application",
          message: "Assignment modal will open here",
        });
        break;
      case "downloadCV":
        // CV download is now handled in TableActions
        break;
    }
  };

  const handleStatusUpdated = (): void => {
    // Refresh applications data after status update
    if (jobId) {
      dispatch(
        fetchApplicationsForJob({
          jobId,
          page,
          size,
          status: currentStatus,
        })
      );
    } else {
      dispatch(
        fetchAssignedApplications({
          page,
          size,
        })
      );
    }
  };

  return (
    <ErrorBoundary>
      <div className="box-content">
        {/* Page Header with Stats */}
        <div className="row">
          <div className="col-xl-8 col-lg-12">
            <div className="section-box">
              <div className="container">
                {/* Header Section */}
                <div className="panel-white mb-30">
                  <div className="box-padding">
                    <div className="d-flex align-items-center justify-content-between mb-15">
                      <div>
                        <h5 className="mb-5">
                          <svg
                            className="mr-10"
                            style={{
                              width: "20px",
                              height: "20px",
                              display: "inline-block",
                              verticalAlign: "middle",
                            }}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path
                              fillRule="evenodd"
                              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Applications Management
                        </h5>
                        <p className="text-muted font-sm">
                          Review and manage {allApplications.length} job
                          applications
                        </p>
                      </div>
                      {loading && (
                        <div
                          className="spinner-border spinner-border-sm text-primary"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      )}
                    </div>

                    {/* Enhanced Stats Cards */}
                    <div className="row mt-25">
                      {[
                        {
                          key: "new",
                          label: "New Applications",
                          count: statusCounts.APPLIED,
                          subtitle: "Awaiting Review",
                          bgColor: "#3498DB",
                          icon: "fi fi-rr-paper-plane",
                          onClick: () => setCurrentStatus(undefined),
                          trend: "+12%",
                          trendUp: true,
                        },
                        {
                          key: "reviewing",
                          label: "Under Review",
                          count: statusCounts.REVIEWING,
                          subtitle: "In Progress",
                          bgColor: "#F39C12",
                          icon: "fi fi-rr-eye",
                          onClick: () => setCurrentStatus("REVIEWING"),
                          trend: "+5%",
                          trendUp: true,
                        },
                        {
                          key: "interview",
                          label: "Interviews",
                          count: statusCounts.INTERVIEW,
                          subtitle: "Scheduled",
                          bgColor: "#9B59B6",
                          icon: "fi fi-rr-users",
                          onClick: () => setCurrentStatus("INTERVIEW"),
                          trend: "+8%",
                          trendUp: true,
                        },
                        {
                          key: "hired",
                          label: "Successfully Hired",
                          count: statusCounts.HIRED,
                          subtitle: "This Month",
                          bgColor: "#27AE60",
                          icon: "fi fi-rr-badge-check",
                          onClick: () => setCurrentStatus("HIRED"),
                          trend: "+15%",
                          trendUp: true,
                        },
                      ].map((stat) => (
                        <div
                          key={stat.key}
                          className="col-lg-3 col-md-6 col-sm-6 mb-20"
                        >
                          <div
                            onClick={stat.onClick}
                            style={{
                              background: "#FFFFFF",
                              borderRadius: "8px",
                              padding: "20px",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              border: "1px solid #E9ECEF",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = "#F8F9FA";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = "#FFFFFF";
                            }}
                          >
                            <div>
                              {/* Header with Icon */}
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  marginBottom: "16px",
                                }}
                              >
                                <div
                                  style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "8px",
                                    backgroundColor: stat.bgColor,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <i
                                    className={stat.icon}
                                    style={{
                                      fontSize: "22px",
                                      color: "#FFFFFF",
                                    }}
                                  ></i>
                                </div>
                                {/* Trend Badge */}
                                <div
                                  style={{
                                    padding: "4px 10px",
                                    borderRadius: "6px",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    color: stat.trendUp ? "#27AE60" : "#E74C3C",
                                    backgroundColor: stat.trendUp
                                      ? "#E8F8F5"
                                      : "#FADBD8",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                  }}
                                >
                                  <i
                                    className={`fi fi-rr-arrow-small-${
                                      stat.trendUp ? "up" : "down"
                                    }`}
                                  ></i>
                                  {stat.trend}
                                </div>
                              </div>

                              {/* Stats Content */}
                              <div>
                                <h2
                                  style={{
                                    fontSize: "32px",
                                    fontWeight: 800,
                                    color: "#2D3E50",
                                    marginBottom: "4px",
                                    lineHeight: 1,
                                  }}
                                >
                                  {stat.count}
                                </h2>
                                <h6
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#495057",
                                    marginBottom: "4px",
                                  }}
                                >
                                  {stat.label}
                                </h6>
                                <p
                                  style={{
                                    fontSize: "12px",
                                    color: "#6C757D",
                                    margin: 0,
                                  }}
                                >
                                  {stat.subtitle}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Panel */}
          <div className="col-xl-4 col-lg-12">
            <div className="section-box">
              <div className="container">
                <div className="panel-white mb-30">
                  <div className="box-padding">
                    <h5 className="mb-20">
                      <svg
                        className="mr-10"
                        style={{
                          width: "18px",
                          height: "18px",
                          display: "inline-block",
                          verticalAlign: "middle",
                        }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Recent Activity
                    </h5>

                    <div className="mb-20">
                      <div className="d-flex align-items-start">
                        <div className="mr-15">
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "#27AE60",
                            }}
                          >
                            <svg
                              style={{ width: "20px", height: "20px" }}
                              fill="white"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p className="font-md mb-5 color-text-paragraph">
                            <strong>Assigned Applications</strong>
                          </p>
                          <p className="font-xs text-muted mb-0">
                            {
                              allApplications.filter((app) => app.assignedTo)
                                .length
                            }{" "}
                            applications assigned to you
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="d-flex align-items-start">
                        <div className="mr-15">
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "#F39C12",
                            }}
                          >
                            <svg
                              style={{ width: "20px", height: "20px" }}
                              fill="white"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p className="font-md mb-5 color-text-paragraph">
                            <strong>Pending Review</strong>
                          </p>
                          <p className="font-xs text-muted mb-0">
                            {statusCounts.APPLIED + statusCounts.REVIEWING}{" "}
                            require attention
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Table Section */}
        <div className="section-box">
          <div className="container">
            <div className="panel-white">
              <div className="box-padding">
                {/* Applications Table - Outside panel to allow overflow */}
                <ApplicationTable
                  applications={applications}
                  loading={loading}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  onRowAction={handleRowAction}
                  onStatusUpdated={handleStatusUpdated}
                  pagination={paginationMeta}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
