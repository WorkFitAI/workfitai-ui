"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function HRManagerDashboard(): React.ReactElement {
    const router = useRouter();

    const menuItems = [
        {
            title: "Manage Applications",
            description: "Review and manage all job applications",
            icon: "📝",
            path: "/hr-manager/manage-applications",
            color: "border-primary",
        },
        {
            title: "Company Applications",
            description: "View applications across all companies",
            icon: "💼",
            path: "/hr-manager/company-applications",
            color: "border-success",
        },
        {
            title: "HR Approvals",
            description: "Approve or reject HR account requests",
            icon: "✅",
            path: "/hr-manager/approvals/hr",
            color: "border-warning",
        },
        {
            title: "HR Management",
            description: "Manage HR accounts and permissions",
            icon: "👥",
            path: "/hr-manager/hr-management",
            color: "border-info",
        },
        {
            title: "User Management",
            description: "Manage all platform users",
            icon: "👤",
            path: "/hr-manager/users",
            color: "border-danger",
        },
        {
            title: "Application Analytics",
            description: "View detailed application statistics",
            icon: "📊",
            path: "/hr-manager/application-analytics",
            color: "border-secondary",
        },
    ];

    return (
        <div className="col-lg-12">
            <div className="section-box">
                <div className="container">
                    <div className="mb-5">
                        <h2 className="mb-2">HR Manager Dashboard</h2>
                        <p className="text-muted">
                            Welcome to your management hub. Select an option below to get started.
                        </p>
                    </div>

                    <div className="row g-4">
                        {menuItems.map((item, index) => (
                            <div key={index} className="col-lg-4 col-md-6">
                                <div
                                    className={`card h-100 border-2 ${item.color}`}
                                    onClick={() => router.push(item.path)}
                                    style={{
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-5px)";
                                        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    <div className="card-body">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="me-3" style={{ fontSize: "2rem" }}>
                                                {item.icon}
                                            </div>
                                            <h5 className="mb-0">{item.title}</h5>
                                        </div>
                                        <p className="text-muted mb-0">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Stats Section */}
                    <div className="row mt-5">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header bg-light">
                                    <h5 className="mb-0">Quick Access</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-4 mb-3 mb-md-0">
                                            <button
                                                onClick={() => router.push("/hr-manager/manage-applications")}
                                                className="btn btn-primary w-100"
                                            >
                                                📝 View All Applications
                                            </button>
                                        </div>
                                        <div className="col-md-4 mb-3 mb-md-0">
                                            <button
                                                onClick={() => router.push("/hr-manager/approvals/hr")}
                                                className="btn btn-warning w-100"
                                            >
                                                ✅ Pending Approvals
                                            </button>
                                        </div>
                                        <div className="col-md-4">
                                            <button
                                                onClick={() => router.push("/hr-manager/application-analytics")}
                                                className="btn btn-info w-100"
                                            >
                                                📊 View Analytics
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
