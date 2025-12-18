"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { approvalApi, HRApprovalUser } from "@/lib/approvalApi";
import { showToast, getErrorMessage } from "@/lib/toast";

export default function AdminHRManagerApprovalsPage() {
    const [pendingUsers, setPendingUsers] = useState<HRApprovalUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [keyword, setKeyword] = useState("");

    const loadPendingUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await approvalApi.getPendingHRManagers({
                keyword,
                page,
                size,
                status: "WAIT_APPROVED",
                role: "HR_MANAGER",
            });

            if (response.status === 200 && response.data) {
                setPendingUsers(response.data.hits);
                setTotalElements(response.data.totalHits);
            }
        } catch (error) {
            console.error("Failed to load pending HR Managers:", error);
            showToast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    }, [keyword, page, size]);

    useEffect(() => {
        loadPendingUsers();
    }, [loadPendingUsers]);

    const handleApprove = async (username: string) => {
        if (!confirm("Are you sure you want to approve this HR Manager?")) {
            return;
        }

        try {
            await approvalApi.approveHRManager(username);
            showToast.success("HR Manager approved successfully");
            loadPendingUsers();
        } catch (error) {
            console.error("Failed to approve HR Manager:", error);
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
                {/* Page Header */}
                <div className="card card-style-1 mb-4">
                    <div className="card-body px-4 py-4">
                        <div className="row align-items-center">
                            {/* Left content */}
                            <div className="col-lg-12">
                                <h4 className="fw-bold mb-1">
                                    HR Manager Approvals
                                </h4>

                                <p className="text-muted mb-3">
                                    Review, verify and approve HR Manager registration requests
                                </p>

                                {/* Inline stat */}
                                <div className="d-flex">
                                    <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded bg-soft-warning">
                                        <span className="fs-4 fw-bold text-warning">
                                            {totalElements}
                                        </span>
                                        <span className="fw-medium text-dark">
                                            Pending approvals
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="card card-style-1 mb-4">
                    <div className="card-body">
                        <form onSubmit={handleSearch}>
                            <div className="row">
                                <div className="col-lg-8 col-md-8">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by name, email, company..."
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                    />
                                </div>
                                <div className="col-lg-4 col-md-4">
                                    <button type="submit" className="btn btn-default w-100">
                                        Search
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Pending Users Table */}
                <div className="card card-style-1 mb-4">
                    <div className="card-body">
                        <h6 className="mb-3">Pending HR Managers</h6>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>HR Manager</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Company</th>
                                        <th>Department</th>
                                        <th>Registered</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="text-center">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : pendingUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center">
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
                                                <td>{user.companyName || "N/A"}</td>
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
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-4">
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
