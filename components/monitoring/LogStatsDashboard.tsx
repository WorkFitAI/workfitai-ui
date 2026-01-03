"use client";

import { useEffect, useState } from "react";
import { monitoringApi, LogStatistics } from "@/lib/monitoringApi";

interface LogStatsDashboardProps {
    hours?: number;
    refreshInterval?: number;
}

export default function LogStatsDashboard({ hours = 24, refreshInterval = 60000 }: LogStatsDashboardProps) {
    const [stats, setStats] = useState<LogStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState(hours);

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, refreshInterval);
        return () => clearInterval(interval);
    }, [timeRange]);

    const fetchStats = async () => {
        try {
            const data = await monitoringApi.getStatistics(timeRange);
            setStats(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch log statistics:", error);
            setLoading(false);
        }
    };

    const calculatePercentage = (count: number, total: number) => {
        if (!total || total === 0) return 0;
        return ((count / total) * 100).toFixed(1);
    };

    if (loading || !stats) {
        return (
            <div className="card card-style-1">
                <div className="card-body text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading statistics...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card card-style-1">
            <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                    <h5 className="mb-0">
                        <i className="fi-rr-chart-histogram text-primary me-2"></i>
                        User Activity Statistics
                    </h5>
                    <small className="text-muted">User actions in the last {timeRange} hours (excludes system logs)</small>
                </div>
                <div className="btn-group btn-group-sm">
                    <button
                        className={`btn ${timeRange === 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setTimeRange(1)}
                    >
                        1h
                    </button>
                    <button
                        className={`btn ${timeRange === 24 ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setTimeRange(24)}
                    >
                        24h
                    </button>
                    <button
                        className={`btn ${timeRange === 168 ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setTimeRange(168)}
                    >
                        7d
                    </button>
                </div>
            </div>
            <div className="card-body">
                {/* Activity Level Breakdown */}
                <div className="mb-4">
                    <h6 className="text-muted mb-3">Activity Levels (User Actions Only)</h6>
                    <div className="row g-2">
                        <div className="col-6 col-md-3">
                            <div className="p-3 border rounded">
                                <div className="d-flex align-items-center justify-content-between">
                                    <span className="badge bg-danger">ERROR</span>
                                    <h5 className="mb-0 text-danger">{stats.errorCount || 0}</h5>
                                </div>
                                <div className="progress mt-2" style={{ height: "4px" }}>
                                    <div
                                        className="progress-bar bg-danger"
                                        style={{ width: `${calculatePercentage(stats.errorCount || 0, stats.totalLogs || 0)}%` }}
                                    ></div>
                                </div>
                                <small className="text-muted">
                                    {calculatePercentage(stats.errorCount || 0, stats.totalLogs || 0)}%
                                </small>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="p-3 border rounded">
                                <div className="d-flex align-items-center justify-content-between">
                                    <span className="badge bg-warning">WARN</span>
                                    <h5 className="mb-0 text-warning">{stats.warnCount || 0}</h5>
                                </div>
                                <div className="progress mt-2" style={{ height: "4px" }}>
                                    <div
                                        className="progress-bar bg-warning"
                                        style={{ width: `${calculatePercentage(stats.warnCount || 0, stats.totalLogs || 0)}%` }}
                                    ></div>
                                </div>
                                <small className="text-muted">
                                    {calculatePercentage(stats.warnCount || 0, stats.totalLogs || 0)}%
                                </small>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="p-3 border rounded">
                                <div className="d-flex align-items-center justify-content-between">
                                    <span className="badge bg-info">INFO</span>
                                    <h5 className="mb-0 text-info">{stats.infoCount || 0}</h5>
                                </div>
                                <div className="progress mt-2" style={{ height: "4px" }}>
                                    <div
                                        className="progress-bar bg-info"
                                        style={{ width: `${calculatePercentage(stats.infoCount || 0, stats.totalLogs || 0)}%` }}
                                    ></div>
                                </div>
                                <small className="text-muted">
                                    {calculatePercentage(stats.infoCount || 0, stats.totalLogs || 0)}%
                                </small>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="p-3 border rounded">
                                <div className="d-flex align-items-center justify-content-between">
                                    <span className="badge bg-secondary">DEBUG</span>
                                    <h5 className="mb-0 text-secondary">{stats.debugCount || 0}</h5>
                                </div>
                                <div className="progress mt-2" style={{ height: "4px" }}>
                                    <div
                                        className="progress-bar bg-secondary"
                                        style={{ width: `${calculatePercentage(stats.debugCount || 0, stats.totalLogs || 0)}%` }}
                                    ></div>
                                </div>
                                <small className="text-muted">
                                    {calculatePercentage(stats.debugCount || 0, stats.totalLogs || 0)}%
                                </small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Activity by Service */}
                {stats.logsByService && Object.keys(stats.logsByService).length > 0 && (
                    <div>
                        <h6 className="text-muted mb-3">User Activity by Service</h6>
                        <div className="table-responsive">
                            <table className="table table-sm table-borderless">
                                <tbody>
                                    {Object.entries(stats.logsByService)
                                        .sort(([, a], [, b]) => b - a)
                                        .map(([service, count]) => (
                                            <tr key={service}>
                                                <td style={{ width: "40%" }}>
                                                    <span className="badge bg-primary">{service}</span>
                                                </td>
                                                <td>
                                                    <div className="progress" style={{ height: "20px" }}>
                                                        <div
                                                            className="progress-bar"
                                                            style={{
                                                                width: `${calculatePercentage(count, stats.totalLogs || 0)}%`,
                                                            }}
                                                        >
                                                            {count}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-end" style={{ width: "15%" }}>
                                                    <small className="text-muted">
                                                        {calculatePercentage(count, stats.totalLogs || 0)}%
                                                    </small>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Total User Activities */}
                <div className="mt-4 pt-3 border-top">
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">Total User Activities:</span>
                        <h4 className="mb-0">{(stats.totalLogs || 0).toLocaleString()}</h4>
                    </div>
                </div>
            </div>
        </div>
    );
}
