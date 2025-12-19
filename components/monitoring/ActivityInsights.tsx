"use client";

import { ActivitySummary } from "@/lib/monitoringApi";

interface ActivityInsightsProps {
    summary: ActivitySummary;
}

export default function ActivityInsights({ summary }: ActivityInsightsProps) {
    const getTopItems = (data: Record<string, number> | undefined, limit = 5) => {
        if (!data) return [];
        return Object.entries(data)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit);
    };

    const topUsers = getTopItems(summary.actionsByUser, 5);
    const topServices = getTopItems(summary.actionsByService, 5);
    const topActions = getTopItems(summary.topActions, 5);

    const getPercentage = (value: number, total: number) => {
        return total > 0 ? Math.round((value / total) * 100) : 0;
    };

    return (
        <div className="row">
            {/* Most Active Users */}
            <div className="col-lg-4 mb-3">
                <div className="card card-style-1 h-100">
                    <div className="card-header">
                        <h6 className="mb-0">Most Active Users</h6>
                    </div>
                    <div className="card-body">
                        {topUsers.length === 0 ? (
                            <p className="text-muted small">No data available</p>
                        ) : (
                            <div className="list-group list-group-flush">
                                {topUsers.map(([username, count], index) => {
                                    const percentage = getPercentage(count, summary.totalActions);
                                    return (
                                        <div key={username} className="list-group-item px-0">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <div className="d-flex align-items-center">
                                                    <span className="badge bg-primary me-2">
                                                        #{index + 1}
                                                    </span>
                                                    <strong className="small">{username}</strong>
                                                </div>
                                                <span className="badge bg-info">{count} actions</span>
                                            </div>
                                            <div className="progress" style={{ height: "6px" }}>
                                                <div
                                                    className="progress-bar bg-primary"
                                                    role="progressbar"
                                                    style={{ width: `${percentage}%` }}
                                                    aria-valuenow={percentage}
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Activity by Service */}
            <div className="col-lg-4 mb-3">
                <div className="card card-style-1 h-100">
                    <div className="card-header">
                        <h6 className="mb-0">Activity by Service</h6>
                    </div>
                    <div className="card-body">
                        {topServices.length === 0 ? (
                            <p className="text-muted small">No data available</p>
                        ) : (
                            <div className="list-group list-group-flush">
                                {topServices.map(([service, count]) => {
                                    const percentage = getPercentage(count, summary.totalActions);
                                    const colors = [
                                        "bg-primary",
                                        "bg-success",
                                        "bg-info",
                                        "bg-warning",
                                        "bg-secondary",
                                    ];
                                    const colorIndex = topServices.findIndex(([s]) => s === service);
                                    return (
                                        <div key={service} className="list-group-item px-0">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <strong className="small">{service}</strong>
                                                <span className="badge bg-secondary">{count}</span>
                                            </div>
                                            <div className="progress" style={{ height: "6px" }}>
                                                <div
                                                    className={`progress-bar ${colors[colorIndex % colors.length]}`}
                                                    role="progressbar"
                                                    style={{ width: `${percentage}%` }}
                                                    aria-valuenow={percentage}
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Actions */}
            <div className="col-lg-4 mb-3">
                <div className="card card-style-1 h-100">
                    <div className="card-header">
                        <h6 className="mb-0">Most Common Actions</h6>
                    </div>
                    <div className="card-body">
                        {topActions.length === 0 ? (
                            <p className="text-muted small">No data available</p>
                        ) : (
                            <div className="list-group list-group-flush">
                                {topActions.map(([action, count]) => {
                                    const percentage = getPercentage(count, summary.totalActions);
                                    return (
                                        <div key={action} className="list-group-item px-0">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <div className="small text-truncate" style={{ maxWidth: "200px" }}>
                                                    {action}
                                                </div>
                                                <span className="badge bg-success">{count}</span>
                                            </div>
                                            <div className="progress" style={{ height: "6px" }}>
                                                <div
                                                    className="progress-bar bg-success"
                                                    role="progressbar"
                                                    style={{ width: `${percentage}%` }}
                                                    aria-valuenow={percentage}
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
