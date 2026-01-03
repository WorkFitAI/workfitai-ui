"use client";

import { ReactNode, useEffect, useState } from "react";

import Breadcrumb from "./Breadcrumb";
import BurgerIcon from "./BurgerIcon";
import Footer from "./Footer";
import Header from "./Header";
import MobileMenu from "./MobileMenu";
import PageHead from "./PageHead";
import Sidebar from "./Sidebar";
import useAuthErrorRedirect from "@/util/useAuthErrorRedirect";
import useRouteGuard from "@/util/useRouteGuard";

type LayoutProps = {
  headTitle?: string;
  breadcrumbTitle?: string;
  breadcrumbActive?: string;
  children: ReactNode;
};

export default function Layout({
  headTitle,
  breadcrumbTitle,
  breadcrumbActive,
  children,
}: LayoutProps) {
  const [isToggled, setToggled] = useState<boolean>(false);

  // Check token expiry and role-based access BEFORE rendering
  useRouteGuard();

  // Handle auth errors: 401 -> signin, 403 -> unauthorized page
  useAuthErrorRedirect();

  const handleToggle = () => setToggled((prev) => !prev);
  const handleClose = () => setToggled(false);

  useEffect(() => {
    let isMounted = true;

    import("wowjs")
      .then((mod) => {
        if (!isMounted) return;
        type WowConstructor = new (options?: Record<string, unknown>) => {
          init: () => void;
        };
        const WowCtor =
          (mod as unknown as {
            WOW?: WowConstructor;
            default?: WowConstructor;
          }).WOW ?? (mod as unknown as { default?: WowConstructor }).default;
        if (!WowCtor) return;
        const wow = new WowCtor({ live: false });
        wow.init();
      })
      .catch(() => {
        /* ignore WOW load failures in the client */
      });

    return () => {
      isMounted = false;
      document.body.classList.remove("mobile-menu-active");
    };
  }, []);

  useEffect(() => {
    if (isToggled) {
      document.body.classList.add("mobile-menu-active");
    } else {
      document.body.classList.remove("mobile-menu-active");
    }
  }, [isToggled]);

  return (
    <>
      <PageHead headTitle={headTitle} />
      <div className="body-overlay-1" onClick={handleClose} />
      <Header />
      <BurgerIcon handleToggle={handleToggle} isToggled={isToggled} />
      <MobileMenu isToggled={isToggled} />
      <main className="main">
        <Sidebar />
        <div className="box-content">
          {children}
          <Footer />
        </div>
      </main>
    </>
  );
}
