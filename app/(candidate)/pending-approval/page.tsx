"use client";

import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import PendingApprovalBanner from "@/components/auth/PendingApprovalBanner";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PendingApprovalContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "hr-manager" | "admin" | null;
  const context = searchParams.get("context") as
    | "registration"
    | "login"
    | null;

  // Default to hr-manager if not specified (most common case for self-registration)
  const approvalType = type === "admin" ? "admin" : "hr-manager";
  const isLoginContext = context === "login";

  const approverTitle = approvalType === "admin" ? "Admin" : "HR Manager";

  return (
    <AuthLayout
      title={
        isLoginContext ? "Account Pending Approval" : "Registration Successful"
      }
      subtitle="Awaiting Approval"
      description={
        isLoginContext
          ? "Your account is currently being reviewed by an administrator."
          : "Your account has been created and submitted for review."
      }
      imageVariant="3"
    >
      {/* Success Icon */}
      <div className="text-center mb-30">
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#E8F5E9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <i
            className="fi fi-rr-clock"
            style={{
              fontSize: "40px",
              color: "#4CAF50",
            }}
          ></i>
        </div>
        <h4 className="mb-10" style={{ color: "#05264E" }}>
          {isLoginContext
            ? "Your account is under review"
            : "Your account is being reviewed"}
        </h4>
        {isLoginContext && (
          <p className="text-muted" style={{ fontSize: "14px" }}>
            You cannot sign in until your account has been approved.
          </p>
        )}
      </div>

      <div className="mb-30">
        <PendingApprovalBanner approvalType={approvalType} />
      </div>

      {/* Information Card */}
      <div
        className="card p-4 mb-30"
        style={{
          border: "1px solid #E0E6F7",
          borderRadius: "12px",
          backgroundColor: "#F8F9FA",
        }}
      >
        <h6 className="mb-15" style={{ color: "#05264E" }}>
          What happens next?
        </h6>
        <ul className="list-unstyled mb-0">
          {!isLoginContext && (
            <li className="mb-10 d-flex align-items-start">
              <i className="fi fi-rr-check-circle text-success me-10 mt-5"></i>
              <span className="text-muted">
                Your registration has been submitted to the {approverTitle}
              </span>
            </li>
          )}
          {isLoginContext && (
            <li className="mb-10 d-flex align-items-start">
              <i className="fi fi-rr-hourglass-end text-primary me-10 mt-5"></i>
              <span className="text-muted">
                Your account is awaiting approval from the {approverTitle}
              </span>
            </li>
          )}
          <li className="mb-10 d-flex align-items-start">
            <i className="fi fi-rr-envelope text-info me-10 mt-5"></i>
            <span className="text-muted">
              You&apos;ll receive an email notification once your account is
              approved
            </span>
          </li>
          <li className="mb-0 d-flex align-items-start">
            <i className="fi fi-rr-time-fast text-warning me-10 mt-5"></i>
            <span className="text-muted">
              Approval typically takes 1-2 business days
            </span>
          </li>
        </ul>
      </div>

      <div className="text-center">
        {isLoginContext && (
          <div
            className="alert alert-info mb-20"
            style={{ borderRadius: "8px" }}
          >
            <i className="fi fi-rr-info me-10"></i>
            <strong>Tip:</strong> You can try signing in again later to check if
            your account has been approved.
          </div>
        )}

        <p className="text-muted mb-20" style={{ fontSize: "14px" }}>
          If you have any questions or concerns, please contact support at{" "}
          <a href="mailto:support@workfitai.com" className="text-brand-1">
            support@workfitai.com
          </a>
        </p>

        {isLoginContext ? (
          <div className="d-flex gap-3">
            <Link href="/signin" className="btn btn-default w-100 hover-up">
              <i className="fi fi-rr-arrow-left me-10"></i>
              Back to Sign In
            </Link>
            <Link href="/" className="btn btn-brand-1 w-100 hover-up">
              <i className="fi fi-rr-home me-10"></i>
              Homepage
            </Link>
          </div>
        ) : (
          <Link href="/" className="btn btn-brand-1 w-100 hover-up">
            <i className="fi fi-rr-home me-10"></i>
            Back to Homepage
          </Link>
        )}
      </div>
    </AuthLayout>
  );
}

export default function PendingApproval() {
  return (
    <Suspense fallback={<div className="text-center p-5">Loading...</div>}>
      <PendingApprovalContent />
    </Suspense>
  );
}
