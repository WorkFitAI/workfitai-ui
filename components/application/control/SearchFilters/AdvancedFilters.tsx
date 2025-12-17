"use client";

import React, { useState, useEffect } from 'react';
import { ApplicationStatus } from '@/types/application/application';

interface AdvancedFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onApply: () => void;
  onReset: () => void;
  availableJobs?: JobOption[];
  availableAssignees?: AssigneeOption[];
}

interface FilterState {
  statuses: ApplicationStatus[];
  jobIds: string[];
  assignedTo: string | null;
  dateRange: { from: string; to: string } | null;
}

interface JobOption {
  id: string;
  title: string;
  companyName: string;
}

interface AssigneeOption {
  username: string;
  name: string;
}

const ALL_STATUSES: { value: ApplicationStatus; label: string }[] = [
  { value: ApplicationStatus.DRAFT, label: 'Draft' },
  { value: ApplicationStatus.APPLIED, label: 'Applied' },
  { value: ApplicationStatus.REVIEWING, label: 'Reviewing' },
  { value: ApplicationStatus.INTERVIEW, label: 'Interview' },
  { value: ApplicationStatus.OFFER, label: 'Offer' },
  { value: ApplicationStatus.HIRED, label: 'Hired' },
  { value: ApplicationStatus.REJECTED, label: 'Rejected' },
  { value: ApplicationStatus.WITHDRAWN, label: 'Withdrawn' },
];

const AdvancedFilters = ({
  filters,
  onChange,
  onApply,
  onReset,
  availableJobs = [],
  availableAssignees = [],
}: AdvancedFiltersProps): React.ReactElement => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  // Sync local state with parent when filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleStatusToggle = (status: ApplicationStatus): void => {
    const newStatuses = localFilters.statuses.includes(status)
      ? localFilters.statuses.filter((s) => s !== status)
      : [...localFilters.statuses, status];

    const updatedFilters = { ...localFilters, statuses: newStatuses };
    setLocalFilters(updatedFilters);
    onChange(updatedFilters);
  };

  const handleJobToggle = (jobId: string): void => {
    const newJobIds = localFilters.jobIds.includes(jobId)
      ? localFilters.jobIds.filter((id) => id !== jobId)
      : [...localFilters.jobIds, jobId];

    const updatedFilters = { ...localFilters, jobIds: newJobIds };
    setLocalFilters(updatedFilters);
    onChange(updatedFilters);
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const assignedTo = e.target.value || null;
    const updatedFilters = { ...localFilters, assignedTo };
    setLocalFilters(updatedFilters);
    onChange(updatedFilters);
  };

  const handleDateChange = (field: 'from' | 'to', value: string): void => {
    const dateRange = localFilters.dateRange || { from: '', to: '' };
    const newDateRange = { ...dateRange, [field]: value };

    // Clear date range if both fields are empty
    const updatedFilters = {
      ...localFilters,
      dateRange: newDateRange.from || newDateRange.to ? newDateRange : null,
    };

    setLocalFilters(updatedFilters);
    onChange(updatedFilters);
  };

  const handleReset = (): void => {
    const resetFilters: FilterState = {
      statuses: [],
      jobIds: [],
      assignedTo: null,
      dateRange: null,
    };
    setLocalFilters(resetFilters);
    onChange(resetFilters);
    onReset();
  };

  const activeFilterCount =
    localFilters.statuses.length +
    localFilters.jobIds.length +
    (localFilters.assignedTo ? 1 : 0) +
    (localFilters.dateRange ? 1 : 0);

  return (
    <div className="advanced-filters">
      <div className="advanced-filters__header">
        <h4 className="advanced-filters__title">Advanced Filters</h4>
        {activeFilterCount > 0 && (
          <span className="advanced-filters__badge">{activeFilterCount} active</span>
        )}
      </div>

      <div className="advanced-filters__content">
        {/* Status Multi-Select */}
        <div className="filter-group">
          <label className="filter-group__label">Status</label>
          <div className="filter-group__checkboxes">
            {ALL_STATUSES.map((status) => (
              <label key={status.value} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={localFilters.statuses.includes(status.value)}
                  onChange={() => handleStatusToggle(status.value)}
                  aria-label={`Filter by ${status.label}`}
                />
                <span>{status.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="filter-group">
          <label className="filter-group__label">Date Range</label>
          <div className="date-range">
            <div className="date-range__field">
              <label htmlFor="date-from" className="date-range__field-label">
                From
              </label>
              <input
                id="date-from"
                type="date"
                className="date-range__input"
                value={localFilters.dateRange?.from || ''}
                onChange={(e) => handleDateChange('from', e.target.value)}
                aria-label="Start date"
              />
            </div>
            <div className="date-range__field">
              <label htmlFor="date-to" className="date-range__field-label">
                To
              </label>
              <input
                id="date-to"
                type="date"
                className="date-range__input"
                value={localFilters.dateRange?.to || ''}
                onChange={(e) => handleDateChange('to', e.target.value)}
                aria-label="End date"
                min={localFilters.dateRange?.from || undefined}
              />
            </div>
          </div>
        </div>

        {/* Job Selection */}
        {availableJobs.length > 0 && (
          <div className="filter-group">
            <label className="filter-group__label">Jobs</label>
            <div className="filter-group__checkboxes filter-group__checkboxes--scrollable">
              {availableJobs.map((job) => (
                <label key={job.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={localFilters.jobIds.includes(job.id)}
                    onChange={() => handleJobToggle(job.id)}
                    aria-label={`Filter by job ${job.title}`}
                  />
                  <span className="job-option">
                    <span className="job-option__title">{job.title}</span>
                    <span className="job-option__company">{job.companyName}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Assigned To */}
        {availableAssignees.length > 0 && (
          <div className="filter-group">
            <label htmlFor="assigned-to" className="filter-group__label">
              Assigned To
            </label>
            <select
              id="assigned-to"
              className="filter-group__select"
              value={localFilters.assignedTo || ''}
              onChange={handleAssigneeChange}
              aria-label="Filter by assigned recruiter"
            >
              <option value="">All Recruiters</option>
              {availableAssignees.map((assignee) => (
                <option key={assignee.username} value={assignee.username}>
                  {assignee.name} ({assignee.username})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="advanced-filters__actions">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={handleReset}
          disabled={activeFilterCount === 0}
          aria-label="Reset all filters"
        >
          Reset
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={onApply}
          aria-label="Apply filters"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilters;
