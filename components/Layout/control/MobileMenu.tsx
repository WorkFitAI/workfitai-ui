"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type MobileMenuProps = {
  isToggled: boolean;
};

export default function MobileMenu({ isToggled }: MobileMenuProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <div
      className={`mobile-header-active mobile-header-wrapper-style perfect-scrollbar ${isToggled ? "sidebar-visible" : ""
        }`}
    >
      <div className="mobile-header-wrapper-inner">
        <div className="mobile-header-content-area">
          <div className="perfect-scroll">
            <div className="mobile-search mobile-header-border mb-30">
              <form action="#">
                <input type="text" placeholder="Search…" />
                <i className="fi-rr-search" />
              </form>
            </div>
            <div className="mobile-menu-wrap mobile-header-border">
              {/* mobile menu start*/}
              <nav>
                <ul className="main-menu">
                  <li>
                    <Link className={isActive("/admin") ? "dashboard2 active" : "dashboard2"} href="/admin">
                      <img src="/assets/imgs/page/dashboard/dashboard.svg" alt="jobBox" />
                      <span className="name">Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link className={isActive("/candidates") ? "dashboard2 active" : "dashboard2"} href="/candidates">
                      <img src="/assets/imgs/page/dashboard/candidates.svg" alt="jobBox" />
                      <span className="name">Candidates</span>
                    </Link>
                  </li>
                  <li>
                    <Link className={isActive("/recruiters") ? "dashboard2 active" : "dashboard2"} href="/recruiters">
                      <img src="/assets/imgs/page/dashboard/recruiters.svg" alt="jobBox" />
                      <span className="name">Recruiters</span>
                    </Link>
                  </li>
                  <li>
                    <Link className={isActive("/my-job-grid") ? "dashboard2 active" : "dashboard2"} href="/my-job-grid">
                      <img src="/assets/imgs/page/dashboard/jobs.svg" alt="jobBox" />
                      <span className="name">My Jobs</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={isActive("/my-tasks-list") ? "dashboard2 active" : "dashboard2"}
                      href="/my-tasks-list"
                    >
                      <img src="/assets/imgs/page/dashboard/tasks.svg" alt="jobBox" />
                      <span className="name">Tasks List</span>
                    </Link>
                  </li>
                  <li>
                    <Link className={isActive("/profile") ? "dashboard2 active" : "dashboard2"} href="/profile">
                      <img src="/assets/imgs/page/dashboard/profiles.svg" alt="jobBox" />
                      <span className="name">My Profiles</span>
                    </Link>
                  </li>
                  <li>
                    <Link className={isActive("/my-resume") ? "dashboard2 active" : "dashboard2"} href="/my-resume">
                      <img src="/assets/imgs/page/dashboard/cv-manage.svg" alt="jobBox" />
                      <span className="name">CV Manage</span>
                    </Link>
                  </li>
                  <li>
                    <Link className={isActive("/settings") ? "dashboard2 active" : "dashboard2"} href="/settings">
                      <img src="/assets/imgs/page/dashboard/settings.svg" alt="jobBox" />
                      <span className="name">Setting</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={isActive("/authentication") ? "dashboard2 active" : "dashboard2"}
                      href="/authentication"
                    >
                      <img src="/assets/imgs/page/dashboard/authentication.svg" alt="jobBox" />
                      <span className="name">Authentication</span>
                    </Link>
                  </li>
                  <li>
                    <Link className={isActive("/signin") ? "dashboard2 active" : "dashboard2"} href="/signin">
                      <img src="/assets/imgs/page/dashboard/logout.svg" alt="jobBox" />
                      <span className="name">Logout</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="mobile-account">
              <h6 className="mb-10">Your Account</h6>
              <ul className="mobile-menu font-heading">
                <li>
                  <Link className="active" href="/profile">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link href="/authentication">Work Preferences</Link>
                </li>
                <li>
                  <Link href="/settings">Account Settings</Link>
                </li>
                <li>
                  <Link href="/signin">Help</Link>
                </li>
                <li>
                  <Link href="/signin">Sign Out</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
