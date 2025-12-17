"use client";

import { ReportStatus } from "@/types/job/report";

interface Props {
  value?: ReportStatus;
  onChange: (status?: ReportStatus) => void;
}

export default function ReportStatusFilter({ value, onChange }: Props) {
  return (
    <div className="d-flex align-items-center gap-2 mb-3">
      <label className="fw-semibold">Status:</label>

      <select
        className="form-select w-auto"
        value={value ?? ""}
        onChange={(e) =>
          onChange(
            e.target.value ? (e.target.value as ReportStatus) : undefined
          )
        }
      >
        <option value="">All</option>
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In progress</option>
        <option value="RESOLVED">Resolved</option>
        <option value="DECLINE">Decline</option>
      </select>
    </div>
  );
}
