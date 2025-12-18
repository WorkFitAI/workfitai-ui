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
            console.error("Failed to load pending HR staff:", error);
            showToast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    }, [keyword, page, size]);

    useEffect(() => {
        loadPendingUsers();
    }, [loadPendingUsers]);

    const handleApprove = async (username: string) => {
        if (!confirm("Are you sure you want to approve this HR staff member?")) {
            return;
        }

        try {
            await approvalApi.approveHRStaff(username);
            showToast.success("HR staff approved successfully");
            loadPendingUsers();
        } catch (error) {
            console.error("Failed to approve HR staff:", error);
            showToast.error(getErrorMessage(error));
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(0);
        loadPendingUsers();
    };

    const totalPages = Math.ceil(totalElements / size);

    return (
        <div className="section-box mt-20">
            <div className="container">
                <div className="row mb-4">
                    <div className="col-lg-8">
                        <h5 className="mb-2">HR Staff Approvals</h5>
                        <p className="text-muted">
                            Review and approve pending HR staff registrations from your company
                        </p>
                    </div>
                    <div className="col-lg-4 text-lg-end">
                        <Link href="/hr-manager" className="btn btn-default">
                            Back to Dashboard
                        </Link>
                    </div>
                </div>

                {/* Statistics */}
                <div className="row mb-4">
                    <div className="col-lg-4 col-md-6">
                        <div className="card card-style-1">
                            <div className="card-body text-center">
                                <h3 className="mb-2">{totalElements}</h3>
                                <p className="text-muted mb-0">
                                    Pending Approvals
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="row mt-30">
                    <div className="col-lg-12">
                        <form onSubmit={handleSearch}>
                            <div className="row">
                                <div className="col-lg-8 col-md-8">
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search by name, email, department..."
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-4">
                                    <button type="submit" className="btn btn-default btn-block">
                                        Search
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Pending Users Table */}
                <div className="row mt-30">
                    <div className="col-lg-12">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>HR Staff</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Department</th>
                                        <th>Registered</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="text-center">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : pendingUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center">
                                                No pending approvals
                                            </td>
                                        </tr>
                                    ) : (
                                        pendingUsers.map((user) => (
                                            <tr key={user.userId}>
                                                <td>
                                                    <div className="candidate-info">
                                                        <h6 className="mb-5">
                                                            {user.fullName || user.username}
                                                        </h6>
                                                        <p className="text-sm color-text-paragraph">
                                                            @{user.username}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td>{user.email}</td>
                                                <td>{user.phoneNumber || "N/A"}</td>
                                                <td>{user.department || "N/A"}</td>
                                                <td>
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => handleApprove(user.username)}
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
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="row mt-30">
                        <div className="col-lg-12">
                            <div className="paginations">
                                <ul className="pager">
                                    <li>
                                        <button
                                            className="pager-prev"
                                            disabled={page === 0}
                                            onClick={() => setPage(page - 1)}
                                        />
                                    </li>
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <li key={i}>
                                            <a
                                                className={
                                                    page === i
                                                        ? "pager-number active"
                                                        : "pager-number"
                                                }
                                                onClick={() => setPage(i)}
                                            >
                                                {i + 1}
                                            </a>
                                        </li>
                                    ))}
                                    <li>
                                        <button
                                            className="pager-next"
                                            disabled={page >= totalPages - 1}
                                            onClick={() => setPage(page + 1)}
                                        />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
