"use client";

import React, { useState } from "react";
import { getOAuthAuthorizationUrl, storeOAuthState, type OAuthProvider } from "@/lib/oauthApi";
import { showToast } from "@/lib/toast";

interface SocialLoginProps {
  provider: "google" | "github";
  onClick?: () => void;
  text?: string;
  disabled?: boolean;
}

export default function SocialLogin({
  provider,
  onClick,
  text,
  disabled = false,
}: SocialLoginProps) {
  const [loading, setLoading] = useState(false);

  const getIcon = (): string => {
    switch (provider) {
      case "google":
        return "/assets/imgs/template/icons/icon-google.svg";
      case "github":
        return "/assets/imgs/template/icons/icon-github.svg";
      default:
        return "/assets/imgs/template/icons/icon-google.svg";
    }
  };

  const getDefaultText = (): string => {
    switch (provider) {
      case "google":
        return "Sign in with Google";
      case "github":
        return "Sign in with GitHub";
      default:
        return "Sign in";
    }
  };

  const handleClick = async (): Promise<void> => {
    if (disabled || loading) return;

    // If custom onClick provided, use it
    if (onClick) {
      onClick();
      return;
    }

    console.log(`[OAuth] Initiating ${provider} OAuth flow...`);
    setLoading(true);

    try {
      // Get authorization URL from backend
      const providerUpper = provider.toUpperCase() as OAuthProvider;
      const response = await getOAuthAuthorizationUrl(providerUpper);

      console.log('[OAuth] Received auth URL, storing state and redirecting...');

      // Store state for CSRF validation
      storeOAuthState(response.state, providerUpper);

      // Redirect to OAuth provider
      // After auth, backend redirects to /oauth-callback?session=xxx
      window.location.href = response.authorizationUrl;

    } catch (error) {
      console.error('[OAuth] Failed to initiate OAuth:', error);
      setLoading(false);

      const message = error instanceof Error ? error.message : 'Failed to initiate sign-in';
      showToast.error(message);
    }
  };

  return (
    <button
      className="btn social-login hover-up mb-20"
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
      ) : (
        <img src={getIcon()} alt={`Sign in with ${provider}`} />
      )}
      <strong>{loading ? "Redirecting..." : (text || getDefaultText())}</strong>
    </button>
  );
}

/**
 * OAuth Buttons Component
 * Renders both Google and GitHub login buttons
 */
interface OAuthButtonsProps {
  mode?: "login" | "register";
  disabled?: boolean;
}

export function OAuthButtons({ mode = "login", disabled = false }: OAuthButtonsProps) {
  const actionText = mode === "register" ? "Sign up with" : "Sign in with";

  return (
    <div className="oauth-buttons">
      <SocialLogin
        provider="google"
        text={`${actionText} Google`}
        disabled={disabled}
      />
      <SocialLogin
        provider="github"
        text={`${actionText} GitHub`}
        disabled={disabled}
      />
    </div>
  );
}
