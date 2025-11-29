"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import "react-circular-progressbar/dist/styles.css";

export default function Sidebar() {
  const [isToggled, setToggled] = useState<boolean>(false);
  const toggleTrueFalse = () => setToggled((prev) => !prev);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  return (
    <div className={`nav ${isToggled ? "close-nav" : ""}`}>
      <a
        className={`btn btn-expanded ${isToggled ? "btn-collapsed" : ""}`}
        onClick={toggleTrueFalse}
      />
      <nav className="nav-main-menu">
        <ul className="main-menu">
          <li>
            <Link
              className={isActive("/admin") ? "dashboard2 active" : "dashboard2"}
              href="/admin"
            >
              <img src="/assets/control/imgs/page/dashboard/dashboard.svg" alt="jobBox" />
              <span className="name">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              className={isActive("/candidates") ? "dashboard2 active" : "dashboard2"}
              href="/candidates"
            >
              <img src="/assets/control/imgs/page/dashboard/candidates.svg" alt="jobBox" />
              <span className="name">Candidates</span>
            </Link>
          </li>
          <li>
            <Link
              className={isActive("/recruiters") ? "dashboard2 active" : "dashboard2"}
              href="/recruiters"
            >
              <img src="/assets/control/imgs/page/dashboard/recruiters.svg" alt="jobBox" />
              <span className="name">Recruiters</span>
            </Link>
          </li>
          <li>
            <Link
              className={isActive("/my-job-grid") ? "dashboard2 active" : "dashboard2"}
              href="/my-job-grid"
            >
              <img src="/assets/control/imgs/page/dashboard/jobs.svg" alt="jobBox" />
              <span className="name">My Jobs</span>
            </Link>
          </li>
          <li>
            <Link
              className={isActive("/my-tasks-list") ? "dashboard2 active" : "dashboard2"}
              href="/my-tasks-list"
            >
              <img src="/assets/control/imgs/page/dashboard/tasks.svg" alt="jobBox" />
              <span className="name">Tasks List</span>
            </Link>
          </li>
          <li>
            <Link
              className={isActive("/profile") ? "dashboard2 active" : "dashboard2"}
              href="/profile"
            >
              <img src="/assets/control/imgs/page/dashboard/profiles.svg" alt="jobBox" />
              <span className="name">My Profiles</span>
            </Link>
          </li>
          <li>
            <Link
              className={isActive("/my-resume") ? "dashboard2 active" : "dashboard2"}
              href="/my-resume"
            >
              <img src="/assets/control/imgs/page/dashboard/cv-manage.svg" alt="jobBox" />
              <span className="name">CV Manage</span>
            </Link>
          </li>
          <li>
            <Link
              className={isActive("/settings") ? "dashboard2 active" : "dashboard2"}
              href="/settings"
            >
              <img src="/assets/control/imgs/page/dashboard/settings.svg" alt="jobBox" />
              <span className="name">Setting</span>
            </Link>
          </li>
          <li>
            <Link
              className={isActive("/authentication") ? "dashboard2 active" : "dashboard2"}
              href="/authentication"
            >
              <img src="/assets/control/imgs/page/dashboard/authentication.svg" alt="jobBox" />
              <span className="name">Authentication</span>
            </Link>
          </li>
          <li>
            <Link className={isActive("/signin") ? "dashboard2 active" : "dashboard2"} href="/signin">
              <img src="/assets/control/imgs/page/dashboard/logout.svg" alt="jobBox" />
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
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto
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
