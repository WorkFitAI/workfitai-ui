"use client";

import React from 'react';
import type { Application } from '@/types/application/application';

export interface Column {
  id: string;
  label: string;
  sortable: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (application: Application) => React.ReactNode;
}

interface TableHeaderProps {
  columns: Column[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  selectedCount: number;
  totalCount: number;
  onSelectAll: (checked: boolean) => void;
}

const TableHeader = ({
  columns,
  sortBy,
  sortOrder,
  onSort,
  selectedCount,
  totalCount,
  onSelectAll
}: TableHeaderProps): React.ReactElement => {
  const isAllSelected = selectedCount === totalCount && totalCount > 0;
  const isIndeterminate = selectedCount > 0 && selectedCount < totalCount;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onSelectAll(e.target.checked);
  };

  const handleSort = (columnId: string): void => {
    if (onSort) {
      onSort(columnId);
    }
  };

  return (
    <thead>
      <tr>
        <th style={{ width: '40px' }}>
          <input
            type="checkbox"
            checked={isAllSelected}
            ref={(input) => {
              if (input) {
                input.indeterminate = isIndeterminate;
              }
            }}
            onChange={handleSelectAll}
            aria-label="Select all applications"
          />
        </th>
        {columns.map(column => (
          <th
            key={column.id}
            className={column.align || 'left'}
            style={{ width: column.width }}
          >
            {column.sortable && onSort ? (
              <button
                className="sort-button"
                onClick={() => handleSort(column.id)}
                aria-label={`Sort by ${column.label}`}
              >
                {column.label}
                <span className={`sort-icon ${sortBy === column.id ? 'active' : ''}`}>
                  {sortBy === column.id ? (
                    sortOrder === 'asc' ? '↑' : '↓'
                  ) : (
                    <span className="sort-icon-inactive">⇅</span>
                  )}
                </span>
              </button>
            ) : (
              column.label
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
