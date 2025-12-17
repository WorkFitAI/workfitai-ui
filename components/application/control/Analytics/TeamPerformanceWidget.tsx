"use client";

import React from 'react';
import type { TeamMember } from '@/types/application/application';

interface TeamPerformanceWidgetProps {
  members: TeamMember[];
}

export default function TeamPerformanceWidget({ members }: TeamPerformanceWidgetProps): React.ReactElement {
  const formatDays = (hours?: number) => {
    if (!hours) return 'N/A';
    const days = Math.round(hours / 24);
    return `${days}d`;
  };

  const getCompletionRate = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="team-performance-widget">
      <h3 className="widget-title">Team Performance</h3>

      <div className="performance-table-wrapper">
        <table className="performance-table">
          <thead>
            <tr>
              <th>Recruiter</th>
              <th className="text-center">Assigned</th>
              <th className="text-center">Completed</th>
              <th className="text-center">Pending</th>
              <th className="text-center">Completion %</th>
              <th className="text-center">Avg Time</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted">
                  No team members found
                </td>
              </tr>
            ) : (
              members.map((member) => {
                const pending = member.assignedCount - member.completedCount;
                const completionRate = getCompletionRate(member.completedCount, member.assignedCount);
                return (
                  <tr key={member.hrUsername}>
                    <td>
                      <div className="member-info">
                        <div className="member-avatar">
                          {member.hrUsername.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="member-name">{member.hrUsername}</div>
                          <div className="member-username">@{member.hrUsername}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="badge badge-neutral">{member.assignedCount}</span>
                    </td>
                    <td className="text-center">
                      <span className="badge badge-success">{member.completedCount}</span>
                    </td>
                    <td className="text-center">
                      <span className="badge badge-warning">{pending}</span>
                    </td>
                    <td className="text-center">
                      <div className="completion-indicator">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                        <span className="completion-text">{completionRate}%</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="avg-time">{formatDays(member.avgTimeToReview)}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .team-performance-widget {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .widget-title {
          font-size: 18px;
          font-weight: 600;
          color: #2D3E50;
          margin: 0 0 20px 0;
        }

        .performance-table-wrapper {
          overflow-x: auto;
        }

        .performance-table {
          width: 100%;
          border-collapse: collapse;
        }

        .performance-table thead {
          background: #F8F9FA;
          border-bottom: 2px solid #DEE2E6;
        }

        .performance-table th {
          padding: 12px 16px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          color: #6C757D;
          text-transform: uppercase;
        }

        .performance-table td {
          padding: 16px;
          border-bottom: 1px solid #E9ECEF;
          font-size: 14px;
        }

        .text-center {
          text-align: center;
        }

        .text-muted {
          color: #6C757D;
        }

        .member-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .member-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #3498DB;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }

        .member-name {
          font-weight: 500;
          color: #2D3E50;
        }

        .member-username {
          font-size: 12px;
          color: #6C757D;
        }

        .badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .badge-neutral {
          background: #E9ECEF;
          color: #495057;
        }

        .badge-success {
          background: #D4EDDA;
          color: #155724;
        }

        .badge-warning {
          background: #FFF3CD;
          color: #856404;
        }

        .completion-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: #E9ECEF;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3498DB, #2ECC71);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .completion-text {
          font-size: 13px;
          font-weight: 600;
          color: #495057;
          min-width: 40px;
        }

        .avg-time {
          font-weight: 500;
          color: #495057;
        }
      `}</style>
    </div>
  );
}
