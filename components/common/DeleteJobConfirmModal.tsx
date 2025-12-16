"use client";

import { useEffect } from "react";

interface Props {
  open: boolean;
  jobId: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteJobConfirmModal({
  open,
  jobId,
  onClose,
  onConfirm,
}: Props) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !jobId) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="modal-backdrop fade show opacity-25"
        style={{ zIndex: 1040 }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="position-fixed top-50 start-50 translate-middle"
        style={{ zIndex: 1050, minWidth: 420 }}
      >
        <div className="card shadow-lg border-0">
          <div className="card-header bg-danger text-white">
            <h5 className="mb-0">Confirm delete</h5>
          </div>

          <div className="card-body">
            <p>
              Are you sure you want to delete job:
              <br />
              <strong className="text-danger">{jobId}</strong>
            </p>
            <p className="text-muted mb-0">This action cannot be undone.</p>
          </div>

          <div className="card-footer d-flex justify-content-end gap-2">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
