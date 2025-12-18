"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { selectAuthUser, selectUserId } from "@/redux/features/auth/authSlice";
import {
    userApi,
    formatUserRole,
    formatUserStatus,
    getStatusColor,
    getRoleColor,
} from "@/lib/userApi";
import { UserListItem } from "@/types/users";
import { showToast, getErrorMessage } from "@/lib/toast";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const currentUser = useAppSelector(selectAuthUser);
    const currentUserId = useAppSelector(selectUserId);
    const username = params.id as string; // Route still uses [id] but contains username

    const [user, setUser] = useState<UserListItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmModal, setConfirmModal] = useState<{
        show: boolean;
        title: string;
        message: string;
        variant: "danger" | "warning" | "info" | "primary";
        onConfirm: () => void;
    } | null>(null);

    // Check if viewing own profile (compare username)
    const isOwnProfile = currentUser?.username === username;

    useEffect(() => {
        loadUser();
    }, [username]);

    const loadUser = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await userApi.getUserByUsername(username);
            if (response.status === 200 && response.data) {
                setUser(response.data);
            } else {
                setError(response.message || "Failed to load user");
            }
        } catch (error: any) {
            console.error("Failed to load user:", error);

            // Check for UUID conversion error
            if (error?.message?.includes("UUID") || error?.message?.includes("MethodArgumentTypeMismatchException")) {
                setError("Backend error: The server is expecting a UUID but received a username. Please contact the administrator to update the backend endpoint to accept usernames.");
            } else {
                setError(getErrorMessage(error));
            }
            showToast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleBlock = async () => {
        if (!user) return;

        // Prevent blocking yourself
        if (isOwnProfile) {
            showToast.error("You cannot block yourself");
            return;
        }

        setConfirmModal({
            show: true,
            title: user.blocked ? 'Unblock User' : 'Block User',
            message: `Are you sure you want to ${user.blocked ? "unblock" : "block"} this user?`,
            variant: user.blocked ? 'info' : 'warning',
            onConfirm: async () => {
                setConfirmModal(null);
                try {
                    await userApi.blockUser(username, !user.blocked);
                    showToast.success(`User ${user.blocked ? "unblocked" : "blocked"} successfully`);
                    loadUser();
                } catch (error) {
                    console.error("Failed to block/unblock user:", error);
                    showToast.error(getErrorMessage(error));
                }
            }
        });
    };

    const handleDelete = async () => {
        // Prevent deleting yourself
        if (isOwnProfile) {
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
                    router.push("/admin/users");
                } catch (error) {
                    console.error("Failed to delete user:", error);
                    showToast.error(getErrorMessage(error));
                }
            }
        });
    };

    if (loading) {
        return (
            <div className="section-box">
                <div className="container">
                    <div className="panel-white">
                        <div className="box-padding text-center py-5">
                            <div className="spinner-border text-primary mb-3" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mb-0">Loading user details...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="section-box">
                <div className="container">
                    <div className="panel-white">
                        <div className="box-padding text-center py-5">
                            <div className="mb-4">
                                <svg style={{ width: "64px", height: "64px" }} fill="#dc3545" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h5 className="mb-3">{error ? "Error Loading User" : "User Not Found"}</h5>
                            {error && (
                                <div className="alert alert-danger text-start mx-auto mb-4" style={{ maxWidth: "600px" }}>
                                    <p className="mb-0">{error}</p>
                                </div>
                            )}
                            <Link href="/admin/users" className="btn btn-default">
                                <svg className="me-2" style={{ width: "16px", height: "16px", display: "inline-block" }} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Back to Users
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="section-box mt-20">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8">
                        {/* Basic Information */}
                        <div className="card card-style-1 mb-4">
                            <div className="card-body">
                                <h6 className="mb-4">Basic Information</h6>
                                <div className="table-responsive">
                                    <table className="table table-borderless mb-0">
                                        <tbody>
                                            <tr>
                                                <td className="text-muted" style={{ width: "35%" }}>User ID:</td>
                                                <td className="fw-medium">{user.userId}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">Username:</td>
                                                <td className="fw-medium">@{user.username}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">Full Name:</td>
                                                <td className="fw-medium">{user.fullName || "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">Email:</td>
                                                <td className="fw-medium">{user.email}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">Phone Number:</td>
                                                <td className="fw-medium">{user.phoneNumber || "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">Role:</td>
                                                <td>
                                                    <span className={`badge bg-${getRoleColor(user.role)}`}>
                                                        {formatUserRole(user.role)}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">Status:</td>
                                                <td>
                                                    <span className={`badge bg-${getStatusColor(user.status)}`}>
                                                        {formatUserStatus(user.status)}
                                                    </span>
                                                    {user.blocked && (
                                                        <span className="badge bg-danger ms-2">Blocked</span>
                                                    )}
                                                    {user.deleted && (
                                                        <span className="badge bg-secondary ms-2">Deleted</span>
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">Created At:</td>
                                                <td className="fw-medium">
                                                    {new Date(user.createdAt).toLocaleString()}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">Last Updated:</td>
                                                <td className="fw-medium">
                                                    {new Date(user.updatedAt).toLocaleString()}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* HR/HR_MANAGER specific information */}
                        {(user.role === "HR" || user.role === "HR_MANAGER") && (
                            <div className="card card-style-1 mb-4">
                                <div className="card-body">
                                    <h6 className="mb-4">Company Information</h6>
                                    <div className="table-responsive">
                                        <table className="table table-borderless mb-0">
                                            <tbody>
                                                {user.companyName && (
                                                    <tr>
                                                        <td className="text-muted" style={{ width: "35%" }}>Company:</td>
                                                        <td className="fw-medium">{user.companyName}</td>
                                                    </tr>
                                                )}
                                                {user.companyNo && (
                                                    <tr>
                                                        <td className="text-muted">Company No:</td>
                                                        <td className="fw-medium">{user.companyNo}</td>
                                                    </tr>
                                                )}
                                                {user.department && (
                                                    <tr>
                                                        <td className="text-muted">Department:</td>
                                                        <td className="fw-medium">{user.department}</td>
                                                    </tr>
                                                )}
                                                {user.address && (
                                                    <tr>
                                                        <td className="text-muted">Address:</td>
                                                        <td className="fw-medium">{user.address}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Actions */}
                    <div className="col-lg-4">
                        {/* Actions Card */}
                        <div className="card card-style-1 mb-4">
                            <div className="card-body">
                                <h6 className="mb-3">Actions</h6>
                                {isOwnProfile && (
                                    <div className="alert alert-warning mb-3">
                                        <small>You cannot block or delete yourself</small>
                                    </div>
                                )}
                                <div className="d-grid gap-2">
                                    <button
                                        className={`btn ${user.blocked ? "btn-success" : "btn-warning"}`}
                                        onClick={handleBlock}
                                        disabled={user.deleted || isOwnProfile}
                                    >
                                        {user.blocked ? "Unblock User" : "Block User"}
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={handleDelete}
                                        disabled={user.deleted || isOwnProfile}
                                    >
                                        Delete User
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Status Information Card */}
                        <div className="card card-style-1">
                            <div className="card-body">
                                <h6 className="mb-3">Status Information</h6>
                                <div className={`alert ${user.blocked || user.deleted ? 'alert-warning' : 'alert-success'} mb-0`}>
                                    {user.blocked && (
                                        <div className="mb-2">
                                            <strong>🚫 Blocked</strong>
                                            <p className="mb-0 small mt-1">This user cannot login</p>
                                        </div>
                                    )}
                                    {user.deleted && (
                                        <div className="mb-2">
                                            <strong>🗑️ Deleted</strong>
                                            <p className="mb-0 small mt-1">This user is soft deleted</p>
                                        </div>
                                    )}
                                    {!user.blocked && !user.deleted && (
                                        <div>
                                            <strong>✅ Active</strong>
                                            <p className="mb-0 small mt-1">User account is normal</p>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-3">
                                    <Link href="/admin/users" className="btn btn-default btn-sm w-100">
                                        Back to Users
                                    </Link>
                                </div>
                            </div>
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
    );
}
