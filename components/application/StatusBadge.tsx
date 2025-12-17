"use client";

import React from "react";
import type { ApplicationStatus } from "@/types/application/application";

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: "sm" | "md" | "lg";
}

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  DRAFT: { label: "Draft", className: "status-badge--draft" },
  APPLIED: { label: "Applied", className: "status-badge--applied" },
  REVIEWING: { label: "Reviewing", className: "status-badge--reviewing" },
  INTERVIEW: { label: "Interview", className: "status-badge--interview" },
  OFFER: { label: "Offer", className: "status-badge--offer" },
  HIRED: { label: "Hired", className: "status-badge--hired" },
  REJECTED: { label: "Rejected", className: "status-badge--rejected" },
  WITHDRAWN: { label: "Withdrawn", className: "status-badge--withdrawn" },
};

const StatusBadge = ({
  status,
  size = "md",
}: StatusBadgeProps): React.ReactElement => {
  const config = STATUS_CONFIG[status];
  const sizeClass =
    size === "sm"
      ? "status-badge--sm"
      : size === "lg"
      ? "status-badge--lg"
      : "";

  return (
    <span className={`status-badge ${config.className} ${sizeClass}`}>
      <span className="status-dot" aria-hidden="true"></span>
      {config.label}
    </span>
  );
};

export default StatusBadge;
