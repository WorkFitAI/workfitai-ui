"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchCVList,
  uploadCV,
  deleteCV,
  selectCVs,
  selectCVMeta,
  selectCVLoading,
  selectCVUploading,
  selectCVDeleting,
  selectCVError,
  clearError,
} from "@/redux/features/cv/cvSlice";
import { selectAuthUser } from "@/redux/features/auth/authSlice";
import CVCard from "@/components/cv/CVCard";
import UploadCVModal from "@/components/cv/UploadCVModal";
import { useAuthErrorRedirect } from "@/util/useAuthErrorRedirect";
import { showToast } from "@/lib/toast";

export default function MyCVsPage(): React.ReactElement {
  useAuthErrorRedirect();

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const cvs = useAppSelector(selectCVs);
  const meta = useAppSelector(selectCVMeta);
  const loading = useAppSelector(selectCVLoading);
  const uploading = useAppSelector(selectCVUploading);
  const deleting = useAppSelector(selectCVDeleting);
  const error = useAppSelector(selectCVError);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Fetch CVs on mount and when page changes
  useEffect(() => {
    if (user?.username) {
      dispatch(
        fetchCVList({
          username: user.username,
          page: currentPage - 1, // API uses 0-based pagination
          size: pageSize,
          templateType: "UPLOAD",
        })
      );
    }
  }, [dispatch, user?.username, currentPage]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleUpload = async (file: File): Promise<void> => {
    const result = await dispatch(uploadCV(file));
    if (uploadCV.fulfilled.match(result)) {
      showToast.success("CV uploaded successfully!");
      // Refresh the list after successful upload
      if (user?.username) {
        dispatch(
          fetchCVList({
            username: user.username,
            page: 0, // Go back to first page
            size: pageSize,
            templateType: "UPLOAD",
          })
        );
        setCurrentPage(1);
      }
    } else {
      showToast.error("Failed to upload CV. Please try again.");
    }
  };

  const handleDelete = async (cvId: string): Promise<void> => {
    const result = await dispatch(deleteCV(cvId));
    if (deleteCV.fulfilled.match(result)) {
      showToast.success("CV deleted successfully!");
      // If current page becomes empty after deletion, go to previous page
      if (cvs.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } else {
      showToast.error("Failed to delete CV. Please try again.");
    }
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = (): React.ReactElement | null => {
    if (meta.pages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(meta.pages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <i className="fi fi-rr-angle-left"></i>
            </button>
          </li>

          {startPage > 1 && (
            <>
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => handlePageChange(1)}
                >
                  1
                </button>
              </li>
              {startPage > 2 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
            </>
          )}

          {pages.map((page) => (
            <li
              key={page}
              className={`page-item ${page === currentPage ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            </li>
          ))}

          {endPage < meta.pages && (
            <>
              {endPage < meta.pages - 1 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => handlePageChange(meta.pages)}
                >
                  {meta.pages}
                </button>
              </li>
            </>
          )}

          <li
            className={`page-item ${
              currentPage === meta.pages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === meta.pages}
            >
              <i className="fi fi-rr-angle-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <>
      <div className="section-box mt-20">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h3 className="mb-2">My CVs</h3>
                  <p className="text-muted">
                    Manage your curriculum vitae for job applications
                  </p>
                </div>
                <button
                  className="btn btn-brand-1"
                  onClick={() => setShowUploadModal(true)}
                  disabled={uploading}
                >
                  <i className="fi fi-rr-plus me-2"></i>
                  Upload New CV
                </button>
              </div>

              {/* Error Alert */}
              {error && (
                <div
                  className="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                  <i className="fi fi-rr-exclamation me-2"></i>
                  {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => dispatch(clearError())}
                  ></button>
                </div>
              )}

              {/* Stats */}
              {!loading && meta.total > 0 && (
                <div className="card bg-light border-0 mb-4">
                  <div className="card-body">
                    <div className="row text-center">
                      <div className="col-md-4">
                        <h4 className="text-brand-1 mb-1">{meta.total}</h4>
                        <p className="text-muted mb-0">Total CVs</p>
                      </div>
                      <div className="col-md-4">
                        <h4 className="text-brand-1 mb-1">
                          {cvs.filter((cv) => cv.exist).length}
                        </h4>
                        <p className="text-muted mb-0">Active</p>
                      </div>
                      <div className="col-md-4">
                        <h4 className="text-brand-1 mb-1">{meta.pages}</h4>
                        <p className="text-muted mb-0">Pages</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted mt-3">Loading your CVs...</p>
                </div>
              ) : cvs.length === 0 ? (
                /* Empty State */
                <div className="card card-style-1">
                  <div className="card-body text-center py-5">
                    <i
                      className="fi fi-rr-document display-1 text-muted mb-3"
                      style={{ fontSize: "80px" }}
                    ></i>
                    <h5 className="mb-3">No CVs yet</h5>
                    <p className="text-muted mb-4">
                      Upload your first CV to start applying for jobs.
                      <br />
                      Your CV helps employers understand your qualifications and
                      experience.
                    </p>
                    <button
                      className="btn btn-brand-1"
                      onClick={() => setShowUploadModal(true)}
                    >
                      <i className="fi fi-rr-plus me-2"></i>
                      Upload Your First CV
                    </button>
                  </div>
                </div>
              ) : (
                /* CV List */
                <>
                  <div className="row">
                    {cvs.map((cv) => (
                      <div key={cv.cvId} className="col-12 mb-4">
                        <CVCard
                          cv={cv}
                          onDelete={handleDelete}
                          isDeleting={deleting}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {renderPagination()}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadCVModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
        isUploading={uploading}
      />
    </>
  );
}
