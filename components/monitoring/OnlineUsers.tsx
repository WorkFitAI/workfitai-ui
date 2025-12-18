"use client";

import { useEffect, useState } from "react";
import { monitoringApi, UserActivityEntry } from "@/lib/monitoringApi";

interface OnlineUsersProps {
    minutes?: number;
    refreshInterval?: number;
}

export default function OnlineUsers({ minutes = 15, refreshInterval = 30000 }: OnlineUsersProps) {
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [recentActivities, setRecentActivities] = useState<UserActivityEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeWindow, setTimeWindow] = useState(minutes);

    useEffect(() => {
        fetchOnlineUsers();
        const interval = setInterval(fetchOnlineUsers, refreshInterval);
        return () => clearInterval(interval);
    }, [timeWindow]);

    const fetchOnlineUsers = async () => {
        try {
            const response = await monitoringApi.getOnlineUsers(timeWindow);
            
            // Extract unique usernames
            const uniqueUsers = Array.from(
                new Set(response.activities?.map(a => a.username).filter(Boolean))
            );
            setOnlineUsers(uniqueUsers);
            
            // Get recent activities for display
            setRecentActivities(response.activities?.slice(0, 10) || []);
            
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch online users:", error);
            setLoading(false);
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        
        const hours = Math.floor(minutes / 60);
        return `${hours}h ago`;
    };

    return (
        <div className="card card-style-1">
            <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                    <h5 className="mb-0">
                        <i className="fi-rr-signal-stream text-success me-2"></i>
                        Online Users
                    </h5>
                    <small className="text-muted">Active in the last {timeWindow} minutes</small>
                </div>
                <div className="btn-group btn-group-sm">
                    <button
                        className={`btn ${timeWindow === 5 ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setTimeWindow(5)}
                    >
                        5m
                    </button>
                    <button
                        className={`btn ${timeWindow === 15 ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setTimeWindow(15)}
                    >
                        15m
                    </button>
                    <button
                        className={`btn ${timeWindow === 30 ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setTimeWindow(30)}
                    >
                        30m
                    </button>
                </div>
            </div>
            <div className="card-body">
                {loading ? (
                    <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-3">
                            <h2 className="text-success mb-0">
                                <i className="fi-rr-users me-2"></i>
                                {onlineUsers.length}
                            </h2>
                            <small className="text-muted">Currently active</small>
                        </div>

                        {recentActivities.length > 0 && (
                            <div>
                                <h6 className="text-muted mb-2">Recent Activity:</h6>
                                <div className="list-group list-group-flush">
                                    {recentActivities.map((activity, idx) => (
                                        <div key={idx} className="list-group-item px-0 py-2 border-0">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div className="flex-grow-1">
                                                    <div className="d-flex align-items-center mb-1">
                                                        <span className="badge bg-success me-2">
                                                            <i className="fi-rr-dot-circle"></i>
                                                        </span>
                                                        <strong className="text-truncate" style={{ maxWidth: "150px" }}>
                                                            {activity.username}
                                                        </strong>
                                                    </div>
                                                    <small className="text-muted d-block text-truncate">
                                                        {activity.action}
                                                    </small>
                                                </div>
                                                <small className="text-muted ms-2">
                                                    {formatTimestamp(activity.timestamp)}
                                                </small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {onlineUsers.length === 0 && (
                            <div className="text-center text-muted py-3">
                                <i className="fi-rr-user-time" style={{ fontSize: "2rem" }}></i>
                                <p className="mt-2 mb-0">No users active in the last {timeWindow} minutes</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
