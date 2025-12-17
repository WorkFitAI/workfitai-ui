"use client";

import React, { useState } from 'react';
import { exportApplications } from '@/lib/applicationApi';

interface ExportButtonProps {
  filters?: {
    companyId?: string;
    jobId?: string;
    status?: string[];
    dateRange?: {
      from: string;
      to: string;
    };
  };
}

export default function ExportButton({ filters }: ExportButtonProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleExport = async (format: 'csv' | 'excel') => {
    setLoading(true);
    try {
      const blob = await exportApplications({ ...filters, format });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `applications-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setIsOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export applications');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="export-button-container">
      <button
        className="export-button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M14 10v2.667A1.333 1.333 0 0112.667 14H3.333A1.333 1.333 0 012 12.667V10M11.333 5.333L8 2M8 2L4.667 5.333M8 2v8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Export
      </button>

      {isOpen && (
        <div className="export-dropdown">
          <button
            className="export-option"
            onClick={() => handleExport('csv')}
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 2.5H5.833A1.667 1.667 0 004.167 4.167v11.666a1.667 1.667 0 001.666 1.667h8.334a1.667 1.667 0 001.666-1.667V6.667L12.5 2.5z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.5 2.5v4.167h4.167"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <div className="option-title">Export as CSV</div>
              <div className="option-desc">For spreadsheet apps</div>
            </div>
          </button>

          <button
            className="export-option"
            onClick={() => handleExport('excel')}
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 2.5H5.833A1.667 1.667 0 004.167 4.167v11.666a1.667 1.667 0 001.666 1.667h8.334a1.667 1.667 0 001.666-1.667V6.667L12.5 2.5z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.5 2.5v4.167h4.167M10 10.833L7.5 13.333M7.5 10.833l2.5 2.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <div className="option-title">Export as Excel</div>
              <div className="option-desc">For Microsoft Excel</div>
            </div>
          </button>
        </div>
      )}

      {isOpen && (
        <div
          className="export-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      <style jsx>{`
        .export-button-container {
          position: relative;
        }

        .export-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #3498DB;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .export-button:hover:not(:disabled) {
          background: #2980B9;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
        }

        .export-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .export-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          z-index: 1000;
          min-width: 240px;
          overflow: hidden;
        }

        .export-option {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          background: white;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          text-align: left;
        }

        .export-option:hover:not(:disabled) {
          background: #F8F9FA;
        }

        .export-option:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .export-option + .export-option {
          border-top: 1px solid #E9ECEF;
        }

        .export-option svg {
          color: #6C757D;
          flex-shrink: 0;
        }

        .option-title {
          font-size: 14px;
          font-weight: 600;
          color: #2D3E50;
          margin-bottom: 2px;
        }

        .option-desc {
          font-size: 12px;
          color: #6C757D;
        }

        .export-overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
        }
      `}</style>
    </div>
  );
}
