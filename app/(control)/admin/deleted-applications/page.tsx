"use client";

import { useEffect, useState } from 'react';
import { getDeletedApplications, restoreApplication } from '@/lib/applicationApi';
import StatusBadge from '@/components/application/StatusBadge';
import type { Application } from '@/types/application/application';

export default function DeletedApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [page] = useState(0);

  useEffect(() => {
    fetchDeleted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchDeleted = async () => {
    setLoading(true);
    try {
      const response = await getDeletedApplications({ page, size: 20 });
      setApplications(response.items);
    } catch (err) {
      console.error('Failed to fetch deleted applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    if (!confirm('Restore this application?')) return;

    try {
      await restoreApplication(id);
      fetchDeleted();
      alert('Application restored successfully');
    } catch (err) {
      console.error('Failed to restore application:', err);
      alert('Failed to restore application');
    }
  };

  return (
    <div className="box-content">
      <div className="box-heading">
        <div className="box-title">
          <h3 className="mb-35">Deleted Applications</h3>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="alert alert-info">
            <i className="fi fi-rr-info-circle me-2"></i>
            These applications have been soft-deleted and can be restored.
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <p className="text-muted">No deleted applications</p>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Job</th>
                    <th>Status</th>
                    <th>Deleted At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app.id}>
                      <td>
                        <div>
                          <strong>{app.username}</strong>
                          <br />
                          <small className="text-muted">{app.email}</small>
                        </div>
                      </td>
                      <td>
                        {app.jobSnapshot.title}
                        <br />
                        <small className="text-muted">{app.jobSnapshot.companyName}</small>
                      </td>
                      <td>
                        <StatusBadge status={app.status} />
                      </td>
                      <td>{app.deletedAt ? new Date(app.deletedAt).toLocaleString() : 'N/A'}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleRestore(app.id)}
                        >
                          Restore
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
  );
}
