"use client";

import React from "react";

interface Props {
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
}

const STATUS_CONFIG = {
  DRAFT: {
    label: "Draft",
    color: "#6c757d",
  },
  PUBLISHED: {
    label: "Published",
    color: "#28a745",
  },
  CLOSED: {
    label: "Closed",
    color: "#dc3545",
  },
};

const JobStatusBadge: React.FC<Props> = ({ status }) => {
  const cfg = STATUS_CONFIG[status];

  return (
    <span
      style={{
        padding: "6px 12px",
        borderRadius: "999px",
        backgroundColor: cfg.color,
        color: "white",
        fontSize: "13px",
        fontWeight: 600,
      }}
    >
      {cfg.label}
    </span>
  );
};

export default JobStatusBadge;
