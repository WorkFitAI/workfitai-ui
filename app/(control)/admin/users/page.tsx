"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { selectAuthUser, selectUserId } from "@/redux/features/auth/authSlice";
import {
    userApi,
    buildSearchRequest,
    formatUserRole,
    formatUserStatus,
    getStatusColor,
    getRoleColor,
} from "@/lib/userApi";
import {
    UserSearchFilters,
    UserSearchHit,
} from "@/types/users";
import { getInitials, getAvatarColor } from "@/util/avatarUtils";
import { showToast, getErrorMessage } from "@/lib/toast";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function UsersManagementPage() {
    const router = useRouter();
    const currentUser = useAppSelector(selectAuthUser);
    const currentUserId = useAppSelector(selectUserId);
    const [users, setUsers] = useState<UserSearchHit[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalHits, setTotalHits] = useState(0);
    const [roleAggregations, setRoleAggregations] = useState<Record<string, number>>({});
    const [statusAggregations, setStatusAggregations] = useState<Record<string, number>>({});
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [confirmModal, setConfirmModal] = React.useState<{
        show: boolean;
        title: string;
        message: string;
        variant: "danger" | "warning" | "info" | "primary";
        onConfirm: () => void;
    } | null>(null);

    const [filters, setFilters] = useState<UserSearchFilters>({
        query: "",
        role: "",
        status: "",
        blocked: undefined,
        includeDeleted: false,
        page: 0,
        size: 10,
        sortField: "createdAt",
        sortOrder: "desc",
    });

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const searchRequest = buildSearchRequest(filters);
            const response = await userApi.searchUsers(searchRequest);

            if (response.status === 200 && response.data) {
                setUsers(response.data.hits);
                setTotalHits(response.data.totalHits);
                setRoleAggregations(response.data.roleAggregations || {});
                setStatusAggregations(response.data.statusAggregations || {});
            }
        } catch (error) {
            console.error("Failed to load users:", error);
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
        // Prevent blocking yourself
        if (username === currentUser?.username) {
            showToast.error("You cannot block yourself");
            return;
        }

        setConfirmModal({
            show: true,
            title: currentBlocked ? 'Unblock User' : 'Block User',
            message: `Are you sure you want to ${currentBlocked ? "unblock" : "block"} this user?`,
            variant: currentBlocked ? 'info' : 'warning',
            onConfirm: async () => {
                setConfirmModal(null);
                try {
                    await userApi.blockUser(username, !currentBlocked);
                    showToast.success(`User ${currentBlocked ? "unblocked" : "blocked"} successfully`);
                    loadUsers();
                } catch (error) {
                    console.error("Failed to block/unblock user:", error);
                    showToast.error(getErrorMessage(error));
                }
            }
        });
    };

    const handleDelete = async (username: string) => {
        // Prevent deleting yourself
        if (username === currentUser?.username) {
            showToast.error("You cannot delete yourself");
            return;
        }

        setConfirmModal({
            show: true,
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this user? This action cannot be undone.',
            variant: 'danger',
            onConfirm: async () => {
                setConfirmModal(null);
                try {
                    await userApi.deleteUser(username);
                    showToast.success("User deleted successfully");
                    loadUsers();
                } catch (error) {
                    console.error("Failed to delete user:", error);
                    showToast.error(getErrorMessage(error));
                }
            }
        });
    };

    const totalPages = Math.ceil(totalHits / (filters.size || 10));
    const currentPage = filters.page || 0;

    useEffect(() => {
        const handleClick = () => setActiveDropdown(null);
        if (activeDropdown) {
            document.addEventListener('click', handleClick);
            return () => document.removeEventListener('click', handleClick);
        }
    }, [activeDropdown]);

    return (
        <div className="box-content">
            {confirmModal && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setConfirmModal(null)}>
                    <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{confirmModal.title}</h5>
                                <button type="button" className="btn-close" onClick={() => setConfirmModal(null)}></button>
                            </div>
                            <div className="modal-body">
                                <p>{confirmModal.message}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setConfirmModal(null)}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={() => { confirmModal.onConfirm(); setConfirmModal(null); }}>OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="section-box">
                <div className="container">
                    <div className="panel-white mb-30">
                        <div className="box-padding">
                            <div className="d-flex align-items-center justify-content-between mb-20">
                                <div>
                                    <h5 className="mb-5">User Management</h5>
                                    <p className="text-muted font-sm mb-0">Overview of {totalHits} system users</p>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    {loading && <div className="spinner-border spinner-border-sm text-primary" role="status"><span className="sr-only">Loading...</span></div>}
                                    <Link href="/admin/approvals/hr-managers" className="btn btn-default">
                                        <svg className="me-2" style={{ width: "16px", height: "16px", display: "inline-block" }} fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                                        </svg>
                                        HR Manager Approvals
                                    </Link>
                                </div>
                            </div>

                            {/* Modern Stats Overview */}
                            <div className="row mb-4">
                                {/* Total Users */}
                                <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-body p-3">
                                            <div className="d-flex align-items-center">
                                                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                                                    <svg style={{ width: "24px", height: "24px" }} fill="#3b82f6" viewBox="0 0 20 20">
                                                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="mb-0 fw-bold fs-4">{totalHits}</h3>
                                                    <p className="mb-0 text-muted small">Total Users</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Admin */}
                                <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-body p-3">
                                            <div className="d-flex align-items-center">
                                                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                                                    <svg style={{ width: "24px", height: "24px" }} fill="#10b981" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="mb-0 fw-bold fs-4">{roleAggregations.ADMIN || 0}</h3>
                                                    <p className="mb-0 text-muted small">Admins</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* HR Manager */}
                                <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-body p-3">
                                            <div className="d-flex align-items-center">
                                                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(96, 165, 250, 0.1)' }}>
                                                    <svg style={{ width: "24px", height: "24px" }} fill="#60a5fa" viewBox="0 0 20 20">
                                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="mb-0 fw-bold fs-4">{roleAggregations.HR_MANAGER || 0}</h3>
                                                    <p className="mb-0 text-muted small">HR Managers</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* HR */}
                                <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-body p-3">
                                            <div className="d-flex align-items-center">
                                                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                                                    <svg style={{ width: "24px", height: "24px" }} fill="#f59e0b" viewBox="0 0 20 20">
                                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="mb-0 fw-bold fs-4">{roleAggregations.HR || 0}</h3>
                                                    <p className="mb-0 text-muted small">HR Staff</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Active */}
                                <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-body p-3">
                                            <div className="d-flex align-items-center">
                                                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                                                    <svg style={{ width: "24px", height: "24px" }} fill="#22c55e" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="mb-0 fw-bold fs-4">{statusAggregations.ACTIVE || 0}</h3>
                                                    <p className="mb-0 text-muted small">Active</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Pending */}
                                <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-body p-3">
                                            <div className="d-flex align-items-center">
                                                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(251, 191, 36, 0.1)' }}>
                                                    <svg style={{ width: "24px", height: "24px" }} fill="#fbbf24" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="mb-0 fw-bold fs-4">{statusAggregations.WAIT_APPROVED || 0}</h3>
                                                    <p className="mb-0 text-muted small">Waiting Approval</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-top mt-4 pt-30">
                                <div className="mb-30">
                                    <h6 className="color-text-paragraph-2 mb-20">
                                        <svg className="mr-10" style={{ width: "16px", height: "16px", display: "inline-block", verticalAlign: "middle" }} fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                                        </svg>
                                        Filter Users
                                    </h6>
                                    <form onSubmit={handleSearch}>
                                        <div className="row mb-15">
                                            <div className="col-lg-4 col-md-6 mb-10">
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Search by name, email, username..."
                                                        value={filters.query || ""}
                                                        onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-6 mb-10">
                                                <div className="form-group">
                                                    <select
                                                        className="form-control"
                                                        value={filters.role || ""}
                                                        onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 0 })}
                                                    >
                                                        <option value="">All Roles</option>
                                                        <option value="ADMIN">Admin</option>
                                                        <option value="HR_MANAGER">HR Manager</option>
                                                        <option value="HR">HR</option>
                                                        <option value="CANDIDATE">Candidate</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-6 mb-10">
                                                <div className="form-group">
                                                    <select
                                                        className="form-control"
                                                        value={filters.status || ""}
                                                        onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 0 })}
                                                    >
                                                        <option value="">All Status</option>
                                                        <option value="ACTIVE">Active</option>
                                                        <option value="WAIT_APPROVED">Wait Approved</option>
                                                        <option value="SUSPENDED">Suspended</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-6 mb-10">
                                                <div className="form-group">
                                                    <select
                                                        className="form-control"
                                                        value={filters.blocked === undefined ? "" : filters.blocked.toString()}
                                                        onChange={(e) => setFilters({ ...filters, blocked: e.target.value === "" ? undefined : e.target.value === "true", page: 0 })}
                                                    >
                                                        <option value="">All Users</option>
                                                        <option value="false">Not Blocked</option>
                                                        <option value="true">Blocked</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-6 mb-10">
                                                <button type="submit" className="btn btn-default w-100">
                                                    <svg className="mr-5" style={{ width: "14px", height: "14px", display: "inline-block", verticalAlign: "middle" }} fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                                    </svg>
                                                    Search
                                                </button>
                                            </div>
                                        </div>
                                        {/* Company Filters - Show only when HR or HR_MANAGER role is selected */}
                                        {(filters.role === "HR" || filters.role === "HR_MANAGER") && (
                                            <div className="row">
                                                <div className="col-lg-3 col-md-6 mb-10">
                                                    <div className="form-group">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Company Number..."
                                                            value={filters.companyNo || ""}
                                                            onChange={(e) => setFilters({ ...filters, companyNo: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-3 col-md-6 mb-10">
                                                    <div className="form-group">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Company Name..."
                                                            value={filters.companyName || ""}
                                                            onChange={(e) => setFilters({ ...filters, companyName: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="row">
                                            <div className="col-lg-3 col-md-6 mb-10">
                                                <div className="form-group d-flex align-items-center" style={{ height: "100%", paddingTop: "8px" }}>
                                                    <label className="form-check mb-0">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={filters.includeDeleted || false}
                                                            onChange={(e) => setFilters({ ...filters, includeDeleted: e.target.checked, page: 0 })}
                                                        />
                                                        <span className="form-check-label">Include Deleted</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-20">
                                    <div><h6 className="color-text-paragraph-2 mb-0">Showing {users.length} of {totalHits} users</h6></div>
                                </div>

                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="border-bottom-0 pt-10 pb-10">User</th>
                                                <th className="border-bottom-0 pt-10 pb-10">Role</th>
                                                <th className="border-bottom-0 pt-10 pb-10">Status</th>
                                                <th className="border-bottom-0 pt-10 pb-10">Created</th>
                                                <th className="border-bottom-0 pt-10 pb-10 text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr><td colSpan={5} className="text-center pt-30 pb-30"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></td></tr>
                                            ) : users.length === 0 ? (
                                                <tr><td colSpan={5} className="text-center pt-30 pb-30"><p className="color-text-paragraph-2 mb-0">No users found</p></td></tr>
                                            ) : (
                                                users.map((user) => (
                                                    <tr key={user.userId} className="border-bottom">
                                                        <td className="pt-15 pb-15">
                                                            <div className="d-flex align-items-center">
                                                                <div className="position-relative mr-15">
                                                                    {user.avatarUrl ? (
                                                                        <img src={user.avatarUrl} alt={user.username} className="rounded-circle" style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
                                                                    ) : (
                                                                        <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: '48px', height: '48px', backgroundColor: getAvatarColor(user.username), fontSize: '18px' }}>{getInitials(user.username)}</div>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <h6 className="mb-0 font-sm">{user.fullName || user.username}</h6>
                                                                    <p className="font-xs color-text-paragraph-2 mb-5">@{user.username}</p>
                                                                    <p className="font-xs color-text-mutted mb-0">{user.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="pt-15 pb-15"><span className={`badge bg-${getRoleColor(user.role)}`}>{formatUserRole(user.role)}</span></td>
                                                        <td className="pt-15 pb-15"><span className={`badge bg-${getStatusColor(user.status)}`}>{formatUserStatus(user.status)}</span>{user.blocked && <span className="badge bg-danger ml-5">Blocked</span>}</td>
                                                        <td className="pt-15 pb-15"><span className="font-xs color-text-paragraph-2">{new Date(user.createdAt).toLocaleDateString()}</span></td>
                                                        <td className="pt-15 pb-15 text-end">
                                                            <div className="position-relative d-inline-block">
                                                                <button className="btn btn-sm btn-light rounded-circle" style={{ width: '36px', height: '36px' }} onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === user.username ? null : user.username); }}>
                                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="3" r="1.5" fill="currentColor" /><circle cx="8" cy="8" r="1.5" fill="currentColor" /><circle cx="8" cy="13" r="1.5" fill="currentColor" /></svg>
                                                                </button>
                                                                {activeDropdown === user.username && (
                                                                    <div className="dropdown-menu show position-absolute" style={{ right: 0, top: '40px', minWidth: '160px', zIndex: 1000 }} onClick={(e) => e.stopPropagation()}>
                                                                        <Link href={`/admin/users/${user.username}`} className="dropdown-item"><svg className="mr-10" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 5C6.34315 5 5 6.34315 5 8C5 9.65685 6.34315 11 8 11C9.65685 11 11 9.65685 11 8C11 6.34315 9.65685 5 8 5Z" stroke="currentColor" strokeWidth="1.5" /><path d="M1 8C1 8 3.5 3 8 3C12.5 3 15 8 15 8C15 8 12.5 13 8 13C3.5 13 1 8 1 8Z" stroke="currentColor" strokeWidth="1.5" /></svg>View Profile</Link>
                                                                        <button
                                                                            className="dropdown-item"
                                                                            onClick={() => { setActiveDropdown(null); handleBlock(user.username, user.blocked); }}
                                                                            disabled={currentUserId === user.userId}
                                                                            style={currentUserId === user.userId ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                                                        >
                                                                            <svg className="mr-10" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5" /><path d="M3.5 3.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" /></svg>
                                                                            {user.blocked ? 'Unblock User' : 'Block User'}
                                                                        </button>
                                                                        <button
                                                                            className="dropdown-item text-danger"
                                                                            onClick={() => { setActiveDropdown(null); handleDelete(user.username); }}
                                                                            disabled={user.deleted || currentUserId === user.userId}
                                                                            style={(user.deleted || currentUserId === user.userId) ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                                                        >
                                                                            <svg className="mr-10" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4H14M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4M12.5 4L12 13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13L3.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                                                                            Delete User
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {totalPages > 1 && (
                                    <div className="paginations mt-30">
                                        <ul className="pager">
                                            <li><button className="pager-prev" disabled={currentPage === 0} onClick={() => setFilters({ ...filters, page: currentPage - 1 })} /></li>
                                            {Array.from({ length: totalPages }, (_, i) => (<li key={i}><a className={currentPage === i ? "pager-number active" : "pager-number"} onClick={() => setFilters({ ...filters, page: i })}>{i + 1}</a></li>))}
                                            <li><button className="pager-next" disabled={currentPage >= totalPages - 1} onClick={() => setFilters({ ...filters, page: currentPage + 1 })} /></li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Confirm Modal */}
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
            </div>
        </div>
    );
}
