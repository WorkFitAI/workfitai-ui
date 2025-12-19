"use client";

import { useEffect, useState } from "react";
import { getAllApplications } from "@/lib/applicationApi";
import ApplicationTable from "@/components/application/control/ApplicationTable";
import type {
  Application,
  PaginationMeta,
} from "@/types/application/application";

export default function SystemApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 0,
    size: 50,
    totalElements: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchApplications();
  }, [page]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await getAllApplications({ page, size: 50 });
      setApplications(response.items);
      setMeta(response.meta);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="box-content">
      <div className="box-heading">
        <div className="box-title">
          <h3 className="mb-35">System Applications</h3>
        </div>
        <div className="box-breadcrumb">
          <div className="breadcrumbs">
            <ul>
              <li>
                <a className="icon-home" href="/admin">
                  Admin
                </a>
              </li>
              <li>
                <span>System Applications</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="alert alert-warning">
            <i className="fi fi-rr-info-circle me-2"></i>
            <strong>Admin View:</strong> You are viewing all applications across
            all companies.
          </div>

          <div className="d-flex justify-content-between mb-3">
            <h5>Platform Applications</h5>
            <span className="text-muted">
              {meta.totalElements} total applications
            </span>
          </div>

          <ApplicationTable
            applications={applications}
            loading={loading}
            selectedIds={[]}
            onSelectionChange={() => {}}
            onBulkAction={() => {}}
          />

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 0}
                  >
                    Previous
                  </button>
                </li>
                {Array.from(
                  { length: Math.min(meta.totalPages, 10) },
                  (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${i === page ? "active" : ""}`}
                    >
                      <button className="page-link" onClick={() => setPage(i)}>
                        {i + 1}
                      </button>
                    </li>
                  )
                )}
                <li
                  className={`page-item ${
                    page >= meta.totalPages - 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= meta.totalPages - 1}
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
  );
}
