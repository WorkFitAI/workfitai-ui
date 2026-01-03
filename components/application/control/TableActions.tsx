"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { Application } from "@/types/application/application";
import { ApplicationStatus } from "@/types/application/application";
import {
  downloadCV,
  updateStatus,
  assignApplication,
} from "@/lib/applicationApi";
import { useToast } from "@/components/application/common/Toast";
import { useAppSelector } from "@/redux/hooks";

interface TableActionsProps {
  application: Application;
  onAction?: (action: string, applicationId: string) => void;
  onStatusUpdated?: () => void;
  hrList?: string[]; // List of available HR usernames for assignment
}

// Status transitions map - defines valid status changes
const STATUS_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  [ApplicationStatus.DRAFT]: [ApplicationStatus.APPLIED],
  [ApplicationStatus.APPLIED]: [
    ApplicationStatus.REVIEWING,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.REVIEWING]: [
    ApplicationStatus.INTERVIEW,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.INTERVIEW]: [
    ApplicationStatus.OFFER,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.OFFER]: [
    ApplicationStatus.HIRED,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.HIRED]: [], // Terminal
  [ApplicationStatus.REJECTED]: [], // Terminal
  [ApplicationStatus.WITHDRAWN]: [], // Terminal
};

const TableActions = ({
  application,
  onAction,
  onStatusUpdated,
  hrList = [],
}: TableActionsProps): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showStatusSubmenu, setShowStatusSubmenu] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showAssignSubmenu, setShowAssignSubmenu] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  // Get user role from Redux store
  const userRoles = useAppSelector((state) => state.auth.user?.roles || []);
  const isHRManager = userRoles.includes("HR_MANAGER");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleDownloadCV = async (): Promise<void> => {
    setIsOpen(false);
    setIsDownloading(true);

    try {
      showToast({
        type: "info",
        title: "Downloading CV",
        message: "Preparing CV download...",
      });

      const blob = await downloadCV(application.id);

      // Create a temporary URL for the blob and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        application.cvFileName || `cv_${application.username}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast({
        type: "success",
        title: "CV Downloaded",
        message: `${application.cvFileName || "CV"} downloaded successfully`,
      });

      // Notify parent component if callback provided
      if (onAction) {
        onAction("downloadCV", application.id);
      }
    } catch (error) {
      console.error("[TableActions] Download CV error:", error);
      showToast({
        type: "error",
        title: "Download Failed",
        message:
          error instanceof Error
            ? error.message
            : "Failed to download CV. Please try again.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleUpdateStatus = (): void => {
    setShowStatusSubmenu(!showStatusSubmenu);
  };

  const handleStatusSelect = async (
    newStatus: ApplicationStatus
  ): Promise<void> => {
    setIsOpen(false);
    setShowStatusSubmenu(false);
    setIsUpdatingStatus(true);

    try {
      showToast({
        type: "info",
        title: "Updating Status",
        message: "Processing status update...",
        duration: 3000,
      });

      await updateStatus(application.id, { status: newStatus });

      showToast({
        type: "success",
        title: "Status Updated",
        message: `Application status changed to ${newStatus}`,
        duration: 5000,
      });

      // Notify parent to refresh data
      if (onStatusUpdated) {
        onStatusUpdated();
      }

      // Notify parent component
      if (onAction) {
        onAction("updateStatus", application.id);
      }
    } catch (error) {
      console.error("[TableActions] Update status error:", error);
      showToast({
        type: "error",
        title: "Update Failed",
        message:
          error instanceof Error
            ? error.message
            : "Failed to update status. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleToggleAssignSubmenu = (): void => {
    setShowAssignSubmenu(!showAssignSubmenu);
  };

  const handleAssignToHR = async (hrUsername: string): Promise<void> => {
    setIsOpen(false);
    setShowAssignSubmenu(false);
    setIsAssigning(true);

    try {
      showToast({
        type: "info",
        title: "Assigning Application",
        message: "Processing assignment...",
        duration: 3000,
      });

      await assignApplication(application.id, { assignedTo: hrUsername });

      showToast({
        type: "success",
        title: "Application Assigned",
        message: `Application assigned to ${hrUsername} successfully`,
        duration: 5000,
      });

      // Notify parent to refresh data
      if (onStatusUpdated) {
        onStatusUpdated();
      }

      // Notify parent component
      if (onAction) {
        onAction("assign", application.id);
      }
    } catch (error) {
      console.error("[TableActions] Assign application error:", error);
      showToast({
        type: "error",
        title: "Assignment Failed",
        message:
          error instanceof Error
            ? error.message
            : "Failed to assign application. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsAssigning(false);
    }
  };

  // Get available status options based on current status
  const availableStatuses = STATUS_TRANSITIONS[application.status] || [];
  const isTerminalStatus = availableStatuses.length === 0;

  return (
    <div className="actions-cell-wrapper" ref={dropdownRef}>
      <div className="actions-cell">
        <Link
          href={`/hr/applications/${application.id}`}
          className="action-button"
          title="View details"
        >
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>

        <button
          className="action-dropdown-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="More actions"
          aria-expanded={isOpen}
          aria-haspopup="true"
          title="More actions"
        >
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="action-dropdown-menu">
          <div className="action-dropdown-item-wrapper">
            <button
              className="action-dropdown-item"
              onClick={handleUpdateStatus}
              disabled={isTerminalStatus || isUpdatingStatus}
              title={
                isTerminalStatus
                  ? "This application is in a terminal state and cannot be updated"
                  : "Update application status"
              }
            >
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              {isUpdatingStatus ? "Updating..." : "Update Status"}
              {!isTerminalStatus && (
                <svg
                  style={{ marginLeft: "auto", width: "16px", height: "16px" }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            {showStatusSubmenu && !isTerminalStatus && (
              <div className="action-dropdown-submenu">
                {availableStatuses.map((status) => (
                  <button
                    key={status}
                    className="action-dropdown-item"
                    onClick={() => handleStatusSelect(status)}
                    disabled={isUpdatingStatus}
                  >
                    <span
                      className={`status-badge status-${status.toLowerCase()}`}
                    >
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {isHRManager && (
            <div className="action-dropdown-item-wrapper">
              <button
                className="action-dropdown-item"
                onClick={handleToggleAssignSubmenu}
                disabled={isAssigning || hrList.length === 0}
                title={
                  hrList.length === 0
                    ? "No HR users available for assignment"
                    : "Assign to HR"
                }
              >
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                {isAssigning ? "Assigning..." : "Assign to HR"}
                {hrList.length > 0 && (
                  <svg
                    style={{
                      marginLeft: "auto",
                      width: "16px",
                      height: "16px",
                    }}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              {showAssignSubmenu && hrList.length > 0 && (
                <div className="action-dropdown-submenu">
                  {hrList.map((hr) => (
                    <button
                      key={hr}
                      className="action-dropdown-item"
                      onClick={() => handleAssignToHR(hr)}
                      disabled={isAssigning}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <svg
                        style={{ width: "16px", height: "16px" }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{hr}</span>
                      {application.assignedTo === hr && (
                        <span
                          style={{
                            marginLeft: "auto",
                            fontSize: "11px",
                            color: "#27AE60",
                            fontWeight: 600,
                          }}
                        >
                          (Current)
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="action-dropdown-divider"></div>
          <button
            className="action-dropdown-item"
            onClick={handleDownloadCV}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <svg className="animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {isDownloading ? "Downloading..." : "Download CV"}
          </button>
        </div>
      )}
    </div>
  );
};
export default TableActions;
