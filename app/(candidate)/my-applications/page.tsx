"use client";

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchMyApplications,
  selectApplications,
  selectApplicationMeta,
  selectApplicationLoading
} from '@/redux/features/application/applicationSlice';
import {
  selectApplicationStatus,
  selectApplicationPage,
  selectApplicationSize,
  setPage
} from '@/redux/features/application/applicationFilterSlice';
import ApplicationCard from '@/components/application/ApplicationCard';
import ApplicationFilterSidebar from '@/components/application/filter/ApplicationFilterSidebar';
import Pagination from '@/components/job/Pagination/Pagination';

export default function MyApplicationsPage(): React.ReactElement {
  const dispatch = useAppDispatch();
  const applications = useAppSelector(selectApplications);
  const meta = useAppSelector(selectApplicationMeta);
  const loading = useAppSelector(selectApplicationLoading);
  const status = useAppSelector(selectApplicationStatus);
  const page = useAppSelector(selectApplicationPage);
  const size = useAppSelector(selectApplicationSize);

  useEffect(() => {
    dispatch(fetchMyApplications({ page, size, status: status || undefined }));
  }, [dispatch, page, size, status]);

  const handlePageChange = (newPage: number): void => {
    dispatch(setPage(newPage));
  };

  return (
    <div className="section-box mt-20">
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3">
            <ApplicationFilterSidebar candidateView />
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>My Applications</h3>
              <span className="text-muted">
                {meta.totalItems} application{meta.totalItems !== 1 ? "s" : ""}
              </span>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : applications.length === 0 ? (
              <div className="card card-style-1">
                <div className="card-body text-center py-5">
                  <i className="fi fi-rr-document display-1 text-muted mb-3"></i>
                  <h5>No applications yet</h5>
                  <p className="text-muted mb-4">
                    Start applying to jobs to see your applications here
                  </p>
                  <a href="/jobs-list" className="btn btn-brand-1">
                    Browse Jobs
                  </a>
                </div>
              </div>
            ) : (
              <>
                <div className="row">
                  {applications.map((application) => (
                    <div key={application.id} className="col-12 mb-4">
                      <ApplicationCard application={application} />
                    </div>
                  ))}
                </div>

                {meta.totalPages > 1 && (
                  <Pagination
                    currentPage={page}
                    totalPages={meta.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
