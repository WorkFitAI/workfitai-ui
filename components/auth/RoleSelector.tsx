"use client";

import React from "react";

interface RoleSelectorProps {
  value: "CANDIDATE" | "HR" | "HR_MANAGER" | null;
  onChange: (role: "CANDIDATE" | "HR" | "HR_MANAGER") => void;
  error?: string;
}

const ROLE_INFO = {
  CANDIDATE: {
    title: "Job Seeker",
    description: "Find and apply to jobs",
    iconClass: "fi fi-rr-user",
    color: "#6C757D",
    note: undefined as string | undefined,
  },
  HR: {
    title: "HR Staff",
    description: "Post jobs and review applications",
    iconClass: "fi fi-rr-briefcase",
    note: "Requires HR Manager approval",
    color: "#3C65F5",
  },
  HR_MANAGER: {
    title: "HR Manager",
    description: "Manage company and HR staff",
    iconClass: "fi fi-rr-star",
    note: "Requires Admin approval",
    color: "#FFB800",
  },
};

export default function RoleSelector({
  value,
  onChange,
  error,
}: RoleSelectorProps) {
  return (
    <div className="role-selector mb-20">
      <div
        className="d-flex justify-content-center align-items-stretch"
        style={{ gap: "16px", maxWidth: "900px", margin: "0 auto" }}
      >
        {(Object.keys(ROLE_INFO) as Array<keyof typeof ROLE_INFO>).map(
          (roleKey) => {
            const isSelected = value === roleKey;
            const roleInfo = ROLE_INFO[roleKey];

            return (
              <div
                key={roleKey}
                className={`role-card ${isSelected ? "selected" : ""}`}
                onClick={() => onChange(roleKey)}
                role="button"
                aria-pressed={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onChange(roleKey);
                  }
                }}
                style={{
                  cursor: "pointer",
                  border: isSelected
                    ? `2px solid ${roleInfo.color}`
                    : "2px solid #E0E6F7",
                  borderRadius: "12px",
                  padding: "20px 14px",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  backgroundColor: isSelected ? "#F8F9FA" : "#FFFFFF",
                  width: "250px",
                  flex: "0 0 250px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  position: "relative",
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: isSelected ? roleInfo.color : "#F8F9FA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <i
                    className={roleInfo.iconClass}
                    style={{
                      fontSize: "24px",
                      color: isSelected ? "#FFFFFF" : roleInfo.color,
                    }}
                  ></i>
                </div>

                {/* Title */}
                <h6
                  className="mb-8"
                  style={{
                    color: isSelected ? roleInfo.color : "#05264E",
                    fontWeight: "600",
                    fontSize: "15px",
                  }}
                >
                  {roleInfo.title}
                </h6>

                {/* Description */}
                <p
                  className="text-muted mb-8"
                  style={{ lineHeight: "1.4", fontSize: "12px" }}
                >
                  {roleInfo.description}
                </p>

                {/* Note badge */}
                {roleInfo.note && (
                  <div
                    className="mt-6"
                    style={{
                      fontSize: "10px",
                      color: "#FFB800",
                      backgroundColor: "#FFF8E1",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      display: "inline-block",
                      fontWeight: "500",
                    }}
                  >
                    {roleInfo.note}
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>
      {error && (
        <div
          className="text-danger text-center mt-10"
          style={{ fontSize: "14px" }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
