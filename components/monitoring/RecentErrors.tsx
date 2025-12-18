"use client";

import { useEffect, useState } from "react";
import { monitoringApi, LogEntry } from "@/lib/monitoringApi";

interface RecentErrorsProps {
    minutes?: number;
}

export default function RecentErrors({ minutes = 15 }: RecentErrorsProps) {
    const [errors, setErrors] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchErrors();
        const interval = setInterval(fetchErrors, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, [minutes]);

    const fetchErrors = async () => {
        try {
            const data = await monitoringApi.getRecentErrors(minutes);
            setErrors(data);
        } catch (error) {
            console.error("Failed to fetch recent errors:", error);
        } finally {
            setLoading(false);
        }
    };

    const getSeverityClass = (message: string) => {
        const lower = message.toLowerCase();
        if (lower.includes("critical") || lower.includes("fatal")) {
            return "border-danger bg-danger-subtle";
        }
        if (lower.includes("warning") || lower.includes("warn")) {
            return "border-warning bg-warning-subtle";
        }
        return "border-danger bg-danger-subtle";
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        return date.toLocaleTimeString();
    };

    if (loading) {
        return (
            <div className="text-center p-3">
                <div className="spinner-border spinner-border-sm text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (errors.length === 0) {
        return (
            <div className="alert alert-success mb-0">
                <i className="fi-rr-check-circle me-2"></i>
                No errors in the last {minutes} minutes
            </div>
        );
    }

    return (
        <div className="list-group">
            {errors.slice(0, 5).map((error) => (
                <div
                    key={error.id}
                    className={`list-group-item list-group-item-action border-start border-3 ${getSeverityClass(error.message)}`}
                >
                    <div className="d-flex w-100 justify-content-between align-items-start">
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-1">
                                <span className="badge bg-danger me-2">ERROR</span>
                                <span className="badge bg-secondary me-2">{error.service}</span>
                                {error.username && (
                                    <span className="badge bg-info">{error.username}</span>
                                )}
                            </div>
                            <p className="mb-1 small">
                                <strong>{error.message}</strong>
                            </p>
                            {error.exception && (
                                <p className="mb-0 small text-muted">
                                    <code className="text-danger">{error.exception}</code>
                                </p>
                            )}
                        </div>
                        <small className="text-muted text-nowrap ms-2">
                            {formatTimestamp(error.timestamp)}
                        </small>
                    </div>
                </div>
            ))}
        </div>
    );
}
