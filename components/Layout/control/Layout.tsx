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

  // Handle auth errors: 401 -> signin, 403 -> unauthorized page
  useAuthErrorRedirect();

  const handleToggle = () => setToggled((prev) => !prev);
  const handleClose = () => setToggled(false);

  useEffect(() => {
    let isMounted = true;

    import("wowjs")
      .then((mod) => {
        if (!isMounted) return;
        const WowCtor =
          (
            mod as {
              WOW?: new (options?: Record<string, unknown>) => {
                init: () => void;
              };
            }
          ).WOW ?? mod.default;
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
          {breadcrumbTitle && (
            <Breadcrumb
              breadcrumbTitle={breadcrumbTitle}
              breadcrumbActive={breadcrumbActive}
            />
          )}
          <div className="row">{children}</div>
          <Footer />
        </div>
      </main>
    </>
  );
}
