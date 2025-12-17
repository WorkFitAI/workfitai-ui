"use client";

import React from 'react';
import Link from 'next/link';
import type { TopJob } from '@/types/application/application';

interface TopJobsWidgetProps {
  jobs: TopJob[];
}

export default function TopJobsWidget({ jobs }: TopJobsWidgetProps): React.ReactElement {
  const getConversionRate = (hired: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((hired / total) * 100);
  };

  return (
    <div className="top-jobs-widget">
      <div className="widget-header">
        <h3 className="widget-title">Top Jobs</h3>
        <Link href="/hr-manager/jobs" className="view-all-link">
          View All
        </Link>
      </div>

      <div className="jobs-list">
        {jobs.length === 0 ? (
          <div className="empty-state">
            <p>No jobs with applications yet</p>
          </div>
        ) : (
          jobs.map((job, index) => {
            const conversionRate = getConversionRate(job.hiredCount, job.applicationCount);
            return (
              <div key={job.jobId} className="job-card">
                <div className="job-rank">#{index + 1}</div>
                <div className="job-info">
                  <h4 className="job-title">{job.jobTitle}</h4>
                  <p className="job-company">{job.companyName}</p>
                </div>
                <div className="job-stats">
                  <div className="stat">
                    <div className="stat-label">Applications</div>
                    <div className="stat-value">{job.applicationCount}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Hired</div>
                    <div className="stat-value stat-hired">{job.hiredCount}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Conversion</div>
                    <div className="stat-value">{conversionRate}%</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style jsx>{`
        .top-jobs-widget {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .widget-title {
          font-size: 18px;
          font-weight: 600;
          color: #2D3E50;
          margin: 0;
        }

        .view-all-link {
          font-size: 14px;
          color: #3498DB;
          text-decoration: none;
          font-weight: 500;
        }

        .view-all-link:hover {
          text-decoration: underline;
        }

        .jobs-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .empty-state {
          text-align: center;
          padding: 32px;
          color: #6C757D;
        }

        .job-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border: 1px solid #E9ECEF;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .job-card:hover {
          border-color: #3498DB;
          box-shadow: 0 2px 8px rgba(52, 152, 219, 0.1);
        }

        .job-rank {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3498DB, #2ECC71);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          flex-shrink: 0;
        }

        .job-info {
          flex: 1;
          min-width: 0;
        }

        .job-title {
          font-size: 15px;
          font-weight: 600;
          color: #2D3E50;
          margin: 0 0 4px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .job-company {
          font-size: 13px;
          color: #6C757D;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .job-stats {
          display: flex;
          gap: 16px;
        }

        .stat {
          text-align: center;
        }

        .stat-label {
          font-size: 11px;
          color: #6C757D;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 700;
          color: #2D3E50;
        }

        .stat-new {
          color: #3498DB;
        }

        .stat-hired {
          color: #27AE60;
        }

        @media (max-width: 768px) {
          .job-card {
            flex-direction: column;
            align-items: flex-start;
          }

          .job-stats {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}
