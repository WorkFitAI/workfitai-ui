"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { selectAuthUser } from "@/redux/features/auth/authSlice";

import "react-circular-progressbar/dist/styles.css";

export default function Sidebar() {
  const [isToggled, setToggled] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const toggleTrueFalse = () => setToggled((prev) => !prev);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const authUser = useAppSelector(selectAuthUser);
  const userRole = authUser?.role;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`nav ${isToggled ? "close-nav" : ""}`}>
      <a
        className={`btn btn-expanded ${isToggled ? "btn-collapsed" : ""}`}
        onClick={toggleTrueFalse}
      />
      <nav className="nav-main-menu">
        <ul className="main-menu">
          {mounted && userRole === "ADMIN" && (
            <>
              <li>
                <Link
                  className={
                    isActive("/admin/user-activity")
                      ? "dashboard2 active"
                      : "dashboard2"
                  }
                  href="/admin/user-activity"
                >
                  <img
                    src="/assets/control/imgs/page/dashboard/profiles.svg"
                    alt="jobBox"
                  />
                  <span className="name">User Activity</span>
                </Link>
              </li>
              <li>
                <Link
                  className={
                    isActive("/admin/users")
                      ? "dashboard2 active"
                      : "dashboard2"
                  }
                  href="/admin/users"
                >
                  <img
                    src="/assets/control/imgs/page/dashboard/candidates.svg"
                    alt="jobBox"
                  />
                  <span className="name">User Management</span>
                </Link>
              </li>
              <li>
                <Link
                  className={
                    isActive("/admin/approvals/hr-managers")
                      ? "dashboard2 active"
                      : "dashboard2"
                  }
                  href="/admin/approvals/hr-managers"
                >
                  <img
                    src="/assets/control/imgs/page/dashboard/tasks.svg"
                    alt="jobBox"
                  />
                  <span className="name">HR Approvals</span>
                </Link>
              </li>
            </>
          )}
          {mounted && userRole === "HR_MANAGER" && (
            <>
              <li>
                <Link
                  className={
                    isActive("/hr-manager/hr-management")
                      ? "dashboard2 active"
                      : "dashboard2"
                  }
                  href="/hr-manager/hr-management"
                >
                  <img
                    src="/assets/control/imgs/page/dashboard/candidates.svg"
                    alt="jobBox"
                  />
                  <span className="name">HR Management</span>
                </Link>
              </li>
              <li>
                <Link
                  className={
                    isActive("/hr-manager/approvals/hr")
                      ? "dashboard2 active"
                      : "dashboard2"
                  }
                  href="/hr-manager/approvals/hr"
                >
                  <img
                    src="/assets/control/imgs/page/dashboard/tasks.svg"
                    alt="jobBox"
                  />
                  <span className="name">HR Staff Approvals</span>
                </Link>
              </li>
            </>
          )}

          <li>
            <Link
              className={
                isActive("/settings") ? "dashboard2 active" : "dashboard2"
              }
              href="/settings"
            >
              <img
                src="/assets/control/imgs/page/dashboard/settings.svg"
                alt="jobBox"
              />
              <span className="name">Settings</span>
            </Link>
          </li>
          <li>
            <Link
              className={
                isActive("/signin") ? "dashboard2 active" : "dashboard2"
              }
              href="/signin"
            >
              <img
                src="/assets/control/imgs/page/dashboard/logout.svg"
                alt="jobBox"
              />
              <span className="name">Logout</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="border-bottom mb-20 mt-20" />
      <div className="sidebar-border-bg mt-50">
        <span className="text-grey">WE ARE</span>
        <span className="text-hiring">HIRING</span>
        <p className="font-xxs color-text-paragraph mt-5">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae
          architecto
        </p>
        <div className="mt-15">
          <Link className="btn btn-paragraph-2" href="#">
            Know More
          </Link>
        </div>
      </div>
    </div>
  );
}
