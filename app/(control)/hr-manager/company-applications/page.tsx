"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAppSelector } from "@/redux/hooks";
import { getCompanyApplications } from "@/lib/applicationApi";
import { selectApplicationStatus } from "@/redux/features/application/applicationFilterSlice";
import ApplicationTable from "@/components/application/control/ApplicationTable";
import ApplicationFilterPanel from "@/components/application/control/ApplicationFilterPanel";
import ExportButton from "@/components/application/control/Analytics/ExportButton";
import type {
  Application,
  PaginationMeta,
  ApplicationStatus,
} from "@/types/application/application";

export default function CompanyApplicationsPage(): React.ReactElement {
  const { user } = useAppSelector((state) => state.auth);
  const filterStatus = useAppSelector(selectApplicationStatus);
  const [applications, setApplications] = useState<Application[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  const companyId = user?.companyId || "";

  const fetchApplications = useCallback(async (): Promise<void> => {
    if (!companyId) return;

    setLoading(true);
    try {
      const response = await getCompanyApplications({
        companyId,
        page,
        size: 20,
        status: filterStatus as ApplicationStatus | undefined,
      });
      setApplications(response.items);
      setMeta(response.meta);
    } catch (error) {
      console.error("Failed to fetch company applications:", error);
    } finally {
      setLoading(false);
    }
  }, [companyId, page, filterStatus]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return (
    <>
      <div className="col-lg-12">
        <div className="section-box">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3>Company Applications</h3>
                <p className="text-muted mb-0">
                  {meta.totalElements} total applications
                </p>
              </div>
              <ExportButton
                filters={{
                  companyId,
                  status: filterStatus
                    ? [filterStatus as ApplicationStatus]
                    : undefined,
                }}
              />
            </div>

            <div className="row">
              <div className="col-lg-3">
                <ApplicationFilterPanel hrView />
              </div>

              <div className="col-lg-9">
                <ApplicationTable
                  applications={applications}
                  loading={loading}
                  selectedIds={[]}
                  onSelectionChange={() => {}}
                  onBulkAction={() => {}}
                />

                {/* Pagination Controls */}
                {meta.totalPages > 1 && (
                  <nav className="mt-4" aria-label="Application pagination">
                    <ul className="pagination justify-content-center">
                      <li
                        className={`page-item ${page === 0 ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setPage((prev) => prev - 1)}
                          disabled={page === 0}
                        >
                          Previous
                        </button>
                      </li>

                      {Array.from(
                        { length: Math.min(meta.totalPages, 10) },
                        (_, i) => {
                          return (
                            <li
                              key={i}
                              className={`page-item ${
                                i === page ? "active" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => setPage(i)}
                              >
                                {i + 1}
                              </button>
                            </li>
                          );
                        }
                      )}

                      <li
                        className={`page-item ${
                          page >= meta.totalPages - 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setPage((prev) => prev + 1)}
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
        </div>
      </div>
    </>
  );
}
