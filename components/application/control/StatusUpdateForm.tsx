"use client";

import React, { useState } from "react";
import { ApplicationStatus } from "@/types/application/application";

interface StatusUpdateFormProps {
  currentStatus: ApplicationStatus;
  onSubmit: (status: string, reason?: string) => Promise<void>;
}

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

const StatusUpdateForm = ({
  currentStatus,
  onSubmit,
}: StatusUpdateFormProps): React.ReactElement => {
  const [newStatus, setNewStatus] = useState<string>("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableStatuses = STATUS_TRANSITIONS[currentStatus] || [];

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!newStatus) return;

    setIsSubmitting(true);
    try {
      await onSubmit(newStatus, reason || undefined);
      setNewStatus("");
      setReason("");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (availableStatuses.length === 0) {
    return (
      <div
        style={{
          padding: "16px",
          backgroundColor: "#E9ECEF",
          border: "1px solid #CED4DA",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: "#6C757D",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "12px",
            flexShrink: 0,
          }}
        >
          <i
            className="fi fi-rr-info"
            style={{ color: "#FFFFFF", fontSize: "18px" }}
          ></i>
        </div>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#495057",
              fontWeight: 500,
            }}
          >
            This application is in a terminal state and cannot be updated.
          </p>
        </div>
      </div>
    );
  }

  const STATUS_INFO: Record<
    string,
    { color: string; icon: string; description: string }
  > = {
    APPLIED: {
      color: "#3498DB",
      icon: "fi-rr-paper-plane",
      description: "Application has been submitted",
    },
    REVIEWING: {
      color: "#F39C12",
      icon: "fi-rr-search",
      description: "Application is under review",
    },
    INTERVIEW: {
      color: "#9B59B6",
      icon: "fi-rr-users",
      description: "Interview scheduled with candidate",
    },
    OFFER: {
      color: "#2ECC71",
      icon: "fi-rr-hand-holding-heart",
      description: "Job offer has been extended",
    },
    HIRED: {
      color: "#27AE60",
      icon: "fi-rr-badge-check",
      description: "Candidate has been hired",
    },
    REJECTED: {
      color: "#E74C3C",
      icon: "fi-rr-cross-circle",
      description: "Application has been rejected",
    },
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          className="form-label"
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#495057",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "12px",
            display: "block",
          }}
        >
          Select New Status <span style={{ color: "#E74C3C" }}>*</span>
        </label>
        <div style={{ display: "grid", gap: "12px" }}>
          {availableStatuses.map((status) => {
            const info = STATUS_INFO[status];
            const isSelected = newStatus === status;
            return (
              <div
                key={status}
                onClick={() => setNewStatus(status)}
                style={{
                  padding: "16px",
                  border: isSelected
                    ? `2px solid ${info?.color || "#3498DB"}`
                    : "2px solid #E9ECEF",
                  borderRadius: "8px",
                  backgroundColor: isSelected ? `${info?.color}10` : "#FFFFFF",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "#F8F9FA";
                    e.currentTarget.style.borderColor =
                      info?.color || "#3498DB";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "#FFFFFF";
                    e.currentTarget.style.borderColor = "#E9ECEF";
                  }
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "8px",
                    backgroundColor: info?.color || "#3498DB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i
                    className={`fi ${info?.icon || "fi-rr-circle"}`}
                    style={{ fontSize: "20px", color: "#FFFFFF" }}
                  ></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#212529",
                      marginBottom: "4px",
                    }}
                  >
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#6C757D",
                      lineHeight: "1.4",
                    }}
                  >
                    {info?.description || ""}
                  </div>
                </div>
                {isSelected && (
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: info?.color || "#3498DB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      className="fi fi-rr-check"
                      style={{ fontSize: "12px", color: "#FFFFFF" }}
                    ></i>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-3">
        <label
          className="form-label"
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#495057",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "8px",
          }}
        >
          Reason{" "}
          <span
            style={{
              color: "#6C757D",
              fontSize: "11px",
              fontWeight: 400,
              textTransform: "none",
              letterSpacing: "0",
            }}
          >
            (Optional)
          </span>
        </label>
        <textarea
          className="form-control"
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Explain the reason for this status change..."
          style={{
            padding: "12px 16px",
            fontSize: "14px",
            border: "1px solid #DEE2E6",
            borderRadius: "6px",
            backgroundColor: "#FFFFFF",
            color: "#212529",
            lineHeight: "1.5",
            transition: "all 0.2s ease",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#3498DB";
            e.currentTarget.style.boxShadow =
              "0 0 0 3px rgba(52, 152, 219, 0.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#DEE2E6";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        <small
          style={{
            fontSize: "12px",
            color: "#6C757D",
            marginTop: "4px",
            display: "block",
          }}
        >
          This reason will be visible in the application timeline
        </small>
      </div>

      <div className="d-flex gap-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!newStatus || isSubmitting}
          style={{
            padding: "12px 32px",
            fontSize: "15px",
            fontWeight: 600,
            borderRadius: "6px",
            border: "none",
            backgroundColor: !newStatus || isSubmitting ? "#ADB5BD" : "#3498DB",
            color: "#FFFFFF",
            transition: "all 0.2s ease",
            cursor: !newStatus || isSubmitting ? "not-allowed" : "pointer",
          }}
          onMouseOver={(e) => {
            if (newStatus && !isSubmitting) {
              e.currentTarget.style.backgroundColor = "#2980B9";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(52, 152, 219, 0.3)";
            }
          }}
          onMouseOut={(e) => {
            if (newStatus && !isSubmitting) {
              e.currentTarget.style.backgroundColor = "#3498DB";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }
          }}
        >
          {isSubmitting ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              Updating Status...
            </>
          ) : (
            <>
              <i className="fi fi-rr-check" style={{ marginRight: "6px" }}></i>
              Update Status
            </>
          )}
        </button>

        {newStatus && !isSubmitting && (
          <button
            type="button"
            onClick={() => {
              setNewStatus("");
              setReason("");
            }}
            style={{
              padding: "12px 24px",
              fontSize: "15px",
              fontWeight: 600,
              borderRadius: "6px",
              border: "1px solid #DEE2E6",
              backgroundColor: "#FFFFFF",
              color: "#6C757D",
              transition: "all 0.2s ease",
              cursor: "pointer",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#F8F9FA";
              e.currentTarget.style.borderColor = "#ADB5BD";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#FFFFFF";
              e.currentTarget.style.borderColor = "#DEE2E6";
            }}
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
};

export default StatusUpdateForm;
