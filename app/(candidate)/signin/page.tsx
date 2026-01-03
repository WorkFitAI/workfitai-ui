"use client";

import {
  clearAuthError,
  loginUser,
  selectAuthError,
  selectAuthMessage,
  selectAuthStatus,
  selectUserRoles,
  selectAuthErrorType,
} from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState, Suspense, useRef } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import FormInput from "@/components/auth/FormInput";
import PasswordInput from "@/components/auth/PasswordInput";
import FormButton from "@/components/auth/FormButton";
import SocialLogin from "@/components/auth/SocialLogin";
import FormDivider from "@/components/auth/FormDivider";
import FormError from "@/components/auth/FormError";
import FormSuccess from "@/components/auth/FormSuccess";
import { showToast } from "@/lib/toast";

function SigninContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const message = useAppSelector(selectAuthMessage);
  const errorType = useAppSelector(selectAuthErrorType);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const roles = useAppSelector(selectUserRoles);

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localMessage, setLocalMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Track previous error/message to show toast only on change
  const prevErrorRef = useRef<string | null>(null);
  const prevMessageRef = useRef<string | null>(null);

  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");

  // Prevent hydration mismatch by only showing loading state after mount
  const isLoading = mounted && status === "loading";

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check for verified query param
  useEffect(() => {
    if (verified === "true") {
      setLocalMessage("Email verified successfully! Please log in.");
      showToast.success("Email verified successfully! Please log in.");
    }
  }, [verified]);

  // Show toast notifications for auth errors
  useEffect(() => {
    if (error && error !== prevErrorRef.current) {
      showToast.error(error);
    }
    prevErrorRef.current = error;
  }, [error]);

  // Show toast notifications for auth success messages
  useEffect(() => {
    if (message && message !== prevMessageRef.current) {
      showToast.success(message);
    }
    prevMessageRef.current = message;
  }, [message]);

  // Redirect if already authenticated
  useEffect(() => {
    if (accessToken && roles.length > 0) {
      // Use router.replace for client-side navigation
      // This preserves the in-memory token (document.location.href would cause full reload and lose it)
      if (roles.includes("ADMIN")) {
        router.replace("/admin/users");
      } else if (roles.includes("HR_MANAGER")) {
        router.replace("/hr-manager");
      } else if (roles.includes("HR")) {
        router.replace("/hr/applications");
      } else {
        router.replace("/");
      }
    } else if (accessToken) {
      // Fallback if no roles yet
      router.replace("/");
    }
  }, [accessToken, roles, router]);

  // Handle 403 Forbidden errors (pending approval)
  useEffect(() => {
    if (errorType === "forbidden" && error) {
      // Check if error message contains "pending approval" (case-insensitive)
      const isPendingApproval = error
        .toLowerCase()
        .includes("pending approval");
      if (isPendingApproval) {
        // Clear the error to prevent it from showing
        dispatch(clearAuthError());
        // Redirect to pending approval page with login context
        router.push("/pending-approval?context=login");
      }
    }
  }, [errorType, error, router, dispatch]);

  // Clear stale errors on unmount only (not on mount to allow error detection)
  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Clear previous errors
    setFieldErrors({});
    setLocalMessage(null);

    // Validate fields
    const errors: Record<string, string> = {};

    if (!usernameOrEmail.trim()) {
      errors.usernameOrEmail = "Username or email is required";
    } else if (
      usernameOrEmail.includes("@") &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrEmail)
    ) {
      errors.usernameOrEmail = "Invalid email format";
    } else if (
      !usernameOrEmail.includes("@") &&
      usernameOrEmail.trim().length < 3
    ) {
      errors.usernameOrEmail = "Username must be at least 3 characters";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const result = await dispatch(
        loginUser({ usernameOrEmail, password })
      ).unwrap();

      // Check if 2FA is required and redirect
      if ("require2FA" in result && result.require2FA) {
        router.push(
          `/verify-2fa?tempToken=${result.tempToken}&method=${result.method}`
        );
      }
    } catch (error) {
      // Error is already handled by Redux reducer
    }
  };

  return (
    <AuthLayout
      title="Member Login"
      subtitle="Welcome back!"
      description="Access to all features. No credit card required."
      showSocialLogin={true}
      imageVariant="4"
    >
      {/* OAuth Login Buttons - Google and GitHub */}
      <SocialLogin
        provider="google"
        text="Sign in with Google"
        disabled={isLoading}
      />
      <SocialLogin
        provider="github"
        text="Sign in with GitHub"
        disabled={isLoading}
      />

      <FormDivider text="Or continue with email" />

      <form className="login-register text-start mt-20" onSubmit={handleSubmit}>
        <FormInput
          id="usernameOrEmail"
          label="Username or Email address"
          type="text"
          value={usernameOrEmail}
          onChange={setUsernameOrEmail}
          required
          placeholder="stevenjob"
          autoComplete="username"
          error={fieldErrors.usernameOrEmail}
        />

        <PasswordInput
          id="password"
          label="Password"
          value={password}
          onChange={setPassword}
          required
          placeholder="************"
          showForgotPassword={true}
          error={fieldErrors.password}
        />

        <FormError error={error} />
        <FormSuccess message={localMessage || message} />

        <FormButton
          type="submit"
          loading={isLoading}
          loadingText="Signing in..."
          disabled={isLoading}
        >
          Login
        </FormButton>

        <div className="text-muted text-center">
          Don&apos;t have an Account?{" "}
          <Link href="/register">
            <span>Sign up</span>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default function Signin() {
  return (
    <Suspense fallback={<div className="text-center p-5">Loading...</div>}>
      <SigninContent />
    </Suspense>
  );
}
