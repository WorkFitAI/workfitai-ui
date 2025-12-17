"use client";

import { ReportedJob } from "@/types/job/report";
import { updateReportedJobStatus, deleteReportedJob } from "@/lib/reportApi";
import { toast } from "react-toastify";

interface Props {
  job: ReportedJob;
  onReload: () => void;
}

export default function JobStatusActions({ job, onReload }: Props) {
  const handleStatusChange = async (status: string) => {
    try {
      await updateReportedJobStatus(job.postId, status as any);
      toast.success("Job status updated");
      onReload();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this job permanently?")) return;

    try {
      await deleteReportedJob(job.postId);
      toast.success("Job deleted");
      onReload();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="btn-group">
      <button
        className="btn btn-sm btn-outline-warning"
        onClick={() => handleStatusChange("CLOSED")}
      >
        Close
      </button>
      <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
}
