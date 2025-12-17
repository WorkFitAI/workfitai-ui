"use client";

import { useEffect, useState } from 'react';
import { getAuditLogs } from '@/lib/applicationApi';
import AuditLogTable from '@/components/application/control/AuditLogTable';
import AuditLogFilters from '@/components/application/control/AuditLogFilters';
import type { AuditLog } from '@/types/application/application';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    entityId: '',
    performedBy: '',
    action: '',
    fromDate: '',
    toDate: '',
    page: 0,
    size: 20
  });

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await getAuditLogs(filters);
      setLogs(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="box-content">
      <div className="box-heading">
        <div className="box-title">
          <h3 className="mb-35">Audit Logs</h3>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <AuditLogFilters
            filters={filters}
            onFilterChange={(newFilters) =>
              setFilters(prev => ({ ...prev, ...newFilters, page: 0 }))
            }
          />

          <div className="mt-4">
            <AuditLogTable
              logs={logs}
              loading={loading}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${filters.page === 0 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={filters.page === 0}
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => (
                    <li key={i} className={`page-item ${i === filters.page ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setFilters(prev => ({ ...prev, page: i }))}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${filters.page >= totalPages - 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={filters.page >= totalPages - 1}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
