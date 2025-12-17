"use client";

import { useState } from 'react';
import type { AuditLog } from '@/types/application/application';

interface AuditLogTableProps {
  logs: AuditLog[];
  loading: boolean;
}

const AuditLogTable = ({ logs, loading }: AuditLogTableProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <p className="text-muted">No audit logs found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Action</th>
            <th>Entity</th>
            <th>Performed By</th>
            <th>PII</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <>
              <tr key={log.id}>
                <td>{new Date(log.performedAt).toLocaleString()}</td>
                <td><span className="badge bg-secondary">{log.action}</span></td>
                <td>
                  <div>
                    <small className="text-muted">{log.entityType}</small>
                    <br />
                    <code>{log.entityId.substring(0, 12)}...</code>
                  </div>
                </td>
                <td>{log.performedBy}</td>
                <td>
                  {log.containsPII ? (
                    <span className="badge bg-warning">Yes</span>
                  ) : (
                    <span className="badge bg-success">No</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => toggleExpand(log.id)}
                  >
                    {expandedId === log.id ? 'Hide Details' : 'View Details'}
                  </button>
                </td>
              </tr>
              {expandedId === log.id && (
                <tr>
                  <td colSpan={6}>
                    <div className="p-3 bg-light">
                      <div className="row">
                        <div className="col-md-6">
                          <h6>Before State</h6>
                          <pre className="bg-white p-2 border" style={{ fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
                            {JSON.stringify(log.beforeState, null, 2)}
                          </pre>
                        </div>
                        <div className="col-md-6">
                          <h6>After State</h6>
                          <pre className="bg-white p-2 border" style={{ fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
                            {JSON.stringify(log.afterState, null, 2)}
                          </pre>
                        </div>
                      </div>
                      {Object.keys(log.metadata).length > 0 && (
                        <div className="mt-3">
                          <h6>Metadata</h6>
                          <pre className="bg-white p-2 border" style={{ fontSize: '12px' }}>
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogTable;
