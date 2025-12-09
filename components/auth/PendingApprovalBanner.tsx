"use client";

interface PendingApprovalBannerProps {
  approvalType: "hr-manager" | "admin";
  message?: string;
}

const PendingApprovalBanner = ({
  approvalType,
  message,
}: PendingApprovalBannerProps) => {
  const approverName =
    approvalType === "hr-manager" ? "HR Manager" : "Administrator";
  const defaultMessage = `Your account is pending approval from ${approverName}. You will be notified once your account is activated.`;

  return (
    <div className="pending-approval-banner">
      <div className="pending-approval-banner__icon">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="pending-approval-banner__content">
        <h4 className="pending-approval-banner__title">Pending Approval</h4>
        <p className="pending-approval-banner__message">
          {message || defaultMessage}
        </p>
      </div>
    </div>
  );
};

export default PendingApprovalBanner;
