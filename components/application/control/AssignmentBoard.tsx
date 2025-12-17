"use client";

import React, { useState } from 'react';
import type { Application } from '@/types/application/application';
import StatusBadge from '@/components/application/StatusBadge';

interface AssignmentBoardProps {
  unassignedApplications: Application[];
  loading: boolean;
  onAssign: (applicationId: string, hrUsername: string) => Promise<void>;
  onUnassign: (applicationId: string) => Promise<void>;
}

// Mock HR team list - in production, fetch from API
const HR_TEAM = [
  { username: 'hr_jane', fullName: 'Jane Smith', workload: 15 },
  { username: 'hr_bob', fullName: 'Bob Johnson', workload: 22 },
  { username: 'hr_alice', fullName: 'Alice Williams', workload: 18 }
];

const AssignmentBoard = ({
  unassignedApplications,
  loading,
  onAssign
}: AssignmentBoardProps): React.ReactElement => {
  const [selectedHR, setSelectedHR] = useState<Record<string, string>>({});

  const handleAssignClick = async (applicationId: string): Promise<void> => {
    const hrUsername = selectedHR[applicationId];
    if (!hrUsername) {
      alert('Please select an HR member');
      return;
    }

    await onAssign(applicationId, hrUsername);
    setSelectedHR(prev => {
      const newState = { ...prev };
      delete newState[applicationId];
      return newState;
    });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="row">
      {/* Unassigned Pool */}
      <div className="col-lg-8">
        <div className="card">
          <div className="card-header">
            <h5>Unassigned Applications ({unassignedApplications.length})</h5>
          </div>
          <div className="card-body">
            {unassignedApplications.length === 0 ? (
              <p className="text-muted text-center py-4">No unassigned applications</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Job</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th>Assign To</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unassignedApplications.map(app => (
                      <tr key={app.id}>
                        <td>
                          <div>
                            <strong>{app.username}</strong>
                            <br />
                            <small className="text-muted">{app.email}</small>
                          </div>
                        </td>
                        <td>
                          <div>
                            {app.jobSnapshot.title}
                            <br />
                            <small className="text-muted">
                              {app.jobSnapshot.companyName}
                            </small>
                          </div>
                        </td>
                        <td>
                          <StatusBadge status={app.status} size="sm" />
                        </td>
                        <td>
                          {new Date(app.submittedAt || app.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={selectedHR[app.id] || ''}
                            onChange={(e) =>
                              setSelectedHR(prev => ({
                                ...prev,
                                [app.id]: e.target.value
                              }))
                            }
                          >
                            <option value="">Select HR...</option>
                            {HR_TEAM.map(hr => (
                              <option key={hr.username} value={hr.username}>
                                {hr.fullName} ({hr.workload})
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleAssignClick(app.id)}
                            disabled={!selectedHR[app.id]}
                          >
                            Assign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HR Team Workload */}
      <div className="col-lg-4">
        <div className="card">
          <div className="card-header">
            <h5>Team Workload</h5>
          </div>
          <div className="card-body">
            {HR_TEAM.map(hr => (
              <div key={hr.username} className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>{hr.fullName}</span>
                  <span className="badge bg-secondary">{hr.workload} assigned</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div
                    className="progress-bar"
                    style={{ width: `${Math.min((hr.workload / 30) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentBoard;
