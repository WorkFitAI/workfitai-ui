"use client";

import { useState } from 'react';

interface AuditLogFiltersProps {
  filters: {
    entityId: string;
    performedBy: string;
    action: string;
    fromDate: string;
    toDate: string;
  };
  onFilterChange: (filters: Partial<AuditLogFiltersProps['filters']>) => void;
}

const AuditLogFilters = ({ filters, onFilterChange }: AuditLogFiltersProps) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (field: keyof typeof filters, value: string) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      entityId: '',
      performedBy: '',
      action: '',
      fromDate: '',
      toDate: ''
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Entity ID</label>
            <input
              type="text"
              className="form-control"
              placeholder="Application ID"
              value={localFilters.entityId}
              onChange={(e) => handleChange('entityId', e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Performed By</label>
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={localFilters.performedBy}
              onChange={(e) => handleChange('performedBy', e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <label className="form-label">Action</label>
            <select
              className="form-select"
              value={localFilters.action}
              onChange={(e) => handleChange('action', e.target.value)}
            >
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="STATUS_CHANGE">Status Change</option>
              <option value="NOTE_ADD">Note Add</option>
              <option value="ASSIGNMENT">Assignment</option>
              <option value="RESTORE">Restore</option>
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">From Date</label>
            <input
              type="date"
              className="form-control"
              value={localFilters.fromDate}
              onChange={(e) => handleChange('fromDate', e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <label className="form-label">To Date</label>
            <input
              type="date"
              className="form-control"
              value={localFilters.toDate}
              onChange={(e) => handleChange('toDate', e.target.value)}
            />
          </div>

          <div className="col-12">
            <button
              className="btn btn-primary me-2"
              onClick={handleApply}
            >
              <i className="fi fi-rr-search me-2"></i>
              Apply Filters
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleReset}
            >
              <i className="fi fi-rr-refresh me-2"></i>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogFilters;
