"use client";

import React from "react";

interface FormButtonProps {
  type?: "submit" | "button" | "reset";
  children: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function FormButton({
  type = "submit",
  children,
  loading = false,
  loadingText = "Loading...",
  disabled = false,
  fullWidth = true,
  onClick,
  className = "",
}: FormButtonProps) {
  return (
    <div className="form-group">
      <button
        className={`btn btn-brand-1 hover-up ${fullWidth ? "w-100" : ""} ${className}`}
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
      >
        {loading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            {loadingText}
          </>
        ) : (
          children
        )}
      </button>
    </div>
  );
}
