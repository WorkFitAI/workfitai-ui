"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { ReportedJob } from "@/types/job/report";

interface Props {
  job: ReportedJob;
  onClose: () => void;
}

export default function ReportDetailModal({ job, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.classList.add("modal-open");

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Reports – {job.jobId}</h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {job.reports.map((r) => (
                <div key={r.reportId} className="border rounded p-3 mb-3">
                  <p className="mb-2">{r.reportContent}</p>

                  {r.imageUrls && r.imageUrls.length > 0 && (
                    <img
                      src={r.imageUrls[0]}
                      alt="report"
                      className="img-fluid rounded"
                    />
                  )}

                  <small className="text-muted">
                    {new Date(r.createdDate).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" />
    </>,
    document.body
  );
}
