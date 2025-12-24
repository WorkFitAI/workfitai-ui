"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import BackToTop from "../elements/BackToTop";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import useRouteGuard from "@/util/useRouteGuard";
import useAuthErrorRedirect from "@/util/useAuthErrorRedirect";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [openClass, setOpenClass] = useState("");
  const pathname = usePathname();

  // Determine if this is a protected route
  const isProtectedRoute = pathname && (
    pathname.startsWith("/candidate") ||
    pathname.startsWith("/my-applications") ||
    pathname.startsWith("/application") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/my-cvs")
  );

  console.log("Layout: isProtectedRoute =", isProtectedRoute, "for pathname =", pathname);

  // Always call hooks unconditionally to maintain consistent hook order
  // Use disabled option to skip guard logic for non-protected routes
  useRouteGuard({ disabled: !isProtectedRoute });

  // Handle auth errors
  useAuthErrorRedirect();

  const handleOpen = () => {
    document.body.classList.add("mobile-menu-active");
    setOpenClass("sidebar-visible");
  };

  const handleRemove = () => {
    if (openClass === "sidebar-visible") {
      setOpenClass("");
      document.body.classList.remove("mobile-menu-active");
    }
  };
  return (
    <>
      <div className="body-overlay-1" onClick={handleRemove} />
      <Header handleOpen={handleOpen} handleRemove={handleRemove} openClass={openClass} />
      <Sidebar openClass={openClass} />
      <main className="main">{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
};

export default Layout;
