"use client";

// import Link from "next/link";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  description?: string;
  showSocialLogin?: boolean;
  imageVariant?: "1" | "2" | "3" | "4";
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  description,
  // showSocialLogin = false,
  imageVariant = "4",
}: AuthLayoutProps) {
  // Determine which background images to show based on variant
  // This maintains the existing design patterns while making it reusable
  const renderBackgroundImages = () => {
    switch (imageVariant) {
      case "1":
        return (
          <>
            <div className="img-1 d-none d-lg-block">
              <img
                className="shape-1"
                src="/assets/imgs/page/login-register/img-1.svg"
                alt="workfitAI"
              />
            </div>
            <div className="img-2">
              <img
                src="/assets/imgs/page/login-register/img-2.svg"
                alt="workfitAI"
              />
            </div>
          </>
        );
      case "2":
        return (
          <>
            <div className="img-1 d-none d-lg-block">
              <img
                className="shape-1"
                src="/assets/imgs/page/login-register/img-2.svg"
                alt="workfitAI"
              />
            </div>
            <div className="img-2">
              <img
                src="/assets/imgs/page/login-register/img-1.svg"
                alt="workfitAI"
              />
            </div>
          </>
        );
      // Add other variants as needed matching the existing design
      default:
        return (
          <>
            <div className="img-1 d-none d-lg-block">
              <img
                className="shape-1"
                src="/assets/imgs/page/login-register/img-4.svg"
                alt="workfitAI"
              />
            </div>
            <div className="img-2">
              <img
                src="/assets/imgs/page/login-register/img-3.svg"
                alt="workfitAI"
              />
            </div>
          </>
        );
    }
  };

  return (
    <section className="pt-100 login-register">
      <div className="container">
        <div className="row login-register-cover">
          <div className="col-lg-4 col-md-6 col-sm-12 mx-auto">
            <div className="text-center">
              {subtitle && <p className="font-sm text-brand-2">{subtitle}</p>}
              <h2 className="mt-10 mb-5 text-brand-1">{title}</h2>
              {description && (
                <p className="font-sm text-muted mb-30">{description}</p>
              )}

              {children}
            </div>
          </div>
          {renderBackgroundImages()}
        </div>
      </div>
    </section>
  );
}
