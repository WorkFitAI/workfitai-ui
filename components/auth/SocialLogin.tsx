"use client";

import React from "react";

interface SocialLoginProps {
  provider: "google" | "facebook" | "apple";
  onClick?: () => void;
  text?: string;
}

export default function SocialLogin({
  provider,
  onClick,
  text,
}: SocialLoginProps) {
  const getIcon = () => {
    switch (provider) {
      case "google":
        return "/assets/imgs/template/icons/icon-google.svg";
      case "facebook":
        return "/assets/imgs/template/icons/icon-facebook.svg"; // Assuming this exists or will exist
      default:
        return "/assets/imgs/template/icons/icon-google.svg";
    }
  };

  const getDefaultText = () => {
    switch (provider) {
      case "google":
        return "Sign in with Google";
      case "facebook":
        return "Sign in with Facebook";
      case "apple":
        return "Sign in with Apple";
      default:
        return "Sign in";
    }
  };

  return (
    <button
      className="btn social-login hover-up mb-20"
      type="button"
      onClick={onClick}
    >
      <img
        src={getIcon()}
        alt={`Sign in with ${provider}`}
      />
      <strong>{text || getDefaultText()}</strong>
    </button>
  );
}
