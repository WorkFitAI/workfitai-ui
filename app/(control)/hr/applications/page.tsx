"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchApplicationsForJob,
  fetchAssignedApplications,
  selectApplications,
  selectApplicationLoading,
} from "@/redux/features/application/applicationSlice";
import ApplicationTable from "@/components/application/control/ApplicationTable";
import SearchFilters from "@/components/application/control/SearchFilters";
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
  const size = parseInt(searchParams.get("size") || "20");

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

  const handleBulkAction = async (): Promise<void> => {
    if (selectedIds.length === 0) {
      showToast({
        type: "warning",
        title: "No Selection",
        message: "Please select applications first",
      });
      return;
    }
    // Bulk actions handled in BulkActionsToolbar component
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

                    {/* Quick Stats Cards */}
                    <div className="row mt-25">
                      <div className="col-lg-3 col-md-6 col-sm-6 mb-20">
                        <div
                          className="card-style-1 hover-up"
                          style={{ cursor: "pointer" }}
                          onClick={() => setCurrentStatus(undefined)}
                        >
                          <div className="card-info">
                            <div className="card-title">
                              <h6 className="font-sm color-text-paragraph-2 mb-5">
                                New
                              </h6>
                            </div>
                            <div className="card-count">
                              <h3 className="color-brand-2">
                                {statusCounts.APPLIED}
                              </h3>
                              <span className="font-xs color-text-mutted">
                                Applications
                              </span>
                            </div>
                          </div>
                          <div className="card-icon">
                            <div className="icon-bg icon-bg-primary">
                              <svg
                                style={{ width: "24px", height: "24px" }}
                                fill="white"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                <path
                                  fillRule="evenodd"
                                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6 col-sm-6 mb-20">
                        <div
                          className="card-style-1 hover-up"
                          style={{ cursor: "pointer" }}
                          onClick={() => setCurrentStatus("REVIEWING")}
                        >
                          <div className="card-info">
                            <div className="card-title">
                              <h6 className="font-sm color-text-paragraph-2 mb-5">
                                Reviewing
                              </h6>
                            </div>
                            <div className="card-count">
                              <h3 className="color-brand-2">
                                {statusCounts.REVIEWING}
                              </h3>
                              <span className="font-xs color-text-mutted">
                                In Progress
                              </span>
                            </div>
                          </div>
                          <div className="card-icon">
                            <div className="icon-bg icon-bg-warning">
                              <svg
                                style={{ width: "24px", height: "24px" }}
                                fill="white"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6 col-sm-6 mb-20">
                        <div
                          className="card-style-1 hover-up"
                          style={{ cursor: "pointer" }}
                          onClick={() => setCurrentStatus("INTERVIEW")}
                        >
                          <div className="card-info">
                            <div className="card-title">
                              <h6 className="font-sm color-text-paragraph-2 mb-5">
                                Interview
                              </h6>
                            </div>
                            <div className="card-count">
                              <h3 className="color-brand-2">
                                {statusCounts.INTERVIEW}
                              </h3>
                              <span className="font-xs color-text-mutted">
                                Scheduled
                              </span>
                            </div>
                          </div>
                          <div className="card-icon">
                            <div className="icon-bg icon-bg-info">
                              <svg
                                style={{ width: "24px", height: "24px" }}
                                fill="white"
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6 col-sm-6 mb-20">
                        <div
                          className="card-style-1 hover-up"
                          style={{ cursor: "pointer" }}
                          onClick={() => setCurrentStatus("HIRED")}
                        >
                          <div className="card-info">
                            <div className="card-title">
                              <h6 className="font-sm color-text-paragraph-2 mb-5">
                                Hired
                              </h6>
                            </div>
                            <div className="card-count">
                              <h3 className="color-brand-2">
                                {statusCounts.HIRED}
                              </h3>
                              <span className="font-xs color-text-mutted">
                                Successful
                              </span>
                            </div>
                          </div>
                          <div className="card-icon">
                            <div className="icon-bg icon-bg-success">
                              <svg
                                style={{ width: "24px", height: "24px" }}
                                fill="white"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
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
                <div className="mb-30">
                  <h6 className="color-text-paragraph-2 mb-15">
                    <svg
                      className="mr-10"
                      style={{
                        width: "16px",
                        height: "16px",
                        display: "inline-block",
                        verticalAlign: "middle",
                      }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Filter Applications
                  </h6>

                  {/* Search & Filters */}
                  <SearchFilters
                    onFiltersChange={handleFiltersChange}
                    counts={{
                      DRAFT: statusCounts.DRAFT,
                      APPLIED: statusCounts.APPLIED,
                      REVIEWING: statusCounts.REVIEWING,
                      INTERVIEW: statusCounts.INTERVIEW,
                      OFFER: statusCounts.OFFER,
                      HIRED: statusCounts.HIRED,
                      REJECTED: statusCounts.REJECTED,
                      WITHDRAWN: statusCounts.WITHDRAWN,
                    }}
                  />
                </div>

                <div className="border-top pt-30">
                  {/* Result Count and Actions */}
                  <div className="d-flex align-items-center justify-content-between mb-20">
                    <div>
                      <h6 className="color-text-paragraph-2 mb-0">
                        {applications.length === allApplications.length ? (
                          <>Showing all {applications.length} applications</>
                        ) : (
                          <>
                            Showing {applications.length} of{" "}
                            {allApplications.length} applications
                            {currentStatus && (
                              <>
                                {" "}
                                <span className="badge badge-info ml-10">
                                  {currentStatus}
                                </span>
                              </>
                            )}
                          </>
                        )}
                      </h6>
                    </div>
                    {applications.length > 0 && (
                      <div>
                        <button
                          className="btn btn-default btn-sm mr-10"
                          onClick={handleReset}
                          disabled={
                            !currentStatus &&
                            applications.length === allApplications.length
                          }
                        >
                          <svg
                            style={{
                              width: "14px",
                              height: "14px",
                              marginRight: "4px",
                              display: "inline-block",
                              verticalAlign: "middle",
                            }}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Reset
                        </button>
                      </div>
                    )}
                  </div>
                </div>

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
                  onBulkAction={handleBulkAction}
                  onStatusUpdated={handleStatusUpdated}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
