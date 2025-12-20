"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { approvalApi, HRApprovalUser } from "@/lib/approvalApi";
import { showToast, getErrorMessage } from "@/lib/toast";

export default function HRManagerHRApprovalsPage() {
  const [pendingUsers, setPendingUsers] = useState<HRApprovalUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [keyword, setKeyword] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadPendingUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await approvalApi.getPendingHRStaff({
        keyword,
        page,
        size,
        status: "WAIT_APPROVED",
        role: "HR",
      });

      if (response.status === 200 && response.data) {
        setPendingUsers(response.data.hits);
        setTotalElements(response.data.totalHits);
      }
    } catch (error) {
      showToast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [keyword, page, size]);

  useEffect(() => {
    loadPendingUsers();
  }, [loadPendingUsers]);

  const handleApprove = async () => {
    if (!selectedUsername) return;
    setIsProcessing(true);
    try {
      await approvalApi.approveHRStaff(selectedUsername);
      showToast.success("HR staff approved successfully");
      setShowConfirm(false);
      loadPendingUsers();
    } catch (error) {
      showToast.error(getErrorMessage(error));
    } finally {
      setIsProcessing(false);
      setSelectedUsername(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    loadPendingUsers();
  };

  const totalPages = Math.ceil(totalElements / size);

  return (
    <section className="section-box mt-50">
      <div className="container">
        {/* Header Section */}
        <div className="row align-items-center mb-30">
          <div className="col-lg-8">
            <h3 className="mb-5 text-bold">HR Staff Approvals</h3>
            <p className="font-sm color-text-mutted">
              Review and manage pending registrations for HR team.
            </p>
          </div>
          <div className="col-lg-4 text-lg-end">
            <Link
              href="/hr-manager"
              className="btn btn-back-custom font-sm hover-up"
            >
              <i className="fi-rr-arrow-left mr-5"></i> Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Filters & Stats Bar */}
        <div className="filter-stats-box mb-30 shadow-sm border-gray-200">
          <div className="row align-items-center">
            <div className="col-lg-3 border-right-lg">
              <div className="d-flex align-items-center pl-10">
                <div className="icon-stat bg-soft-blue">
                  <i className="fi-rr-envelope-open text-primary"></i>
                </div>
                <div className="ml-15">
                  <h4 className="mb-0">{totalElements}</h4>
                  <p className="font-xs color-text-mutted text-uppercase mb-0">
                    Requests
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-9 pr-20">
              <form onSubmit={handleSearch} className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control font-sm border-gray-200"
                  placeholder="Filter by name, email or department..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <button type="submit" className="btn btn-default px-4">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="table-container shadow-sm bd-rd-15 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table custom-table-modern align-middle mb-0">
              <thead>
                <tr>
                  <th className="pl-30 py-3">STAFF MEMBER</th>
                  <th>DEPARTMENT</th>
                  <th>REGISTRATION</th>
                  <th className="text-center pr-30">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-50 font-sm">
                      Fetching data...
                    </td>
                  </tr>
                ) : pendingUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-50 font-sm">
                      No pending requests at the moment.
                    </td>
                  </tr>
                ) : (
                  pendingUsers.map((user) => (
                    <tr key={user.userId}>
                      <td className="pl-30 py-25">
                        <div className="d-flex align-items-center">
                          <div className="avatar-letter mr-15">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h6 className="font-sm mb-0 text-bold">
                              {user.fullName || user.username}
                            </h6>
                            <span className="font-xs color-text-mutted">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge-modern">
                          {user.department || "General HR"}
                        </span>
                      </td>
                      <td className="font-xs text-muted">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-center pr-30">
                        <button
                          className="btn btn-approve-action font-xs fw-bold"
                          onClick={() => {
                            setSelectedUsername(user.username);
                            setShowConfirm(true);
                          }}
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Logic theo ý bạn */}
        {totalPages > 1 && (
          <div className="mt-40 d-flex justify-content-center">
            <nav>
              <ul className="pagination custom-pagination-ui">
                <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 0}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum =
                    Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
                  return (
                    <li
                      key={pageNum}
                      className={`page-item ${
                        page === pageNum ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum + 1}
                      </button>
                    </li>
                  );
                })}
                <li
                  className={`page-item ${
                    page >= totalPages - 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages - 1}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Modern Confirm Modal */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-confirm-box shadow-xl">
            <div className="status-icon bg-soft-success mb-20">
              <i className="fi-rr-check text-success"></i>
            </div>
            <h5 className="mb-10">Confirm Staff</h5>
            <p className="font-sm color-text-paragraph mb-30 px-2">
              Are you sure you want to approve{" "}
              <strong>@{selectedUsername}</strong>? They will be granted HR
              Staff permissions.
            </p>
            <div className="d-flex justify-content-center gap-2">
              <button
                className="btn btn-border btn-sm font-sm px-4"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-default btn-sm font-sm px-4"
                onClick={handleApprove}
                disabled={isProcessing}
              >
                {isProcessing ? "Wait..." : "Yes, Approve"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .filter-stats-box {
          background: #fff;
          border: 1px solid #edf2f7;
          padding: 20px;
          border-radius: 12px;
        }
        .bg-soft-blue {
          background: #eff6ff;
        }
        .bg-soft-success {
          background: #ecfdf5;
        }
        .icon-stat {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        .avatar-letter {
          width: 40px;
          height: 40px;
          background: #3c69f6;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }

        /* Badge Department Tương phản mạnh */
        .badge-modern {
          background-color: #3c69f6;
          color: white;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Nút Back xịn hơn */
        .btn-back-custom {
          background: white;
          border: 1px solid #d1d5db;
          color: #374151;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .btn-back-custom:hover {
          border-color: #3c69f6;
          color: #3c69f6;
          background: #eff6ff;
        }

        /* Nút Approve xanh lá mướt */
        .btn-approve-action {
          background: #10b981;
          color: white;
          border: none;
          padding: 6px 16px;
          border-radius: 6px;
          transition: 0.2s;
        }
        .btn-approve-action:hover {
          background: #059669;
          transform: translateY(-2px);
        }

        /* Pagination Style */
        .custom-pagination-ui .page-link {
          border: 1px solid #e5e7eb;
          color: #4b5563;
          margin: 0 2px;
          border-radius: 6px;
          padding: 8px 14px;
          font-size: 14px;
        }
        .custom-pagination-ui .page-item.active .page-link {
          background: #3c69f6;
          border-color: #3c69f6;
          color: white;
        }
        .custom-pagination-ui .page-item.disabled .page-link {
          color: #d1d5db;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(3px);
        }
        .modal-confirm-box {
          background: white;
          padding: 40px 30px;
          border-radius: 20px;
          width: 360px;
          text-align: center;
        }
        .status-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          font-size: 24px;
        }

        .border-right-lg {
          border-right: 1px solid #f1f5f9;
        }
        .text-bold {
          font-weight: 700;
        }
      `}</style>
    </section>
  );
}
