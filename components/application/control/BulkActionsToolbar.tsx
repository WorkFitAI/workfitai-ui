"use client";

import React, { useState } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { bulkUpdateStatus } from '@/redux/features/application/applicationSlice';
import { ApplicationStatus } from '@/types/application/application';

interface BulkActionsToolbarProps {
  selectedCount: number;
  selectedIds: string[];
  onAction: (action: string) => void;
  onClearSelection?: () => void;
}

const BulkActionsToolbar = ({
  selectedCount,
  selectedIds,
  onClearSelection
}: BulkActionsToolbarProps): React.ReactElement => {
  const dispatch = useAppDispatch();
  const [newStatus, setNewStatus] = useState<ApplicationStatus | ''>('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBulkStatusUpdate = async (): Promise<void> => {
    if (!newStatus) {
      alert('Please select a status');
      return;
    }

    if (!confirm(`Update ${selectedCount} application(s) to ${newStatus}?`)) {
      return;
    }

    setIsProcessing(true);
    try {
      const result = await dispatch(bulkUpdateStatus({
        applicationIds: selectedIds,
        status: newStatus as ApplicationStatus,
        reason: reason || undefined
      })).unwrap();

      alert(`Successfully updated ${result.successCount} application(s)`);
      if (result.failureCount > 0) {
        alert(`Failed to update ${result.failureCount} application(s)`);
      }

      setNewStatus('');
      setReason('');
      if (onClearSelection) {
        onClearSelection();
      }
    } catch {
      alert('Bulk update failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatStatusLabel = (status: ApplicationStatus): string => {
    return status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ');
  };

  return (
    <div className="bulk-actions-toolbar">
      <div className="bulk-info">
        <span className="bulk-count">
          {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
        </span>
        {onClearSelection && (
          <button
            className="btn-clear"
            onClick={onClearSelection}
            aria-label="Clear selection"
          >
            <i className="fi fi-rr-cross-small"></i>
          </button>
        )}
      </div>

      <div className="bulk-actions">
        <select
          className="form-select form-select-sm"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
          aria-label="Select new status"
        >
          <option value="">Change status to...</option>
          {Object.values(ApplicationStatus)
            .filter(s => s !== ApplicationStatus.DRAFT)
            .map(status => (
              <option key={status} value={status}>
                {formatStatusLabel(status)}
              </option>
            ))}
        </select>

        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          aria-label="Status change reason"
        />

        <button
          className="btn btn-sm btn-primary"
          onClick={handleBulkStatusUpdate}
          disabled={!newStatus || isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Updating...
            </>
          ) : (
            <>
              <i className="fi fi-rr-check me-2"></i>
              Update Status
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BulkActionsToolbar;
