"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setAccessToken, userClient } from "@/lib/axios-client";
import { setOAuthLoginSuccess } from "@/redux/features/auth/authSlice";
import { showToast } from "@/lib/toast";
import { clearOAuthState } from "@/lib/oauthApi";
import AuthLayout from "@/components/auth/AuthLayout";

type CallbackStatus = "loading" | "success" | "error";

// Timeout for callback processing (15 seconds)
const CALLBACK_TIMEOUT = 15000;

function OAuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    const [status, setStatus] = useState<CallbackStatus>("loading");
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        // Timeout controller
        const timeoutId = setTimeout(() => {
            if (status === "loading") {
                setStatus("error");
                setErrorMessage("OAuth callback timed out. Please try again.");
                setTimeout(() => router.push("/signin"), 2000);
            }
        }, CALLBACK_TIMEOUT);

        const processCallback = async (): Promise<void> => {
            try {
                // Get parameters from URL
                const callbackStatus = searchParams.get("status");
                const token = searchParams.get("token");
                const refreshToken = searchParams.get("refreshToken");
                const error = searchParams.get("error");

                // Handle error status
                if (callbackStatus === "error" || error) {
                    setStatus("error");
                    setErrorMessage(error || "OAuth authentication failed");
                    showToast.error(error || "OAuth authentication failed");
                    clearOAuthState();
                    setTimeout(() => router.push("/signin"), 2000);
                    return;
                }

                // Handle link success (no tokens returned, user already logged in)
                if (callbackStatus === "link_success") {
                    setStatus("success");
                    showToast.success("Account linked successfully!");
                    clearOAuthState();
                    setTimeout(() => router.push("/profile"), 2000);
                    return;
                }

                // Handle login success
                if (callbackStatus === "success" && token) {
                    // Token is now an OPAQUE token (32-char UUID) from API Gateway
                    // NOT a JWT - this is converted by Gateway for security
                    const accessToken = token;
                    const expiryMs = 15 * 60 * 1000; // 15 minutes in milliseconds
                    const expiryTime = Date.now() + expiryMs; // Absolute timestamp for localStorage

                    // Backend doesn't include user info in callback URL
                    // We need to fetch it using the token
                    // First, temporarily set the token so we can make authenticated requests
                    setAccessToken(accessToken, expiryMs, "temp", ["CANDIDATE"]);

                    try {
                        // Fetch user profile to get username, roles, etc
                        const profileResponse = await userClient.get("/profile");
                        const userData = profileResponse.data.data || profileResponse.data;

                        const username = userData.username || userData.name || "user";
                        const email = userData.email || null;
                        const avatarUrl = userData.avatarUrl || null;
                        const roles = userData.roles || ["CANDIDATE"];
                        const companyId = userData.companyId || undefined;

                        // Now set the token with correct user info (expiryMs, not expiryTime!)
                        setAccessToken(
                            accessToken,
                            expiryMs,
                            username,
                            roles,
                            companyId
                        );

                        // Update Redux state FIRST
                        dispatch(setOAuthLoginSuccess({
                            accessToken,
                            expiryTime,
                            username,
                            roles,
                            companyId,
                            email,
                            avatarUrl,
                        }));

                        // CRITICAL: Store all session data in localStorage for persistence across refreshes
                        const sessionData = {
                            username,
                            roles,
                            companyId,
                            expiryTime,
                            email,
                            avatarUrl,
                        };
                        localStorage.setItem("auth_session", JSON.stringify(sessionData));

                        // Store username separately for WebSocket authentication
                        localStorage.setItem("username", username);

                        // Store refresh token (CRITICAL for token renewal)
                        if (refreshToken) {
                            localStorage.setItem("refresh_token", refreshToken);
                        }

                        // Store access token backup (for debugging - remove in production)
                        localStorage.setItem("last_login_time", new Date().toISOString());
                        localStorage.setItem("token_expiry", expiryTime.toString());

                        // Clear any logout flags
                        localStorage.removeItem("auth_logged_out");

                        // Set OAuth login success flag
                        localStorage.setItem("oauth_login_success", "true");

                        console.log("[OAuth] Session stored:", {
                            username,
                            roles,
                            expiryTime: new Date(expiryTime).toISOString(),
                            hasRefreshToken: !!refreshToken,
                        });

                        // Clear OAuth state
                        clearOAuthState();

                        setStatus("success");
                        showToast.success("Successfully signed in!");

                        // Wait briefly for state to propagate, then redirect based on role
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
                    } catch (profileError) {
                        // If profile fetch fails, clear the temp token and show error
                        console.error("Failed to fetch profile:", profileError);
                        throw new Error("Failed to fetch user profile after OAuth login");
                    }
                } else {
                    // Missing required parameters
                    throw new Error("Missing required callback parameters");
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
    }, [searchParams, router, dispatch, status]);

    return (
        <AuthLayout
            title="Processing OAuth Login"
            showSocialLogin={false}
        >
            <div className="login-register text-center mt-20">
                {status === "loading" && (
                    <div className="mb-30">
                        <div className="spinner-border text-brand-1" role="status" style={{ width: "3rem", height: "3rem", borderWidth: "0.3em" }}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h4 className="mt-30 mb-15 font-md text-brand-1">Completing sign-in...</h4>
                        <p className="font-sm text-muted">Please wait while we verify your account</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="mb-30">
                        <div className="icon-success mb-30">
                            <i className="fi-rr-check-circle" style={{ fontSize: "64px", color: "#10B981" }}></i>
                        </div>
                        <h4 className="mb-15 font-md text-brand-1">Sign-in successful!</h4>
                        <p className="font-sm text-muted">Redirecting to your dashboard...</p>
                    </div>
                )}

                {status === "error" && (
                    <div className="mb-30">
                        <div className="icon-error mb-30">
                            <i className="fi-rr-cross-circle" style={{ fontSize: "64px", color: "#EF4444" }}></i>
                        </div>
                        <h4 className="mb-15 font-md text-danger">Authentication failed</h4>
                        <p className="font-sm text-muted mb-15">{errorMessage}</p>
                        <p className="font-xs text-muted">Redirecting to sign-in page...</p>
                    </div>
                )}
            </div>
        </AuthLayout>
    );
}

export default function OAuthCallbackPage() {
    return (
        <Suspense
            fallback={
                <AuthLayout title="Loading..." showSocialLogin={false}>
                    <div className="login-register text-center mt-20">
                        <div className="mb-30">
                            <div className="spinner-border text-brand-1" role="status" style={{ width: "3rem", height: "3rem", borderWidth: "0.3em" }}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <h4 className="mt-30 font-md text-brand-1">Loading...</h4>
                        </div>
                    </div>
                </AuthLayout>
            }
        >
            <OAuthCallbackContent />
        </Suspense>
    );
}
