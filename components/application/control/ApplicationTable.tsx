"use client";

import React, { useState, useEffect, useMemo } from "react";
import type {
  Application,
  PaginationMeta,
} from "@/types/application/application";
import { ApplicationStatus } from "@/types/application/application";
import BulkActionsToolbar from "./BulkActionsToolbar";
import TableHeader, { type Column } from "./TableHeader";
import TableRow from "./TableRow";
import ColumnSettings from "./ColumnSettings";

interface ApplicationTableProps {
  applications: Application[];
  loading: boolean;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onBulkAction: (action: string) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string) => void;
  onRowAction?: (action: string, applicationId: string) => void;
  onStatusUpdated?: () => void;
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

const DEFAULT_COLUMNS: Column[] = [
  {
    id: "candidate",
    label: "Candidate",
    sortable: true,
    width: "250px",
  },
  {
    id: "job",
    label: "Job Title",
    sortable: true,
    width: "220px",
  },
  {
    id: "status",
    label: "Status",
    sortable: true,
    width: "140px",
    align: "center",
  },
  {
    id: "submittedAt",
    label: "Submitted",
    sortable: true,
    width: "130px",
  },
  {
    id: "assignedTo",
    label: "Assigned To",
    sortable: true,
    width: "150px",
  },
  {
    id: "actions",
    label: "Actions",
    sortable: false,
    width: "120px",
    align: "right",
  },
];

const STORAGE_KEY = "applicationTable_visibleColumns";

