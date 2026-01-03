"use client";

import React from 'react';

interface TeamMember {
  hrUsername: string;
  assignedCount: number;
  completedCount: number;
  avgTimeToReview: number;
}

interface TeamPerformanceWidgetProps {
  teamPerformance: TeamMember[];
}

const TeamPerformanceWidget = ({ teamPerformance }: TeamPerformanceWidgetProps): React.ReactElement => {
  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>HR Member</th>
            <th>Assigned</th>
            <th>Completed</th>
            <th>Completion Rate</th>
            <th>Avg. Review Time</th>
          </tr>
        </thead>
        <tbody>
          {teamPerformance.map(member => {
            const completionRate = member.assignedCount > 0
              ? ((member.completedCount / member.assignedCount) * 100).toFixed(1)
              : '0.0';

            return (
              <tr key={member.hrUsername}>
                <td><strong>{member.hrUsername}</strong></td>
                <td>{member.assignedCount}</td>
                <td>{member.completedCount}</td>
                <td>
                  <span className="badge bg-primary">{completionRate}%</span>
                </td>
                <td>{member.avgTimeToReview.toFixed(1)} days</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TeamPerformanceWidget;
