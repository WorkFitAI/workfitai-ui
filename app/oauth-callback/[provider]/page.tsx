"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { processOAuthCallback, parseOAuthError, getStoredOAuthState, clearOAuthState, type OAuthCallbackResponse } from "@/lib/oauthApi";
import { useAppDispatch } from "@/redux/hooks";
import { setAccessToken } from "@/lib/axios-client";
import { setOAuthLoginSuccess } from "@/redux/features/auth/authSlice";
import { showToast } from "@/lib/toast";

type CallbackStatus = "loading" | "success" | "error";

// Timeout for callback processing (15 seconds)
const CALLBACK_TIMEOUT = 15000;

function OAuthCallbackContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const [status, setStatus] = useState<CallbackStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const provider = params.provider as string;

  useEffect(() => {
    if (!provider) return;

    // Timeout controller
    const timeoutId = setTimeout(() => {
      if (status === "loading") {
        setStatus("error");
        setErrorMessage("OAuth callback timed out. Please try again.");
        clearOAuthState();
        setTimeout(() => router.push("/signin"), 2000);
      }
    }, CALLBACK_TIMEOUT);

    const processCallback = async (): Promise<void> => {
      try {
        // Check for OAuth error from provider
        const oauthError = parseOAuthError(searchParams);
        if (oauthError) {
          setStatus("error");
          setErrorMessage(oauthError.message);
          showToast.error(oauthError.message);
          clearOAuthState();
          setTimeout(() => router.push("/signin"), 2000);
          return;
        }

        // Get authorization code and state
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        if (!code || !state) {
          setStatus("error");
          setErrorMessage("Missing authorization code or state parameter");
          showToast.error("OAuth flow interrupted. Please try again.");
          clearOAuthState();
          setTimeout(() => router.push("/signin"), 2000);
          return;
        }

        // Validate provider matches stored state (CSRF protection)
        const storedOAuth = getStoredOAuthState();
        if (storedOAuth.provider && storedOAuth.provider.toLowerCase() !== provider.toLowerCase()) {
          setStatus("error");
          setErrorMessage("Provider mismatch detected. Please try again.");
          showToast.error("Security check failed. Please restart the sign-in process.");
          clearOAuthState();
          setTimeout(() => router.push("/signin"), 2000);
          return;
        }

        // Exchange code for tokens
        // Backend now returns opaque tokens (not JWT) after going through Gateway
        const response = await processOAuthCallback(provider, code, state);

        // Handle successful login
        if (response.tokenType === "Bearer" && (response.token || response.accessToken)) {
          // response.token or response.accessToken is now an OPAQUE token (32-char UUID)
          // NOT a JWT - this is converted by API Gateway for security
          const accessToken = response.token || response.accessToken;
          const expiryTime = response.expiresIn
            ? Date.now() + (response.expiresIn * 1000)
            : response.expiryInMs
              ? Date.now() + response.expiryInMs
              : null;

          // Extract username safely
          const username = response.username
            || response.userInfo?.name
            || (response.userInfo?.email ? response.userInfo.email.split("@")[0] : "user");
          const email = response.userInfo?.email;
          const avatarUrl = response.userInfo?.picture;
          const roles = response.roles || ["CANDIDATE"];
          const companyId = response.companyId;

          // Store token in axios in-memory store
          setAccessToken(
            accessToken!,
            expiryTime ?? undefined,
            username,
            roles,
            companyId
          );

          // Update Redux state (this is the source of truth)
          dispatch(setOAuthLoginSuccess({
            accessToken: accessToken!,
            expiryTime,
            username,
            roles,
            companyId,
            email,
            avatarUrl,
          }));

          // Store minimal session info in localStorage for UI state restoration after hard redirect
          // Note: Token is NOT stored in localStorage (XSS protection) - only metadata
          const sessionData = {
            username,
            roles,
            companyId,
            expiryTime,
          };
          localStorage.setItem("auth_session", JSON.stringify(sessionData));

          // Store username for WebSocket authentication
          if (username) {
            localStorage.setItem("username", username);
          }

          // Clear logout flag
          localStorage.removeItem("auth_logged_out");

          setStatus("success");
          showToast.success("Successfully signed in!");

          // Wait briefly for state to propagate, then redirect based on role
          // Using hard redirect to load correct template assets for different layouts
          await new Promise(resolve => setTimeout(resolve, 100));

          if (roles.includes("ADMIN")) {
            window.location.href = "/admin/users";
          } else if (roles.includes("HR_MANAGER")) {
            window.location.href = "/hr-manager";
          } else if (roles.includes("HR")) {
            window.location.href = "/hr/applications";
          } else {
            window.location.href = "/";
          }
        } else {
          // Unexpected response
          throw new Error("Invalid token response from server");
        }
      } catch (error) {
        setStatus("error");
        const message = error instanceof Error ? error.message : "OAuth authentication failed";
        setErrorMessage(message);
        showToast.error(message);
        clearOAuthState();
        setTimeout(() => router.push("/signin"), 3000);
      }
    };

    processCallback();

    return () => clearTimeout(timeoutId);
  }, [provider, searchParams, router, dispatch, status]);

  return (
    <div className="oauth-callback-container">
      <div className="oauth-callback-card">
        {status === "loading" && (
          <div className="oauth-loading">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4>Completing sign-in...</h4>
            <p className="text-muted">Please wait while we verify your account</p>
          </div>
        )}

        {status === "success" && (
          <div className="oauth-success">
            <div className="success-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2" />
                <path d="M8 12l2 2 4-4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h4>Sign-in successful!</h4>
            <p className="text-muted">Redirecting to your dashboard...</p>
          </div>
        )}

        {status === "error" && (
          <div className="oauth-error">
            <div className="error-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2" />
                <path d="M15 9l-6 6M9 9l6 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h4>Authentication failed</h4>
            <p className="text-muted">{errorMessage}</p>
            <p className="text-muted small">Redirecting to sign-in page...</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .oauth-callback-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .oauth-callback-card {
          background: white;
          border-radius: 16px;
          padding: 48px;
          text-align: center;
          max-width: 400px;
          width: 100%;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .oauth-loading,
        .oauth-success,
        .oauth-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .oauth-loading h4,
        .oauth-success h4,
        .oauth-error h4 {
          margin: 8px 0 0 0;
          color: #1f2937;
          font-size: 1.25rem;
        }

        .oauth-loading p,
        .oauth-success p,
        .oauth-error p {
          margin: 0;
          font-size: 0.875rem;
        }

        .spinner-border {
          width: 48px;
          height: 48px;
        }

        .success-icon,
        .error-icon {
          animation: scaleIn 0.3s ease-out;
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .small {
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="oauth-callback-container" style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}>
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "48px",
            textAlign: "center",
          }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4 style={{ marginTop: "16px" }}>Loading...</h4>
          </div>
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}
