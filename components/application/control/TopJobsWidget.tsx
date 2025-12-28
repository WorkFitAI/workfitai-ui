"use client";

import React from 'react';

import type { TopJob } from '@/types/application/application';

interface TopJobsWidgetProps {
  topJobs: TopJob[];
}

const TopJobsWidget = ({ topJobs }: TopJobsWidgetProps): React.ReactElement => {
  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Job Title</th>
            <th>Company</th>
            <th>Applications</th>
          </tr>
        </thead>
        <tbody>
          {topJobs.map((job, index) => (
            <tr key={job.jobId}>
              <td>
                <span className="badge bg-primary">#{index + 1}</span>
              </td>
              <td><strong>{job.jobTitle}</strong></td>
              <td>-</td>
              <td>
                <span className="badge bg-info">{job.applicantCount}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopJobsWidget;
