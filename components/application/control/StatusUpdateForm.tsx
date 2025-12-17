"use client";

import React, { useState } from 'react';
import { ApplicationStatus } from '@/types/application/application';

interface StatusUpdateFormProps {
  currentStatus: ApplicationStatus;
  onSubmit: (status: string, reason?: string) => Promise<void>;
}

const STATUS_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  [ApplicationStatus.DRAFT]: [ApplicationStatus.APPLIED],
  [ApplicationStatus.APPLIED]: [ApplicationStatus.REVIEWING, ApplicationStatus.REJECTED],
  [ApplicationStatus.REVIEWING]: [ApplicationStatus.INTERVIEW, ApplicationStatus.REJECTED],
  [ApplicationStatus.INTERVIEW]: [ApplicationStatus.OFFER, ApplicationStatus.REJECTED],
  [ApplicationStatus.OFFER]: [ApplicationStatus.HIRED, ApplicationStatus.REJECTED],
  [ApplicationStatus.HIRED]: [], // Terminal
  [ApplicationStatus.REJECTED]: [], // Terminal
  [ApplicationStatus.WITHDRAWN]: [] // Terminal
};

const StatusUpdateForm = ({ currentStatus, onSubmit }: StatusUpdateFormProps): React.ReactElement => {
  const [newStatus, setNewStatus] = useState<string>('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableStatuses = STATUS_TRANSITIONS[currentStatus] || [];

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!newStatus) return;

    setIsSubmitting(true);
    try {
      await onSubmit(newStatus, reason || undefined);
      setNewStatus('');
      setReason('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (availableStatuses.length === 0) {
    return (
      <div className="alert alert-info">
        This application is in a terminal state and cannot be updated.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">New Status</label>
        <select
          className="form-select"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          required
        >
          <option value="">Select new status...</option>
          {availableStatuses.map(status => (
            <option key={status} value={status}>
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Reason (Optional)</label>
        <textarea
          className="form-control"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Explain the reason for this status change..."
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={!newStatus || isSubmitting}
      >
        {isSubmitting ? 'Updating...' : 'Update Status'}
      </button>
    </form>
  );
};

export default StatusUpdateForm;
