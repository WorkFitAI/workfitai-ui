"use client";

import React, { useState, useRef, useEffect } from 'react';
import type { Column } from './TableHeader';

interface ColumnSettingsProps {
  columns: Column[];
  visibleColumns: string[];
  onToggle: (columnId: string) => void;
}

const ColumnSettings = ({
  columns,
  visibleColumns,
  onToggle
}: ColumnSettingsProps): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = (columnId: string): void => {
    onToggle(columnId);
  };

  const handleReset = (): void => {
    // Reset to all visible
    columns.forEach(column => {
      if (!visibleColumns.includes(column.id)) {
        onToggle(column.id);
      }
    });
    setIsOpen(false);
  };

  // Don't allow hiding checkbox and actions columns
  const toggleableColumns = columns.filter(
    col => col.id !== 'actions'
  );

  return (
    <div className="column-settings-wrapper" ref={dropdownRef}>
      <button
        className="btn btn-sm btn-outline-secondary"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Column settings"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <i className="fi fi-rr-settings me-2"></i>
        Columns
      </button>

      {isOpen && (
        <div className="column-settings-dropdown">
          <div className="dropdown-header">
            <span>Show/Hide Columns</span>
            <button
              className="btn-reset"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>

          <div className="column-list">
            {toggleableColumns.map(column => (
              <label
                key={column.id}
                className="column-item"
              >
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(column.id)}
                  onChange={() => handleToggle(column.id)}
                />
                <span>{column.label}</span>
              </label>
            ))}
          </div>

          <div className="dropdown-footer">
            <small className="text-muted">
              {visibleColumns.length} of {columns.length} columns visible
            </small>
          </div>
        </div>
      )}

      <style jsx>{`
        .column-settings-wrapper {
          position: relative;
        }

        .column-settings-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 4px;
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          min-width: 200px;
          z-index: 1000;
        }

        .dropdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #e9ecef;
          font-weight: 600;
          font-size: 14px;
        }

        .btn-reset {
          background: none;
          border: none;
          color: #3498db;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .btn-reset:hover {
          background: #f8f9fa;
        }

        .column-list {
          padding: 8px 0;
          max-height: 300px;
          overflow-y: auto;
        }

        .column-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          cursor: pointer;
          transition: background 0.15s;
          margin: 0;
        }

        .column-item:hover {
          background: #f8f9fa;
        }

        .column-item input[type="checkbox"] {
          margin: 0;
          cursor: pointer;
        }

        .column-item span {
          font-size: 14px;
          color: #495057;
        }

        .dropdown-footer {
          padding: 8px 16px;
          border-top: 1px solid #e9ecef;
          text-align: center;
        }

        .dropdown-footer small {
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default ColumnSettings;
