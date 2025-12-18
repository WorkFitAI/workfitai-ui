"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { selectAuthUser } from "@/redux/features/auth/authSlice";
import {
    userApi,
    buildSearchRequest,
    formatUserRole,
    formatUserStatus,
    getStatusColor,
    getRoleColor,
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
    const [statusAggregations, setStatusAggregations] = useState<Record<string, number>>({});
    const [confirmModal, setConfirmModal] = useState<{
        show: boolean;
        title: string;
        message: string;
        variant: "danger" | "warning" | "info" | "primary";
        onConfirm: () => void;
    } | null>(null);

    const [filters, setFilters] = useState<UserSearchFilters>({
        query: "",
        role: "HR", // Default to HR role only
        status: "",
        blocked: undefined,
        includeDeleted: false,
        page: 0,
        size: 10,
        sortField: "createdAt",
        sortOrder: "desc",
        // Filter by current user's company
        companyNo: currentUser?.companyId,
    });

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const searchRequest = buildSearchRequest(filters);
            const response = await userApi.searchUsers(searchRequest);

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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters((prev) => ({ ...prev, page: 0 }));
    };

    const handleBlock = async (username: string, currentBlocked: boolean) => {
        setConfirmModal({
            show: true,
            title: currentBlocked ? 'Unblock HR Staff' : 'Block HR Staff',
            message: `Are you sure you want to ${currentBlocked ? "unblock" : "block"} this HR staff member?`,
            variant: currentBlocked ? 'info' : 'warning',
            onConfirm: async () => {
                setConfirmModal(null);
                try {
                    await userApi.blockUser(username, !currentBlocked);
                    showToast.success(`HR staff ${currentBlocked ? "unblocked" : "blocked"} successfully`);
                    loadUsers();
                } catch (error) {
                    console.error("Failed to block/unblock HR staff:", error);
                    showToast.error(getErrorMessage(error));
                }
            }
        });
    };

    const handleDelete = async (username: string) => {
        setConfirmModal({
            show: true,
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this HR staff member? This action cannot be undone.',
            variant: 'danger',
            onConfirm: async () => {
                setConfirmModal(null);
                try {
                    await userApi.deleteUser(username);
                    showToast.success("HR staff deleted successfully");
                    loadUsers();
                } catch (error) {
                    console.error("Failed to delete HR staff:", error);
                    showToast.error(getErrorMessage(error));
                }
            }
        });
    };

    const totalPages = Math.ceil(totalHits / (filters.size || 10));
    const currentPage = filters.page || 0;

    return (
        <div className="section-box mt-20">
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

                <div className="row mb-4">
                    <div className="col-lg-8">
                        <h5 className="mb-2">HR Staff Management</h5>
                        <p className="text-muted">Manage {totalHits} HR staff members from your company</p>
                    </div>
                    <div className="col-lg-4 text-lg-end">
                        <Link href="/hr-manager/approvals/hr" className="btn btn-default">
                            <svg className="me-2" style={{ width: "16px", height: "16px", display: "inline-block" }} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                            </svg>
                            Pending Approvals
                        </Link>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="row mb-4">
                    <div className="col-lg-3 col-md-6 mb-3">
                        <div className="card card-style-1">
                            <div className="card-body text-center">
                                <h3 className="mb-2">{totalHits}</h3>
                                <p className="text-muted mb-0">Total HR Staff</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-3">
                        <div className="card card-style-1">
                            <div className="card-body text-center">
                                <h3 className="mb-2">{statusAggregations.ACTIVE || 0}</h3>
                                <p className="text-muted mb-0">Active</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-3">
                        <div className="card card-style-1">
                            <div className="card-body text-center">
                                <h3 className="mb-2">{statusAggregations.PENDING || 0}</h3>
                                <p className="text-muted mb-0">Pending</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-3">
                        <div className="card card-style-1">
                            <div className="card-body text-center">
                                <h3 className="mb-2">{statusAggregations.SUSPENDED || 0}</h3>
                                <p className="text-muted mb-0">Suspended</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="card card-style-1 mb-4">
                    <div className="card-body">
                        <h6 className="mb-3">Search HR Staff</h6>
                        <form onSubmit={handleSearch}>
                            <div className="row">
                                <div className="col-lg-6 col-md-6 mb-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by name, email, username..."
                                        value={filters.query || ""}
                                        onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                                    />
                                </div>
                                <div className="col-lg-3 col-md-6 mb-2">
                                    <select
                                        className="form-control"
                                        value={filters.status || ""}
                                        onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 0 })}
                                    >
                                        <option value="">All Status</option>
                                        <option value="ACTIVE">Active</option>
                                        <option value="PENDING">Pending</option>
                                        <option value="SUSPENDED">Suspended</option>
                                    </select>
                                </div>
                                <div className="col-lg-3 col-md-6 mb-2">
                                    <button type="submit" className="btn btn-default w-100">
                                        Search
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* HR Staff Table */}
                <div className="card card-style-1">
                    <div className="card-body">
                        <h6 className="mb-3">HR Staff List</h6>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>HR Staff</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Department</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-4">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : users.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-4">
                                                No HR staff found
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.userId}>
                                                <td>
                                                    <Link href={`/admin/users/${user.username}`} className="text-decoration-none">
                                                        <div className="d-flex align-items-center">
                                                            <div
                                                                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                                                style={{
                                                                    width: "40px",
                                                                    height: "40px",
                                                                    backgroundColor: getAvatarColor(user.username),
                                                                    color: "#fff",
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                {getInitials(user.fullName || user.username)}
                                                            </div>
                                                            <div>
                                                                <div className="fw-medium">{user.fullName || user.username}</div>
                                                                <small className="text-muted">@{user.username}</small>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </td>
                                                <td>{user.email}</td>
                                                <td>{user.phoneNumber || "N/A"}</td>
                                                <td>{user.department || "N/A"}</td>
                                                <td>
                                                    <span className={`badge bg-${getStatusColor(user.status)}`}>
                                                        {formatUserStatus(user.status)}
                                                    </span>
                                                    {user.blocked && (
                                                        <span className="badge bg-danger ms-2">Blocked</span>
                                                    )}
                                                </td>
                                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                                <td className="text-end">
                                                    <div className="btn-group">
                                                        <button
                                                            className={`btn btn-sm ${user.blocked ? "btn-success" : "btn-warning"}`}
                                                            onClick={() => handleBlock(user.username, user.blocked || false)}
                                                            disabled={user.deleted}
                                                        >
                                                            {user.blocked ? "Unblock" : "Block"}
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDelete(user.username)}
                                                            disabled={user.deleted}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-4 d-flex justify-content-center">
                                <nav>
                                    <ul className="pagination">
                                        <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setFilters({ ...filters, page: currentPage - 1 })}
                                                disabled={currentPage === 0}
                                            >
                                                Previous
                                            </button>
                                        </li>
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            const pageNum = Math.max(0, Math.min(currentPage - 2, totalPages - 5)) + i;
                                            return (
                                                <li key={pageNum} className={`page-item ${currentPage === pageNum ? "active" : ""}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => setFilters({ ...filters, page: pageNum })}
                                                    >
                                                        {pageNum + 1}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                        <li className={`page-item ${currentPage >= totalPages - 1 ? "disabled" : ""}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setFilters({ ...filters, page: currentPage + 1 })}
                                                disabled={currentPage >= totalPages - 1}
                                            >
                                                Next
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
