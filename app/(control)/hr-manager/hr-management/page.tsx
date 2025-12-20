"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { selectAuthUser } from "@/redux/features/auth/authSlice";
import {
  userApi,
  buildSearchRequest,
  formatUserStatus,
  getStatusColor,
} from "@/lib/userApi";
import { UserSearchFilters, UserSearchHit } from "@/types/users";
import { getInitials, getAvatarColor } from "@/util/avatarUtils";
import { showToast, getErrorMessage } from "@/lib/toast";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function HRManagementPage() {
  const currentUser = useAppSelector(selectAuthUser);
  const [users, setUsers] = useState<UserSearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalHits, setTotalHits] = useState(0);
  const [statusAggregations, setStatusAggregations] = useState<
    Record<string, number>
  >({});
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    variant: "danger" | "warning" | "info" | "primary";
    onConfirm: () => void;
  } | null>(null);

  const [filters, setFilters] = useState<UserSearchFilters>({
    query: "",
    role: "HR",
    status: "",
    blocked: undefined,
    includeDeleted: false,
    page: 0,
    size: 10,
    sortField: "createdAt",
    sortOrder: "desc",
    companyNo: currentUser?.companyId,
  });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const searchRequest = buildSearchRequest(filters);
      const response = await userApi.searchUsersByHr(searchRequest);

      if (response.status === 200 && response.data) {
        setUsers(response.data.hits);
        setTotalHits(response.data.totalHits);
        setStatusAggregations(response.data.statusAggregations || {});
      }
    } catch (error) {
      console.error("Failed to load HR staff:", error);
      showToast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, page: 0 }));
  };

  const handleDelete = async (id: string) => {
    setConfirmModal({
      show: true,
      title: "Confirm Deletion",
      message:
        "Are you sure you want to delete this HR staff member? This action cannot be undone.",
      variant: "danger",
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await userApi.deleteUserByHr(id);
          showToast.success("HR staff deleted successfully");
          loadUsers();
        } catch (error) {
          showToast.error(getErrorMessage(error));
        }
      },
    });
  };

  const totalPages = Math.ceil(totalHits / (filters.size || 10));
  const currentPage = filters.page || 0;

  return (
    <section className="section-box mt-50">
      <div className="container">
        {confirmModal && (
          <ConfirmModal
            show={confirmModal.show}
            title={confirmModal.title}
            message={confirmModal.message}
            variant={confirmModal.variant}
            onConfirm={confirmModal.onConfirm}
            onCancel={() => setConfirmModal(null)}
          />
        )}

        {/* Header Section */}
        <div className="row align-items-center mb-30">
          <div className="col-lg-8 col-md-12">
            <h3 className="mb-5">HR Staff Management</h3>
            <p className="font-sm color-text-mutted">
              Manage your organization's HR team and their access status.
            </p>
          </div>
          <div className="col-lg-4 col-md-12 text-lg-end">
            <Link
              href="/hr-manager/approvals/hr"
              className="btn btn-border font-sm hover-up shadow-sm bg-white"
            >
              <i className="fi-rr-shield-check mr-5"></i> Pending Approvals
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="row mb-10">
          {[
            {
              label: "Total HR",
              value: totalHits,
              icon: "fi-rr-users",
              color: "blue",
            },
            {
              label: "Active",
              value: statusAggregations.ACTIVE || 0,
              icon: "fi-rr-check",
              color: "green",
            },
            {
              label: "Pending",
              value: statusAggregations.PENDING || 0,
              icon: "fi-rr-clock",
              color: "orange",
            },
            {
              label: "Suspended",
              value: statusAggregations.SUSPENDED || 0,
              icon: "fi-rr-ban",
              color: "red",
            },
          ].map((stat, idx) => (
            <div className="col-lg-3 col-md-6 mb-20" key={idx}>
              <div className="card-grid-2 p-20 d-flex align-items-center shadow-sm bd-rd-15 border-1 border-gray-200 bg-white">
                <div className={`icon-circle bg-soft-${stat.color} mr-15`}>
                  <i className={`${stat.icon} text-${stat.color}`}></i>
                </div>
                <div>
                  <h4 className="mb-0">{stat.value}</h4>
                  <p className="font-xs color-text-mutted text-uppercase fw-bold">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Improved Search Bar (No Search Button) */}
        <div className="box-filters-job bg-white border-1 border-gray-200 p-20 mb-30 bd-rd-15 shadow-sm">
          <form onSubmit={handleSearchSubmit}>
            <div className="row align-items-center g-3">
              <div className="col-lg-8 col-md-7">
                <div className="input-group">
                  <span className="input-group-text bg-white border-right-0 py-2">
                    <i className="fi-rr-search font-xs text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-left-0 font-sm py-2"
                    placeholder="Search name, email, username... (Press Enter)"
                    value={filters.query || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, query: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="col-lg-4 col-md-5">
                <select
                  className="form-select font-sm border-gray-200 py-2"
                  value={filters.status || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value, page: 0 })
                  }
                >
                  <option value="">Filter by All Status</option>
                  <option value="ACTIVE">Active Staff</option>
                  <option value="PENDING">Pending Staff</option>
                  <option value="SUSPENDED">Suspended Staff</option>
                  <option value="WAIT_APPROVED">Approve Staff</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* User Table */}
        <div className="card-grid-2 shadow-sm border-1 border-gray-200 bd-rd-15 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table custom-table-modern align-middle mb-0">
              <thead>
                <tr>
                  <th className="pl-25 py-3">HR Staff</th>
                  <th>Contact Info</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th className="text-center pr-25">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-50 font-sm">
                      Loading staff members...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-50 font-sm text-muted"
                    >
                      No staff found matches your filter.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.userId}>
                      <td className="pl-25 py-20">
                        <Link
                          href={`/hr-manager/users/${user.username}`}
                          className="d-flex align-items-center text-decoration-none"
                        >
                          <div
                            className="avatar-circle-sm mr-15"
                            style={{
                              backgroundColor: getAvatarColor(user.username),
                              color: "#fff",
                            }}
                          >
                            {getInitials(user.fullName || user.username)}
                          </div>
                          <div>
                            <h6 className="font-sm mb-0 color-brand-1 fw-bold">
                              {user.fullName || user.username}
                            </h6>
                            <span className="font-xs color-text-mutted">
                              @{user.username}
                            </span>
                          </div>
                        </Link>
                      </td>
                      <td>
                        <div className="font-xs fw-medium text-dark">
                          {user.email}
                        </div>
                        <div className="font-xs color-text-mutted">
                          {user.phoneNumber || "No phone"}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          <span
                            className={`badge bg-${getStatusColor(
                              user.status
                            )} font-xs px-2`}
                            style={{ width: "fit-content" }}
                          >
                            {formatUserStatus(user.status)}
                          </span>
                          {user.blocked && (
                            <span
                              className="badge bg-danger font-xs px-2"
                              style={{ width: "fit-content" }}
                            >
                              Blocked
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="font-xs color-text-mutted">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-center pr-25">
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <button
                            className="btn-action-icon btn-soft-danger"
                            onClick={() => handleDelete(user.userId)}
                            disabled={user.deleted}
                            title="Delete User"
                          >
                            <i className="fi-rr-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="mt-40 d-flex justify-content-center">
            <nav aria-label="Page navigation">
              <ul className="pagination custom-pagination-ui">
                <li
                  className={`page-item ${currentPage === 0 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setFilters({ ...filters, page: currentPage - 1 })
                    }
                    disabled={currentPage === 0}
                  >
                    <i className="fi-rr-angle-small-left"></i>
                  </button>
                </li>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum =
                    Math.max(0, Math.min(currentPage - 2, totalPages - 5)) + i;
                  return (
                    <li
                      key={pageNum}
                      className={`page-item ${
                        currentPage === pageNum ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() =>
                          setFilters({ ...filters, page: pageNum })
                        }
                      >
                        {pageNum + 1}
                      </button>
                    </li>
                  );
                })}
                <li
                  className={`page-item ${
                    currentPage >= totalPages - 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setFilters({ ...filters, page: currentPage + 1 })
                    }
                    disabled={currentPage >= totalPages - 1}
                  >
                    <i className="fi-rr-angle-small-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      <style jsx>{`
        .bg-soft-blue {
          background: #eef2ff;
        }
        .bg-soft-green {
          background: #ecfdf5;
        }
        .bg-soft-orange {
          background: #fff7ed;
        }
        .bg-soft-red {
          background: #fef2f2;
        }
        .text-blue {
          color: #3c69f6 !important;
        }
        .text-green {
          color: #10b981 !important;
        }
        .text-orange {
          color: #f97316 !important;
        }
        .text-red {
          color: #ef4444 !important;
        }

        .icon-circle {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        .avatar-circle-sm {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
        }

        /* Action Buttons Căn chỉnh chính xác */
        .btn-action-icon {
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 14px;
          cursor: pointer;
          outline: none;
        }

        .btn-soft-success {
          background: #ecfdf5;
          color: #10b981;
        }
        .btn-soft-success:hover {
          background: #10b981;
          color: #fff;
          transform: translateY(-1px);
        }
        .btn-soft-warning {
          background: #fff7ed;
          color: #f97316;
        }
        .btn-soft-warning:hover {
          background: #f97316;
          color: #fff;
          transform: translateY(-1px);
        }
        .btn-soft-danger {
          background: #fef2f2;
          color: #ef4444;
        }
        .btn-soft-danger:hover {
          background: #ef4444;
          color: #fff;
          transform: translateY(-1px);
        }

        /* Table UI */
        .custom-table-modern thead th {
          background: #f9fafb;
          color: #4b5563;
          font-size: 11px;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 1px;
          border-bottom: 1px solid #f3f4f6;
          padding: 14px 20px;
        }
        .custom-table-modern tbody tr:hover {
          background: #fafafa;
        }
        .custom-table-modern td {
          border-bottom: 1px solid #f9fafb;
        }

        /* Pagination */
        .custom-pagination-ui .page-link {
          border: 1px solid #e5e7eb;
          color: #374151;
          margin: 0 3px;
          border-radius: 8px;
          padding: 7px 14px;
          font-size: 14px;
          transition: 0.2s;
          font-weight: 500;
        }
        .custom-pagination-ui .page-item.active .page-link {
          background: #3c69f6;
          border-color: #3c69f6;
          color: white;
          box-shadow: 0 4px 6px -1px rgba(60, 105, 246, 0.3);
        }
        .custom-pagination-ui .page-item.disabled .page-link {
          background: #f9fafb;
          color: #d1d5db;
          border-color: #f3f4f6;
        }

        .form-select,
        .form-control {
          border-radius: 8px;
          transition: border-color 0.2s;
        }
        .form-select:focus,
        .form-control:focus {
          border-color: #3c69f6;
          box-shadow: none;
        }
      `}</style>
    </section>
  );
}
