"use client";

import React from "react";
import type { StatusChange } from "@/types/application/application";
import StatusBadge from "./StatusBadge";

interface StatusTimelineProps {
  statusHistory: StatusChange[];
}

const STATUS_CONFIG: Record<
  string,
  { color: string; icon: string; label: string }
> = {
  DRAFT: { color: "#95A5A6", icon: "fi-rr-edit", label: "Draft Created" },
  APPLIED: {
    color: "#3498DB",
    icon: "fi-rr-paper-plane",
    label: "Application Submitted",
  },
  REVIEWING: { color: "#F39C12", icon: "fi-rr-search", label: "Under Review" },
  INTERVIEW: {
    color: "#9B59B6",
    icon: "fi-rr-users",
    label: "Interview Scheduled",
  },
  OFFER: {
    color: "#2ECC71",
    icon: "fi-rr-hand-holding-heart",
    label: "Offer Extended",
  },
  HIRED: { color: "#27AE60", icon: "fi-rr-badge-check", label: "Hired" },
  REJECTED: {
    color: "#E74C3C",
    icon: "fi-rr-cross-circle",
    label: "Application Rejected",
  },
  WITHDRAWN: {
    color: "#7F8C8D",
    icon: "fi-rr-undo",
    label: "Application Withdrawn",
  },
};

const StatusTimeline = ({
  statusHistory,
}: StatusTimelineProps): React.ReactElement => {
  if (!statusHistory || statusHistory.length === 0) {
    return (
      <div
        style={{
          padding: "32px 20px",
          textAlign: "center",
          backgroundColor: "#F8F9FA",
          borderRadius: "8px",
          border: "1px dashed #DEE2E6",
        }}
      >
        <i
          className="fi fi-rr-time-past"
          style={{ fontSize: "40px", color: "#CED4DA", marginBottom: "8px" }}
        ></i>
        <p style={{ fontSize: "14px", color: "#6C757D", marginBottom: 0 }}>
          No status history available
        </p>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", paddingTop: "8px" }}>
      {statusHistory.map((change, index) => {
        const isFirst = index === 0;
        const isLast = index === statusHistory.length - 1;
        const config = STATUS_CONFIG[change.newStatus] || {
          color: "#6C757D",
          icon: "fi-rr-circle",
          label: change.newStatus,
        };

        return (
          <div
            key={index}
            style={{
              position: "relative",
              paddingLeft: "48px",
              paddingBottom: isLast ? "0" : "24px",
            }}
          >
            {/* Timeline Line */}
            {!isLast && (
              <div
                style={{
                  position: "absolute",
                  left: "15px",
                  top: "40px",
                  bottom: "0",
                  width: "3px",
                  backgroundColor: "#E9ECEF",
                }}
              ></div>
            )}

            {/* Timeline Marker */}
            <div
              style={{
                position: "absolute",
                left: "0",
                top: "4px",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: config.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "3px solid #FFFFFF",
                boxShadow: isFirst
                  ? `0 0 0 2px ${config.color}, 0 4px 12px rgba(0, 0, 0, 0.15)`
                  : "0 2px 8px rgba(0, 0, 0, 0.1)",
                zIndex: 1,
              }}
            >
              <i
                className={`fi ${config.icon}`}
                style={{
                  fontSize: "14px",
                  color: "#FFFFFF",
                  fontWeight: 600,
                }}
              ></i>
            </div>

            {/* Timeline Content */}
            <div
              style={{
                backgroundColor: isFirst ? "#FFFFFF" : "#F8F9FA",
                border: isFirst
                  ? "2px solid " + config.color
                  : "1px solid #E9ECEF",
                borderRadius: "8px",
                padding: "16px",
                transition: "all 0.2s ease",
                marginBottom: "4px",
              }}
            >
              {/* Event Title */}
              <div style={{ marginBottom: "12px" }}>
                <h6
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: config.color,
                    marginBottom: "4px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {config.label}
                  {isFirst && (
                    <span
                      style={{
                        marginLeft: "8px",
                        padding: "2px 8px",
                        fontSize: "10px",
                        fontWeight: 700,
                        backgroundColor: config.color,
                        color: "#FFFFFF",
                        borderRadius: "4px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Current
                    </span>
                  )}
                </h6>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <StatusBadge status={change.newStatus} size="sm" />
                </div>
              </div>

              {/* Date & Time with icon */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "13px",
                  color: "#6C757D",
                  marginBottom: "8px",
                }}
              >
                <i
                  className="fi fi-rr-clock"
                  style={{
                    marginRight: "8px",
                    fontSize: "14px",
                    color: "#ADB5BD",
                  }}
                ></i>
                <span>
                  {new Date(change.changedAt).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                  {" at "}
                  {new Date(change.changedAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Changed By */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "13px",
                  color: "#495057",
                  marginBottom: change.reason ? "12px" : "0",
                }}
              >
                <i
                  className="fi fi-rr-user"
                  style={{
                    marginRight: "8px",
                    fontSize: "14px",
                    color: "#ADB5BD",
                  }}
                ></i>
                <span>
                  <span style={{ fontWeight: 500 }}>By:</span>{" "}
                  <span style={{ fontWeight: 600, color: "#212529" }}>
                    {change.changedBy}
                  </span>
                </span>
              </div>

              {/* Reason */}
              {change.reason && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "12px 14px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "6px",
                    borderLeft: "3px solid " + config.color,
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <i
                      className="fi fi-rr-comment-info"
                      style={{
                        fontSize: "13px",
                        color: config.color,
                        marginRight: "6px",
                      }}
                    ></i>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#6C757D",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontWeight: 700,
                      }}
                    >
                      Note
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#495057",
                      marginBottom: 0,
                      lineHeight: "1.6",
                      fontStyle: "italic",
                    }}
                  >
                    &quot;{change.reason}&quot;
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusTimeline;
