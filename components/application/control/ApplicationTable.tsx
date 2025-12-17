"use client";

import React, { useState, useEffect } from "react";
import type { Application } from "@/types/application/application";
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

  const columns = DEFAULT_COLUMNS.filter((c) => visibleColumns.includes(c.id));

  const handleSelectAll = (checked: boolean): void => {
    if (checked) {
      onSelectionChange(applications.map((app) => app.id));
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

  const handleClearSelection = (): void => {
    onSelectionChange([]);
  };

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
      {/* Bulk Actions Toolbar */}
      {selectedIds.length > 0 && (
        <BulkActionsToolbar
          selectedCount={selectedIds.length}
          selectedIds={selectedIds}
          onAction={onBulkAction}
          onClearSelection={handleClearSelection}
        />
      )}

      {/* Table */}
      <div className="application-table-wrapper">
        <div className="table-toolbar">
          <div className="table-info">
            {applications.length}{" "}
            {applications.length === 1 ? "application" : "applications"}
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
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
              selectedCount={selectedIds.length}
              totalCount={applications.length}
              onSelectAll={handleSelectAll}
            />
            <tbody>
              {applications.map((application) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ApplicationTable;
