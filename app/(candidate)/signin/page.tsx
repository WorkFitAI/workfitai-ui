"use client";

import {
  clearAuthError,
  loginUser,
  selectAuthError,
  selectAuthMessage,
  selectAuthStatus,
  selectUserRoles,
  selectAuthErrorType,
  selectRequire2FA,
  selectTemp2FAToken,
  selectTwoFactorMethod,
} from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState, Suspense } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import FormInput from "@/components/auth/FormInput";
import PasswordInput from "@/components/auth/PasswordInput";
import FormButton from "@/components/auth/FormButton";
import SocialLogin from "@/components/auth/SocialLogin";
import FormDivider from "@/components/auth/FormDivider";
import FormError from "@/components/auth/FormError";
import FormSuccess from "@/components/auth/FormSuccess";

function SigninContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const message = useAppSelector(selectAuthMessage);
  const errorType = useAppSelector(selectAuthErrorType);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const roles = useAppSelector(selectUserRoles);
  const require2FA = useAppSelector(selectRequire2FA);
  const temp2FAToken = useAppSelector(selectTemp2FAToken);
  const twoFactorMethod = useAppSelector(selectTwoFactorMethod);

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localMessage, setLocalMessage] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");

  const isLoading = status === "loading";

  // Check for verified query param
  useEffect(() => {
    if (verified === "true") {
      setLocalMessage("Email verified successfully! Please log in.");
    }
  }, [verified]);

  // Redirect if already authenticated
  useEffect(() => {
    if (accessToken && roles.length > 0) {
      if (roles.includes("ADMIN")) {
        router.replace("/admin");
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

  // Redirect to 2FA verification if required
  useEffect(() => {
    if (require2FA && temp2FAToken) {
      router.push(`/verify-2fa?tempToken=${temp2FAToken}&method=${twoFactorMethod}`);
    }
  }, [require2FA, temp2FAToken, twoFactorMethod, router]);

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
    if (!usernameOrEmail || !password) return;

    setLocalMessage(null); // Clear local success message on submit
    await dispatch(loginUser({ usernameOrEmail, password }));
  };

  const handleGoogleLogin = () => {
    // Implement Google login logic here
    console.log("Google login clicked");
  };

  return (
    <AuthLayout
      title="Member Login"
      subtitle="Welcome back!"
      description="Access to all features. No credit card required."
      showSocialLogin={true}
      imageVariant="4"
    >
      <SocialLogin
        provider="google"
        onClick={handleGoogleLogin}
        text="Sign in with Google"
      />

      <FormDivider text="Or continue with" />

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
        />

        <PasswordInput
          id="password"
          label="Password"
          value={password}
          onChange={setPassword}
          required
          placeholder="************"
          showForgotPassword={true}
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
