import React from "react";

const HRManagerNotificationsPage = () => {
    // TODO: Fetch HR_MANAGER notifications from API
    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24 }}>Notifications</h2>
            {/* Notification list here */}
            <div style={{ background: "#f8fafc", borderRadius: 12, padding: 24, minHeight: 200 }}>
                <p style={{ color: "#64748b" }}>No notifications yet.</p>
            </div>
        </div>
    );
};

export default HRManagerNotificationsPage;
