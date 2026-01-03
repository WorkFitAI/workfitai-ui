"use client";

import {
  clearAuthError,
  resendOTP,
  selectAuthError,
  selectAuthMessage,
  selectAuthStatus,
  verifyOTP,
  selectRegistrationRole,
} from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import FormButton from "@/components/auth/FormButton";
import FormError from "@/components/auth/FormError";
import FormSuccess from "@/components/auth/FormSuccess";
import OTPInput from "@/components/auth/OTPInput";

function VerifyOTPContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const message = useAppSelector(selectAuthMessage);
  const registrationRole = useAppSelector(selectRegistrationRole);

  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  const isLoading = status === "loading";

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearAuthError());
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleVerify = async () => {
    if (otp.length !== 6 || !email) return;

    const result = await dispatch(verifyOTP({ email, otp }));

    if (verifyOTP.fulfilled.match(result)) {
      // Check registrationRole to determine if approval is needed
      if (registrationRole === "HR") {
        // HR staff requires HR Manager approval
        router.push("/pending-approval?type=hr-manager");
      } else if (registrationRole === "HR_MANAGER") {
        // HR Manager requires Admin approval
        router.push("/pending-approval?type=admin");
      } else {
        // Candidate can sign in immediately
        router.push("/signin?verified=true");
      }
    }
  };

  const handleResend = async () => {
    if (!email) return;

    await dispatch(resendOTP({ email }));
    setTimeLeft(300); // Reset timer
    setOtp(""); // Clear OTP
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!email) {
    return (
      <AuthLayout
        title="Verify Your Email"
        subtitle="Error"
        description="Missing verification information."
      >
        <div className="text-center">
          <p className="text-danger">Invalid verification details.</p>
          <button
            className="btn btn-brand-1 mt-20"
            onClick={() => router.push("/register")}
          >
            Back to Register
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="OTP Verification"
      description={`Enter the 6-digit code sent to ${email}`}
    >
      <div className="text-center mb-30">
        <OTPInput
          value={otp}
          onChange={setOtp}
          error={!!error}
          autoFocus
          disabled={isLoading}
        />
      </div>

      <div className="text-center mt-3 mb-20">
        <p className="text-muted">
          Time remaining:{" "}
          <span className="text-brand-1 fw-bold">{formatTime(timeLeft)}</span>
        </p>
      </div>

      <FormError error={error} />
      <FormSuccess message={message} />

      <FormButton
        fullWidth
        onClick={handleVerify}
        loading={isLoading}
        disabled={otp.length !== 6 || isLoading}
      >
        Verify OTP
      </FormButton>

      <div className="text-center mt-20">
        <p className="text-muted mb-10">Didn&apos;t receive the code?</p>
        <button
          className="btn btn-link p-0 text-brand-1"
          onClick={handleResend}
          disabled={timeLeft > 240 || isLoading} // Enable after 1 minute
          style={{ textDecoration: "none" }}
        >
          Resend OTP {timeLeft > 240 && `(${timeLeft - 240}s)`}
        </button>
      </div>
    </AuthLayout>
  );
}

export default function VerifyOTP() {
  return (
    <Suspense fallback={<div className="text-center p-5">Loading...</div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}
