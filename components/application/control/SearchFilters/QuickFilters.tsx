"use client";

import React from 'react';
import { ApplicationStatus } from '@/types/application/application';

interface QuickFiltersProps {
  selectedStatus: ApplicationStatus | null;
  onSelectStatus: (status: ApplicationStatus | null) => void;
  counts?: Partial<Record<ApplicationStatus, number>>;
}

interface FilterConfig {
  status: ApplicationStatus | null;
  label: string;
  colorClass: string;
}

const QUICK_FILTERS: FilterConfig[] = [
  { status: null, label: 'All Applications', colorClass: 'all' },
  { status: ApplicationStatus.APPLIED, label: 'New', colorClass: 'applied' },
  { status: ApplicationStatus.REVIEWING, label: 'Reviewing', colorClass: 'reviewing' },
  { status: ApplicationStatus.INTERVIEW, label: 'Interview', colorClass: 'interview' },
  { status: ApplicationStatus.OFFER, label: 'Offer', colorClass: 'offer' },
  { status: ApplicationStatus.HIRED, label: 'Hired', colorClass: 'hired' },
];

const QuickFilters = ({ selectedStatus, onSelectStatus, counts }: QuickFiltersProps): React.ReactElement => {
  return (
    <div className="quick-filters">
      {QUICK_FILTERS.map((filter) => {
        const isActive = selectedStatus === filter.status;
        const count = filter.status ? counts?.[filter.status] : undefined;

        return (
          <button
            key={filter.label}
            type="button"
            className={`filter-chip filter-chip--${filter.colorClass} ${isActive ? 'active' : ''}`}
            onClick={() => onSelectStatus(filter.status)}
            aria-pressed={isActive}
            aria-label={`Filter by ${filter.label}${count ? ` (${count})` : ''}`}
          >
            {filter.label}
            {count !== undefined && (
              <span className="count" aria-label={`${count} applications`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default QuickFilters;
