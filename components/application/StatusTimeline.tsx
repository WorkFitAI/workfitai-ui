"use client";

import React from 'react';
import type { StatusChange } from '@/types/application/application';
import StatusBadge from './StatusBadge';

interface StatusTimelineProps {
  statusHistory: StatusChange[];
}

const StatusTimeline = ({ statusHistory }: StatusTimelineProps): React.ReactElement => {
  if (!statusHistory || statusHistory.length === 0) {
    return <p className="text-muted">No status history available</p>;
  }

  return (
    <div className="timeline">
      {statusHistory.map((change, index) => (
        <div key={index} className="timeline-item">
          <div className="timeline-marker">
            <i className="fi fi-rr-check-circle"></i>
          </div>
          <div className="timeline-content">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <StatusBadge status={change.newStatus} size="sm" />
                <span className="text-muted ms-2">
                  from <StatusBadge status={change.previousStatus} size="sm" />
                </span>
              </div>
              <small className="text-muted">
                {new Date(change.changedAt).toLocaleString()}
              </small>
            </div>
            <p className="mb-1">
              <strong>Changed by:</strong> {change.changedBy}
            </p>
            {change.reason && (
              <p className="text-muted mb-0">
                <strong>Reason:</strong> {change.reason}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusTimeline;
