"use client";

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectApplicationStatus,
  setStatus,
  resetFilters
} from '@/redux/features/application/applicationFilterSlice';
import { ApplicationStatus } from '@/types/application/application';

interface ApplicationFilterPanelProps {
  hrView?: boolean;
}

const ApplicationFilterPanel = ({ hrView = false }: ApplicationFilterPanelProps): React.ReactElement => {
  const dispatch = useAppDispatch();
  const currentStatus = useAppSelector(selectApplicationStatus);

  // HR view supports all statuses including terminal states
  const hrStatuses = hrView ? [
    ApplicationStatus.APPLIED,
    ApplicationStatus.REVIEWING,
    ApplicationStatus.INTERVIEW,
    ApplicationStatus.OFFER,
    ApplicationStatus.HIRED,
    ApplicationStatus.REJECTED,
    ApplicationStatus.WITHDRAWN
  ] : [
    ApplicationStatus.APPLIED,
    ApplicationStatus.REVIEWING,
    ApplicationStatus.INTERVIEW,
    ApplicationStatus.OFFER,
    ApplicationStatus.HIRED,
    ApplicationStatus.REJECTED
  ];

  const handleStatusChange = (status: ApplicationStatus | null): void => {
    dispatch(setStatus(status));
  };

  const handleResetFilters = (): void => {
    dispatch(resetFilters());
  };

  return (
    <div className="sidebar-shadow none-shadow mb-30">
      <div className="sidebar-filters">
        <div className="filter-block head-border mb-30">
          <h5>
            Filter Applications
            <a className="link-reset" onClick={handleResetFilters}>
              Reset
            </a>
          </h5>
        </div>

        {/* Status Filter */}
        <div className="filter-block mb-30">
          <div className="form-group">
            <label className="lb-slider">Status</label>
            <div className="list-checkbox">
              <div className="checkbox-item">
                <label className="cb-container">
                  <input
                    type="radio"
                    name="status"
                    checked={currentStatus === null}
                    onChange={() => handleStatusChange(null)}
                  />
                  <span className="text-small">All Statuses</span>
                  <span className="checkmark" />
                </label>
              </div>

              {hrStatuses.map(status => (
                <div className="checkbox-item" key={status}>
                  <label className="cb-container">
                    <input
                      type="radio"
                      name="status"
                      checked={currentStatus === status}
                      onChange={() => handleStatusChange(status)}
                    />
                    <span className="text-small">
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </span>
                    <span className="checkmark" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFilterPanel;
