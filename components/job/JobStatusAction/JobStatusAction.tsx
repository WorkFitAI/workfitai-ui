"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { putJob } from "@/lib/jobApi";
import { JobStatus } from "@/types/job/job";

interface Props {
  jobId: string;
  currentStatus: JobStatus;
}

const STATUS_OPTIONS = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Closed", value: "CLOSED" },
];

const JobStatusAction: React.FC<Props> = ({ jobId, currentStatus }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<JobStatus>(currentStatus);

  const handleChangeStatus = async (newStatus: JobStatus) => {
    if (newStatus === status) return;

    setLoading(true);
    try {
      await putJob(`/public/hr/jobs/${jobId}/${newStatus}`, {});
      setStatus(newStatus); // cập nhật UI ngay lập tức
      toast.success("Status updated!");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={status}
      disabled={loading}
      onChange={(e) => handleChangeStatus(e.target.value as JobStatus)}
      className="form-select"
      style={{ maxWidth: 200 }}
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default JobStatusAction;
