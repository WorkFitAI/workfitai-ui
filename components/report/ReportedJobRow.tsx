"use client";

import Link from "next/link";
import { ReportedJob, ReportStatus } from "@/types/job/report";

interface Props {
  job: ReportedJob;
  onView: (job: ReportedJob) => void;
  onChangeStatus: (job: ReportedJob) => void;
  onDelete: (jobId: string) => void;
}

const statusBadgeMap: Record<ReportStatus, string> = {
  PENDING: "bg-warning text-dark",
  IN_PROGRESS: "bg-info text-dark",
  RESOLVED: "bg-success",
  DECLINE: "bg-danger",
};

export default function ReportedJobRow({
  job,
  onView,
  onChangeStatus,
  onDelete,
}: Props) {
  return (
    <tr>
      {/* JOB ID → LINK */}
      <td className="fw-monospace small">
        <Link
          href={`/job-details/${job.jobId}`}
          className="text-decoration-none text-primary fw-semibold"
        >
          {job.jobId}
        </Link>
      </td>

      <td>{job.companyName}</td>

      {/* STATUS */}
      <td>
        <span
          className={`badge ${
            statusBadgeMap[job.status]
          } px-3 py-2 rounded-pill`}
        >
          {job.status.replace("_", " ")}
        </span>
      </td>

      <td>{job.reportCount}</td>

      {/* ACTIONS */}
      <td className="text-end">
        <div className="btn-group btn-group-sm">
          <button
            className="btn btn-outline-primary rounded-3 m-1 p-3"
            onClick={() => onView(job)}
          >
            View reports
          </button>

          <button
            className="btn btn-outline-secondary rounded-3 m-1 p-3"
            onClick={() => onChangeStatus(job)}
          >
            Change status
          </button>

          <button
            className={`btn rounded-3 m-1 p-3 ${
              job.deleted ? "btn-outline-secondary" : "btn-outline-danger"
            }`}
            disabled={job.deleted}
            onClick={() => onDelete(job.jobId)}
          >
            {job.deleted ? "Deleted" : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}
