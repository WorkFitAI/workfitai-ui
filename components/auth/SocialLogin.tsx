"use client";

import React, { useState } from "react";
import { initiateOAuth, type OAuthProvider } from "@/lib/oauthApi";
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
    if (disabled || loading) {
      console.log("[OAuth Button] Click ignored - disabled or loading");
      return;
    }

    // If custom onClick is provided, use it
    if (onClick) {
      onClick();
      return;
    }

    // Default OAuth flow with retry
    console.log(`[OAuth Button] Initiating ${provider} OAuth flow...`);
    setLoading(true);

    try {
      const oauthProvider: OAuthProvider = provider.toUpperCase() as OAuthProvider;

      // Small delay to ensure component state is updated
      await new Promise(resolve => setTimeout(resolve, 50));

      console.log(`[OAuth Button] Calling initiateOAuth for ${oauthProvider}...`);
      await initiateOAuth(oauthProvider);
      // Note: initiateOAuth will redirect, so we won't reach here normally
      console.log("[OAuth Button] OAuth initiated successfully (should redirect)");
    } catch (error) {
      console.error(`[OAuth Button] OAuth initiation failed:`, error);
      setLoading(false);

      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      const isNetworkError = errorMessage.includes("network") || errorMessage.includes("Network");

      let displayMessage = errorMessage;
      if (isNetworkError) {
        displayMessage = "Network error. Please check your connection and try again.";
      } else if (errorMessage.includes("Failed to initiate")) {
        displayMessage = `Unable to connect to ${provider} OAuth. Please try again.`;
      }

      showToast.error(displayMessage);
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
        <img
          src={getIcon()}
          alt={`Sign in with ${provider}`}
        />
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
