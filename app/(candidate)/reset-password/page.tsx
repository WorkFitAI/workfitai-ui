"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import FormInput from "@/components/auth/FormInput";
import FormButton from "@/components/auth/FormButton";
import FormError from "@/components/auth/FormError";
import FormSuccess from "@/components/auth/FormSuccess";
import { validateEmail } from "@/lib/validation";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | undefined>(undefined);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Clear previous state
    setError(null);
    setSuccess(null);
    setFieldError(undefined);

    // Validate email
    if (!email.trim()) {
      setFieldError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setFieldError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL || "http://localhost:9085/auth";

      const response = await fetch(`${AUTH_API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      setSuccess("Password reset link has been sent to your email. Please check your inbox.");
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Reset Your Password"
      description="Enter email address associated with your account and we'll send you a link to reset your password"
    >
      <form className="login-register text-start mt-20" onSubmit={handleSubmit}>
        <FormInput
          id="email"
          label="Email address"
          type="email"
          value={email}
          onChange={setEmail}
          required
          placeholder="stevenjob@gmail.com"
          autoComplete="email"
          error={fieldError}
        />

        <FormError error={error} />
        <FormSuccess message={success} />

        <FormButton
          type="submit"
          loading={isLoading}
          loadingText="Sending..."
          disabled={isLoading}
        >
          Send Reset Link
        </FormButton>

        <div className="text-muted text-center mt-20">
          Remember your password?{" "}
          <Link href="/signin">
            <span>Sign in</span>
          </Link>
        </div>

        <div className="text-muted text-center mt-10">
          Don&apos;t have an account?{" "}
          <Link href="/register">
            <span>Sign up</span>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
