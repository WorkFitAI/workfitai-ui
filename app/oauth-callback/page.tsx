"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";

import { exchangeOAuthSession, clearOAuthState } from "@/lib/oauthApi";
import { showToast } from "@/lib/toast";
import { setAccessToken } from "@/lib/axios-client";
import {
  clearLogoutFlag,
  parseAuthResponse,
  persistSession,
  setOAuthLoginSuccess,
  toStoredSession,
} from "@/redux/features/auth/authSlice";

type CallbackStatus = "loading" | "success" | "error";

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const [status, setStatus] = useState<CallbackStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const processCallback = async (): Promise<void> => {
      try {
        console.log("[OAuth Callback] Processing...");

        // Case 1: Error from OAuth provider
        const error = searchParams.get("error");
        if (error) {
          const errorMsg = decodeURIComponent(error);
          console.error("[OAuth Callback] Provider error:", errorMsg);
          setStatus("error");
          setErrorMessage(errorMsg);
          console.error("[Auth Handler] Auth error:", error);
          showToast.error(error);
          clearOAuthState();
          setTimeout(() => router.push("/signin"), 3000);
          return;
        }

        // Case 2: Account link success
        const linkStatus = searchParams.get("status");
        if (linkStatus === "link_success") {
          console.log("[OAuth Callback] Link success");
          setStatus("success");
          console.log("[Auth Handler] OAuth link success");
          showToast.success("Account linked successfully!");
          clearOAuthState();
          setTimeout(() => router.push("/profile/settings"), 2000);
          return;
        }

        // Case 3: Normal OAuth login - exchange session
        const sessionId = searchParams.get("session");
        if (!sessionId) {
          throw new Error("Invalid OAuth callback - missing session");
        }

        console.log("[OAuth Callback] Exchanging session:", sessionId);

        // Call exchange API
        const data = await exchangeOAuthSession(sessionId);

        console.log("[OAuth Callback] Exchange successful:", data);

        setStatus("success");

        // Clear stored OAuth state
        clearOAuthState();

        // Calculate expiry time (absolute timestamp)
        const expiryTime = data.expiresIn ? Date.now() + data.expiresIn : null;

        // Store token in axios in-memory store (not localStorage)
        setAccessToken(
          data.accessToken,
          data.expiresIn ?? undefined,
          data.username,
          data.roles,
          data.companyId
        );

        // Build AuthSuccess-compatible object for toStoredSession
        const authSuccess = {
          accessToken: data.accessToken,
          expiryTime,
          message: null,
          user: {
            username: data.username,
            roles: data.roles,
            companyId: data.companyId ?? undefined,
          },
        };

        // Store minimal session info (username, roles - no token)
        const storedSession = toStoredSession(authSuccess);
        persistSession(storedSession);

        // 🚨 CRITICAL: Update Redux auth state (source of truth for React components)
        dispatch(
          setOAuthLoginSuccess({
            accessToken: data.accessToken,
            expiryTime,
            username: data.username,
            roles: data.roles,
            companyId: data.companyId ?? undefined,
          })
        );

        clearLogoutFlag();

        showToast.success("Successfully signed in!");

        const roles = data.roles || [];

        // Wait briefly for state to propagate
        setTimeout(() => {
          if (roles.includes("ADMIN")) {
            window.location.href = "/admin/users";
          } else if (roles.includes("HR_MANAGER")) {
            window.location.href = "/hr-manager";
          } else if (roles.includes("HR")) {
            window.location.href = "/hr/applications";
          } else {
            router.push("/");
          }
        }, 100);

        // Process EXACTLY like loginUser.fulfilled
        // handleAuthSuccess(
        //   {
        //     accessToken: data.accessToken,
        //     username: data.username,
        //     roles: data.roles,
        //     companyId: data.companyId ?? undefined,
        //     expiresIn: data.expiresIn,
        //   },
        //   dispatch,
        //   router
        // );
      } catch (error) {
        console.error("[OAuth Callback] Error:", error);
        setStatus("error");
        const message =
          error instanceof Error
            ? error.message
            : "OAuth authentication failed";
        setErrorMessage(message);
        showToast.error(message);
        clearOAuthState();
        setTimeout(() => router.push("/signin"), 3000);
      }
    };

    processCallback();
  }, [searchParams, router, dispatch]);

  return (
    <div className="oauth-callback-container">
      <div className="oauth-callback-card">
        {status === "loading" && (
          <div className="oauth-loading">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4>Completing sign-in...</h4>
            <p className="text-muted">
              Please wait while we verify your account
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="oauth-success">
            <div className="success-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#10B981"
                  strokeWidth="2"
                />
                <path
                  d="M8 12l2 2 4-4"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h4>Sign-in successful!</h4>
            <p className="text-muted">Redirecting to your dashboard...</p>
          </div>
        )}

        {status === "error" && (
          <div className="oauth-error">
            <div className="error-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#EF4444"
                  strokeWidth="2"
                />
                <path
                  d="M15 9l-6 6M9 9l6 6"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
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
          background: #ffffff;
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
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "48px",
              textAlign: "center",
            }}
          >
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
