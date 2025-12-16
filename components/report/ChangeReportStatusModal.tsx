"use client";

import { useState } from "react";
import { ReportStatus } from "@/types/job/report";
import { toast } from "react-toastify";
import { updateReportedJobStatus } from "@/lib/reportApi";

interface Props {
  jobId: string;
  currentStatus: ReportStatus;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ChangeReportStatusModal({
  jobId,
  currentStatus,
  onClose,
  onSuccess,
}: Props) {
  const [status, setStatus] = useState<ReportStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await updateReportedJobStatus(jobId, status);

      toast.success("Report status updated");
      onSuccess();
      onClose();
    } catch (err) {
      const error = err as Error;
      toast.error(error.message ?? "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* BACKDROP */}
      <div className="modal-backdrop fade show" onClick={onClose} />

      {/* MODAL */}
      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Change report status</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ReportStatus)}
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="DECLINE">Decline</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Updating..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
