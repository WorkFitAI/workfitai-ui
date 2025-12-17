"use client";

import React from 'react';
import Link from 'next/link';
import type { Application } from '@/types/application/application';
import StatusBadge from './StatusBadge';

interface ApplicationCardProps {
  application: Application;
}

const ApplicationCard = ({ application }: ApplicationCardProps): React.ReactElement => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="card card-style-1 hover-up">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <h5 className="mb-2">
              <Link href={`/application/${application.id}`} className="text-dark">
                {application.jobSnapshot.title}
              </Link>
            </h5>
            <div className="d-flex gap-3 text-muted mb-2">
              <span>
                <i className="fi fi-rr-briefcase me-1"></i>
                {application.jobSnapshot.companyName}
              </span>
              <span>
                <i className="fi fi-rr-marker me-1"></i>
                {application.jobSnapshot.location}
              </span>
              <span>
                <i className="fi fi-rr-calendar me-1"></i>
                Applied {formatDate(application.submittedAt || application.createdAt)}
              </span>
            </div>
            {application.assignedTo && (
              <div className="text-muted">
                <i className="fi fi-rr-user me-1"></i>
                Assigned to: {application.assignedTo}
              </div>
            )}
          </div>

          <div className="col-lg-4 text-lg-end">
            <StatusBadge status={application.status} size="lg" />
            <div className="mt-3">
              <Link
                href={`/application/${application.id}`}
                className="btn btn-sm btn-outline-primary"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
