"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createApplication } from "@/redux/features/application/applicationSlice";
import { checkIfApplied } from "@/lib/applicationApi";
import ApplicationForm from "@/components/application/ApplicationForm";
import type { CreateApplicationRequest } from "@/types/application/application";
import { showToast } from "@/lib/toast";

interface ApplySectionProps {
  jobId: string;
}

const ApplySection = ({ jobId }: ApplySectionProps): React.ReactElement => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [hasApplied, setHasApplied] = useState<boolean>(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check if already applied
  useEffect(() => {
    if (user && jobId) {
      setCheckingStatus(true);
      checkIfApplied(jobId)
        .then((res) => setHasApplied(res.applied))
        .catch(() => {})
        .finally(() => setCheckingStatus(false));
    } else {
      setCheckingStatus(false);
    }
  }, [jobId, user]);

  const handleApplicationSubmit = async (
    data: CreateApplicationRequest
  ): Promise<void> => {
    try {
      await dispatch(createApplication(data)).unwrap();
      setHasApplied(true);
      setShowApplicationForm(false);
      showToast.success(
        "Application submitted successfully! We will review your application and get back to you soon."
      );
    } catch (error) {
      showToast.error("Failed to submit application. Please try again.");
    }
  };

  if (checkingStatus) {
    return (
      <div className="card card-style-1 mt-4">
        <div className="card-body text-center">
          <div className="spinner-border spinner-border-sm"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card card-style-1 mt-4">
      <div className="card-body">
        {!user ? (
          <div className="text-center">
            <p className="mb-3">Please sign in to apply for this position</p>
            <Link href="/register" className="btn btn-brand-1">
              Sign In to Apply
            </Link>
          </div>
        ) : hasApplied ? (
          <div className="alert alert-success">
            <i className="fi fi-rr-check-circle me-2"></i>
            You have already applied to this position.
            <Link
              href="/my-applications"
              className="ms-3 btn btn-sm btn-outline-primary"
            >
              View Application
            </Link>
          </div>
        ) : showApplicationForm ? (
          <ApplicationForm
            jobId={jobId}
            onSubmit={handleApplicationSubmit}
            onCancel={() => setShowApplicationForm(false)}
          />
        ) : (
          <button
            className="btn btn-brand-1 btn-lg w-100"
            onClick={() => setShowApplicationForm(true)}
          >
            <i className="fi fi-rr-paper-plane me-2"></i>
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplySection;
