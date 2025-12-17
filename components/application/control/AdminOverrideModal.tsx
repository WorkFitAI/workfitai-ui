"use client";

import { useState } from 'react';
import { adminOverrideApplication } from '@/lib/applicationApi';
import { ApplicationStatus } from '@/types/application/application';

interface AdminOverrideModalProps {
  applicationId: string;
  currentStatus: ApplicationStatus;
  currentAssignedTo?: string;
  onSuccess: () => void;
  onClose: () => void;
}

const AdminOverrideModal = ({
  applicationId,
  currentStatus,
  currentAssignedTo,
  onSuccess,
  onClose
}: AdminOverrideModalProps) => {
  const [newStatus, setNewStatus] = useState<string>('');
  const [assignedTo, setAssignedTo] = useState(currentAssignedTo || '');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      alert('Reason is required for admin override');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminOverrideApplication(applicationId, {
        ...(newStatus && { status: newStatus }),
        ...(assignedTo && { assignedTo }),
        reason
      });
      alert('Override successful');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Admin override failed:', error);
      alert('Override failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Admin Override</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="alert alert-warning">
                <i className="fi fi-rr-triangle-warning me-2"></i>
                <strong>Warning:</strong> Admin override bypasses normal workflow validation.
                Use with caution.
              </div>

              <div className="mb-3">
                <label className="form-label">Override Status (Optional)</label>
                <select
                  className="form-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="">Keep current: {currentStatus}</option>
                  {Object.values(ApplicationStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Assign To (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="HR username"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Reason *</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why this override is necessary..."
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                disabled={isSubmitting || !reason.trim()}
              >
                {isSubmitting ? 'Processing...' : 'Override'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminOverrideModal;