const ApplicationTable = ({
  applications,
  loading,
  selectedIds,
  onSelectionChange,
  onBulkAction,
  sortBy,
  sortOrder = "desc",
  onSort,
  onRowAction,
  onStatusUpdated,
  pagination,
  onPageChange,
  onPageSizeChange,
}: ApplicationTableProps): React.ReactElement => {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    // Load from localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // Ignore parse errors
        }
      }
    }
    return DEFAULT_COLUMNS.map((c) => c.id);
  });

  // Save to localStorage when columns change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visibleColumns));
    }
  }, [visibleColumns]);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">(
    "ALL"
  );
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // Local sorting state
  const [localSortBy, setLocalSortBy] = useState<string>(
    sortBy || "submittedAt"
  );
  const [localSortOrder, setLocalSortOrder] = useState<"asc" | "desc">(
    sortOrder
  );

  // Handle sort toggle
  const handleSort = (field: string): void => {
    if (localSortBy === field) {
      // Toggle order
      setLocalSortOrder(localSortOrder === "asc" ? "desc" : "asc");
    } else {
      // New field, default to desc
      setLocalSortBy(field);
      setLocalSortOrder("desc");
    }
    // Call parent handler if provided
    if (onSort) {
      onSort(field);
    }
  };

  // Apply client-side filtering and sorting
  const filteredApplications = useMemo(() => {
    let filtered = [...applications];

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // Filter by date range
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter((app) => {
        const appDate = new Date(app.createdAt);
        return appDate >= fromDate;
      });
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((app) => {
        const appDate = new Date(app.createdAt);
        return appDate <= toDate;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (localSortBy) {
        case "candidate":
          aValue = a.candidate.fullName.toLowerCase();
          bValue = b.candidate.fullName.toLowerCase();
          break;
        case "job":
          aValue = a.job.title.toLowerCase();
          bValue = b.job.title.toLowerCase();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "submittedAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return localSortOrder === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return localSortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [
    applications,
    statusFilter,
    dateFrom,
    dateTo,
    localSortBy,
    localSortOrder,
  ]);

  const columns = DEFAULT_COLUMNS.filter((c) => visibleColumns.includes(c.id));

  const handleSelectAll = (checked: boolean): void => {
    if (checked) {
      onSelectionChange(filteredApplications.map((app) => app.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean): void => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleColumnToggle = (columnId: string): void => {
    setVisibleColumns((prev) => {
      if (prev.includes(columnId)) {
        // Don't allow hiding all columns
        if (prev.length <= 1) return prev;
        return prev.filter((id) => id !== columnId);
      } else {
        return [...prev, columnId];
      }
    });
  };

  const handleClearFilters = (): void => {
    setStatusFilter("ALL");
    setDateFrom("");
    setDateTo("");
  };

  const hasActiveFilters = statusFilter !== "ALL" || dateFrom || dateTo;

  if (loading) {
    return (
      <div className="application-table-wrapper">
        <div className="loading-state">
          <div className="spinner"></div>
          <div className="loading-text">Loading applications...</div>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="application-table-wrapper">
        <div className="empty-state">
          <div className="empty-icon">
            <svg
              style={{ width: "36px", height: "36px" }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="empty-title">No applications found</h3>
          <p className="empty-description">
            Adjust your filters to see more results or check back later for new
            applications.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Filter Section */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          border: "1px solid #E9ECEF",
          padding: "24px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          {/* Left Side - Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              paddingTop: "4px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <i
                className="fi fi-rr-filter"
                style={{ fontSize: "20px", color: "#3498DB" }}
              ></i>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#2D3E50",
                  margin: 0,
                  whiteSpace: "nowrap",
                }}
              >
                Filter Applications
              </h3>
            </div>
            <p
              style={{
                fontSize: "13px",
                color: "#6C757D",
                margin: 0,
              }}
            >
              Refine results by status and date range
            </p>
          </div>

          {/* Right Side - Filters */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            {/* Status Filter */}
            <div style={{ minWidth: "180px" }}>
              <label
                htmlFor="status-filter"
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#495057",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as ApplicationStatus | "ALL")
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: "14px",
                  color: "#2D3E50",
                  backgroundColor: "#FFFFFF",
                  border: "2px solid #DEE2E6",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontWeight: 500,
                  marginLeft: "0px",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#3498DB";
                  e.currentTarget.style.backgroundColor = "#F8F9FA";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#DEE2E6";
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value={ApplicationStatus.APPLIED}>Applied</option>
                <option value={ApplicationStatus.REVIEWING}>Reviewing</option>
                <option value={ApplicationStatus.INTERVIEW}>Interview</option>
                <option value={ApplicationStatus.OFFER}>Offer</option>
                <option value={ApplicationStatus.HIRED}>Hired</option>
                <option value={ApplicationStatus.REJECTED}>Rejected</option>
              </select>
            </div>

            {/* Date From Filter */}
            <div style={{ minWidth: "160px" }}>
              <label
                htmlFor="date-from"
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#495057",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                From Date
              </label>
              <input
                type="date"
                id="date-from"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                max={dateTo || undefined}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: "14px",
                  color: "#2D3E50",
                  backgroundColor: "#FFFFFF",
                  border: "2px solid #DEE2E6",
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                  fontWeight: 500,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#3498DB";
                  e.currentTarget.style.backgroundColor = "#F8F9FA";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#DEE2E6";
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                }}
              />
            </div>

            {/* Date To Filter */}
            <div style={{ minWidth: "160px" }}>
              <label
                htmlFor="date-to"
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#495057",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                To Date
              </label>
              <input
                type="date"
                id="date-to"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                min={dateFrom || undefined}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: "14px",
                  color: "#2D3E50",
                  backgroundColor: "#FFFFFF",
                  border: "2px solid #DEE2E6",
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                  fontWeight: 500,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#3498DB";
                  e.currentTarget.style.backgroundColor = "#F8F9FA";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#DEE2E6";
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                }}
              />
            </div>

            {/* Clear Button */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                style={{
                  padding: "10px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#E74C3C",
                  backgroundColor: "#FFFFFF",
                  border: "2px solid #E74C3C",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                  height: "42px",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#E74C3C";
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                  e.currentTarget.style.color = "#E74C3C";
                }}
              >
                <i className="fi fi-rr-cross-circle"></i>
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Results Summary */}
        {hasActiveFilters && (
          <div
            style={{
              marginTop: "16px",
              padding: "12px 16px",
              backgroundColor: "#EBF5FB",
              border: "1px solid #AED6F1",
              borderRadius: "6px",
              fontSize: "13px",
              color: "#1F618D",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="fi fi-rr-info" style={{ fontSize: "14px" }}></i>
              <span>
                Showing <strong>{filteredApplications.length}</strong> of{" "}
                <strong>{applications.length}</strong> applications
                {statusFilter !== "ALL" && (
                  <span>
                    {" "}
                    • Status: <strong>{statusFilter}</strong>
                  </span>
                )}
                {dateFrom && (
                  <span>
                    {" "}
                    • From:{" "}
                    <strong>{new Date(dateFrom).toLocaleDateString()}</strong>
                  </span>
                )}
                {dateTo && (
                  <span>
                    {" "}
                    • To:{" "}
                    <strong>{new Date(dateTo).toLocaleDateString()}</strong>
                  </span>
                )}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="application-table-wrapper">
        <div
          className="table-toolbar"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px",
            backgroundColor: "#F8F9FA",
            borderRadius: "8px 8px 0 0",
            borderBottom: "1px solid #E9ECEF",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#495057",
              }}
            >
              {pagination ? (
                <>
                  Showing{" "}
                  <span style={{ color: "#3498DB" }}>
                    {pagination.totalElements > 0
                      ? pagination.page * pagination.size + 1
                      : 0}
                  </span>{" "}
                  -{" "}
                  <span style={{ color: "#3498DB" }}>
                    {Math.min(
                      (pagination.page + 1) * pagination.size,
                      pagination.totalElements
                    )}
                  </span>{" "}
                  of{" "}
                  <span style={{ color: "#3498DB" }}>
                    {pagination.totalElements}
                  </span>{" "}
                  applications
                </>
              ) : (
                <>
                  {filteredApplications.length}{" "}
                  {filteredApplications.length === 1
                    ? "application"
                    : "applications"}
                  {hasActiveFilters && (
                    <span style={{ color: "#6C757D", marginLeft: "4px" }}>
                      (filtered from {applications.length})
                    </span>
                  )}
                </>
              )}
            </div>
            {pagination && onPageSizeChange && (
              <select
                value={pagination.size}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                style={{
                  padding: "6px 12px",
                  fontSize: "13px",
                  border: "1px solid #DEE2E6",
                  borderRadius: "6px",
                  backgroundColor: "#FFFFFF",
                  color: "#495057",
                  cursor: "pointer",
                }}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            )}
          </div>
          <div className="table-actions">
            <ColumnSettings
              columns={DEFAULT_COLUMNS}
              visibleColumns={visibleColumns}
              onToggle={handleColumnToggle}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="application-table">
            <TableHeader
              columns={columns}
              sortBy={localSortBy}
              sortOrder={localSortOrder}
              onSort={handleSort}
              selectedCount={selectedIds.length}
              totalCount={filteredApplications.length}
              onSelectAll={handleSelectAll}
            />
            <tbody>
              {filteredApplications.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    style={{
                      textAlign: "center",
                      padding: "60px 20px",
                      color: "#6C757D",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "48px",
                        marginBottom: "16px",
                        opacity: 0.3,
                      }}
                    >
                      <i className="fi fi-rr-search-alt"></i>
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        marginBottom: "8px",
                      }}
                    >
                      No applications found
                    </div>
                    <div style={{ fontSize: "14px" }}>
                      {hasActiveFilters
                        ? "Try adjusting your filters to see more results"
                        : "No applications available"}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApplications.map((application) => (
                  <TableRow
                    key={application.id}
                    application={application}
                    columns={columns}
                    selected={selectedIds.includes(application.id)}
                    onSelect={(checked) =>
                      handleSelectOne(application.id, checked)
                    }
                    onRowAction={onRowAction}
                    onStatusUpdated={onStatusUpdated}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {pagination && onPageChange && pagination.totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 24px",
              backgroundColor: "#F8F9FA",
              borderRadius: "0 0 8px 8px",
              borderTop: "1px solid #E9ECEF",
            }}
          >
            <div style={{ fontSize: "14px", color: "#6C757D" }}>
              Page{" "}
              <span style={{ fontWeight: 600, color: "#495057" }}>
                {pagination.page + 1}
              </span>{" "}
              of{" "}
              <span style={{ fontWeight: 600, color: "#495057" }}>
                {pagination.totalPages}
              </span>
            </div>

            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {/* First Page */}
              <button
                onClick={() => onPageChange(0)}
                disabled={pagination.first}
                style={{
                  padding: "8px 12px",
                  fontSize: "14px",
                  fontWeight: 600,
                  border: "1px solid #DEE2E6",
                  borderRadius: "6px",
                  backgroundColor: pagination.first ? "#E9ECEF" : "#FFFFFF",
                  color: pagination.first ? "#ADB5BD" : "#495057",
                  cursor: pagination.first ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                onMouseOver={(e) => {
                  if (!pagination.first) {
                    e.currentTarget.style.backgroundColor = "#3498DB";
                    e.currentTarget.style.borderColor = "#3498DB";
                    e.currentTarget.style.color = "#FFFFFF";
                  }
                }}
                onMouseOut={(e) => {
                  if (!pagination.first) {
                    e.currentTarget.style.backgroundColor = "#FFFFFF";
                    e.currentTarget.style.borderColor = "#DEE2E6";
                    e.currentTarget.style.color = "#495057";
                  }
                }}
                title="First page"
              >
                <i className="fi fi-rr-angle-double-left"></i>
              </button>

              {/* Previous Page */}
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={!pagination.hasPrevious}
                style={{
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: 600,
                  border: "1px solid #DEE2E6",
                  borderRadius: "6px",
                  backgroundColor: !pagination.hasPrevious
                    ? "#E9ECEF"
                    : "#FFFFFF",
                  color: !pagination.hasPrevious ? "#ADB5BD" : "#495057",
                  cursor: !pagination.hasPrevious ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
                onMouseOver={(e) => {
                  if (pagination.hasPrevious) {
                    e.currentTarget.style.backgroundColor = "#3498DB";
                    e.currentTarget.style.borderColor = "#3498DB";
                    e.currentTarget.style.color = "#FFFFFF";
                  }
                }}
                onMouseOut={(e) => {
                  if (pagination.hasPrevious) {
                    e.currentTarget.style.backgroundColor = "#FFFFFF";
                    e.currentTarget.style.borderColor = "#DEE2E6";
                    e.currentTarget.style.color = "#495057";
                  }
                }}
              >
                <i className="fi fi-rr-angle-left"></i>
                Previous
              </button>

              {/* Page Numbers */}
              <div style={{ display: "flex", gap: "4px" }}>
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    let pageNum: number;
                    if (pagination.totalPages <= 5) {
                      pageNum = i;
                    } else if (pagination.page < 3) {
                      pageNum = i;
                    } else if (pagination.page > pagination.totalPages - 3) {
                      pageNum = pagination.totalPages - 5 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }

                    const isActive = pageNum === pagination.page;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        style={{
                          width: "40px",
                          height: "40px",
                          fontSize: "14px",
                          fontWeight: 600,
                          border: isActive
                            ? "2px solid #3498DB"
                            : "1px solid #DEE2E6",
                          borderRadius: "6px",
                          backgroundColor: isActive ? "#3498DB" : "#FFFFFF",
                          color: isActive ? "#FFFFFF" : "#495057",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseOver={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = "#EBF5FB";
                            e.currentTarget.style.borderColor = "#3498DB";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = "#FFFFFF";
                            e.currentTarget.style.borderColor = "#DEE2E6";
                          }
                        }}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  }
                )}
              </div>

              {/* Next Page */}
              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
                style={{
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: 600,
                  border: "1px solid #DEE2E6",
                  borderRadius: "6px",
                  backgroundColor: !pagination.hasNext ? "#E9ECEF" : "#FFFFFF",
                  color: !pagination.hasNext ? "#ADB5BD" : "#495057",
                  cursor: !pagination.hasNext ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
                onMouseOver={(e) => {
                  if (pagination.hasNext) {
                    e.currentTarget.style.backgroundColor = "#3498DB";
                    e.currentTarget.style.borderColor = "#3498DB";
                    e.currentTarget.style.color = "#FFFFFF";
                  }
                }}
                onMouseOut={(e) => {
                  if (pagination.hasNext) {
                    e.currentTarget.style.backgroundColor = "#FFFFFF";
                    e.currentTarget.style.borderColor = "#DEE2E6";
                    e.currentTarget.style.color = "#495057";
                  }
                }}
              >
                Next
                <i className="fi fi-rr-angle-right"></i>
              </button>

              {/* Last Page */}
              <button
                onClick={() => onPageChange(pagination.totalPages - 1)}
                disabled={pagination.last}
                style={{
                  padding: "8px 12px",
                  fontSize: "14px",
                  fontWeight: 600,
                  border: "1px solid #DEE2E6",
                  borderRadius: "6px",
                  backgroundColor: pagination.last ? "#E9ECEF" : "#FFFFFF",
                  color: pagination.last ? "#ADB5BD" : "#495057",
                  cursor: pagination.last ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                onMouseOver={(e) => {
                  if (!pagination.last) {
                    e.currentTarget.style.backgroundColor = "#3498DB";
                    e.currentTarget.style.borderColor = "#3498DB";
                    e.currentTarget.style.color = "#FFFFFF";
                  }
                }}
                onMouseOut={(e) => {
                  if (!pagination.last) {
                    e.currentTarget.style.backgroundColor = "#FFFFFF";
                    e.currentTarget.style.borderColor = "#DEE2E6";
                    e.currentTarget.style.color = "#495057";
                  }
                }}
                title="Last page"
              >
                <i className="fi fi-rr-angle-double-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add animation CSS */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default ApplicationTable;
