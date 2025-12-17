"use client";

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectApplicationStatus,
  setStatus,
  resetFilters
} from '@/redux/features/application/applicationFilterSlice';
import { ApplicationStatus } from '@/types/application/application';

interface ApplicationFilterSidebarProps {
  candidateView?: boolean;
}

const ApplicationFilterSidebar = ({ candidateView = false }: ApplicationFilterSidebarProps): React.ReactElement => {
  const dispatch = useAppDispatch();
  const selectedStatus = useAppSelector(selectApplicationStatus);

  const handleStatusChange = (status: ApplicationStatus | null): void => {
    dispatch(setStatus(status));
  };

  const handleReset = (): void => {
    dispatch(resetFilters());
  };

  // Candidate sees limited statuses
  const statuses = candidateView
    ? [
        { value: null, label: 'All Statuses' },
        { value: ApplicationStatus.APPLIED, label: 'Applied' },
        { value: ApplicationStatus.REVIEWING, label: 'Under Review' },
        { value: ApplicationStatus.INTERVIEW, label: 'Interview' },
        { value: ApplicationStatus.OFFER, label: 'Offer' },
        { value: ApplicationStatus.HIRED, label: 'Hired' },
        { value: ApplicationStatus.REJECTED, label: 'Rejected' }
      ]
    : [
        { value: null, label: 'All Statuses' },
        ...Object.values(ApplicationStatus).map(status => ({
          value: status,
          label: status.charAt(0) + status.slice(1).toLowerCase()
        }))
      ];

  return (
    <div className="sidebar-shadow none-shadow mb-30">
      <div className="sidebar-filters">
        <div className="filter-block head-border mb-30">
          <h5>
            Filters
            <a
              href="#"
              className="link-reset"
              onClick={(e) => {
                e.preventDefault();
                handleReset();
              }}
            >
              Reset
            </a>
          </h5>
        </div>

        {/* Status Filter */}
        <div className="filter-block mb-30">
          <h6 className="mb-15">Status</h6>
          <ul className="list-checkbox">
            {statuses.map(status => (
              <li key={status.value || 'all'}>
                <label className="cb-container">
                  <input
                    type="radio"
                    name="status"
                    checked={selectedStatus === status.value}
                    onChange={() => handleStatusChange(status.value)}
                  />
                  <span className="text-small">{status.label}</span>
                  <span className="checkmark"></span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFilterSidebar;
