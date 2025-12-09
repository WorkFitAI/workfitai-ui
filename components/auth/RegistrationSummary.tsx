"use client";

import React from "react";

interface RegistrationSummaryProps {
  role: "CANDIDATE" | "HR" | "HR_MANAGER";
  personalInfo: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  companyName?: string;
  department?: string;
}

export default function RegistrationSummary({
  role,
  personalInfo,
  companyName,
  department,
}: RegistrationSummaryProps) {
  const getRoleLabel = (r: string) => {
    switch (r) {
      case "CANDIDATE": return "Job Seeker";
      case "HR": return "HR Staff";
      case "HR_MANAGER": return "HR Manager";
      default: return r;
    }
  };

  return (
    <div className="registration-summary mb-30 p-3 bg-light rounded">
      <h5 className="mb-15 text-brand-1">Review Information</h5>

      <div className="row mb-10">
        <div className="col-4 text-muted font-sm">Account Type:</div>
        <div className="col-8 font-sm fw-bold">{getRoleLabel(role)}</div>
      </div>

      <div className="row mb-10">
        <div className="col-4 text-muted font-sm">Name:</div>
        <div className="col-8 font-sm">{personalInfo.fullName}</div>
      </div>

      <div className="row mb-10">
        <div className="col-4 text-muted font-sm">Email:</div>
        <div className="col-8 font-sm">{personalInfo.email}</div>
      </div>

      <div className="row mb-10">
        <div className="col-4 text-muted font-sm">Username:</div>
        <div className="col-8 font-sm">{personalInfo.username}</div>
      </div>

      <div className="row mb-10">
        <div className="col-4 text-muted font-sm">Phone:</div>
        <div className="col-8 font-sm">{personalInfo.phoneNumber}</div>
      </div>

      {companyName && (
        <div className="row mb-10">
          <div className="col-4 text-muted font-sm">Company:</div>
          <div className="col-8 font-sm">{companyName}</div>
        </div>
      )}

      {department && (
        <div className="row mb-10">
          <div className="col-4 text-muted font-sm">Department:</div>
          <div className="col-8 font-sm">{department}</div>
        </div>
      )}
    </div>
  );
}
