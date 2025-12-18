"use client";
import { Menu } from "@headlessui/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  logoutUser,
  selectAuthUser
} from "@/redux/features/auth/authSlice";
import useHasHydrated from "@/util/useHasHydrated";
import Avatar from "@/components/common/Avatar";
import React from "react";

type RoleMeta = {
  label: string;
  accent: string;
  shadow: string;
  background: string;
  Icon: (props: { color: string; size?: number }) => React.ReactElement;
};

const ShieldIcon = ({ color, size = 22 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3.25 5 6v6.6c0 3.55 2.74 6.79 7 8.15 4.26-1.36 7-4.6 7-8.15V6l-7-2.75Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m9.25 12.25 2.25 2 3.25-3.5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BriefcaseIcon = ({
  color,
  size = 22,
}: {
  color: string;
  size?: number;
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect
      x="4"
      y="7.5"
      width="16"
      height="11"
      rx="2.5"
      stroke={color}
      strokeWidth="1.6"
    />
    <path
      d="M9 7.25V6c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v1.25"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M4 11.5h16"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M12 12.5v2"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const SparkIcon = ({ color, size = 22 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3v4m0 10v4m7-7h-4M9 12H5m10.5-6.5-2.5 2.5m-4 8-2.5 2.5m9 0-2.5-2.5m-4-8L6.5 5.5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const getRoleMeta = (role?: string): RoleMeta => {
  const normalized = role?.toUpperCase() || "GUEST";

  if (normalized.includes("ADMIN")) {
    return {
      label: "Admin",
      accent: "#D92D20",
      shadow: "rgba(217, 45, 32, 0.25)",
      background: "rgba(217, 45, 32, 0.1)",
      Icon: ShieldIcon,
    };
  }

  if (normalized.includes("HR")) {
    return {
      label: "HR",
      accent: "#0F973D",
      shadow: "rgba(15, 151, 61, 0.22)",
      background: "rgba(15, 151, 61, 0.1)",
      Icon: BriefcaseIcon,
    };
  }

  return {
    label: normalized,
    accent: "#0F3F8A",
    shadow: "rgba(15, 63, 138, 0.2)",
    background: "rgba(15, 63, 138, 0.1)",
    Icon: SparkIcon,
  };
};

export default function Header() {
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const hasHydrated = useHasHydrated();
  const user = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const displayUser = hasHydrated ? user : null;
  const displayName = displayUser?.fullName || displayUser?.username || "Guest";

  const displayRole = displayUser?.role || (displayUser?.roles && displayUser?.roles[0]) || "Guest";
  const roleMeta = useMemo(() => getRoleMeta(displayRole), [displayRole]);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 100);
    handleScroll();
    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const result = await dispatch(logoutUser());
      if (logoutUser.fulfilled.match(result)) {
        setIsMenuOpen(false);
        router.push("/signin");
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className={`header sticky-bar ${isSticky ? "stick" : ""}`}>
      <div className="container">
        <div className="main-header">
          <div className="header-left">
            <div className="header-logo">
              <Link className="d-flex" href="/">
                <span className="d-flex align-items-center">
                  <img
                    alt="WorkfitAI"
                    src="/assets/imgs/template/workfitai.png"
                    style={{ width: 42, height: 42, objectFit: "contain" }}
                  />
                  <span
                    style={{
                      marginLeft: 10,
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#0F1B40",
                      lineHeight: 1.1,
                    }}
                  >
                    WorkfitAI
                  </span>
                </span>
              </Link>
            </div>
            {displayUser ? (
              <span
                aria-label={`Current user role: ${roleMeta.label}`}
                title={roleMeta.label}
                role="status"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 44,
                  height: 44,
                  marginLeft: "14px",
                  borderRadius: "8px",
                  background: roleMeta.background,
                  boxShadow: `0 10px 26px -18px ${roleMeta.shadow}`,
                  backdropFilter: "blur(3px)",
                }}
              >
                <roleMeta.Icon color={roleMeta.accent} size={24} />
              </span>
            ) : null}
          </div>
          <div className="header-search">
            <div className="box-search">
              <form>
                <input
                  className="form-control input-search"
                  type="text"
                  name="keyword"
                  placeholder="Search"
                />
              </form>
            </div>
          </div>
          <div className="header-right">
            <div className="block-signin">
              <Link
                className="btn btn-default icon-edit hover-up"
                href="/hr/post-job"
              >
                Post Job
              </Link>
              <Menu as="div" className="dropdown d-inline-block">
                <Menu.Button as="a" className="btn btn-notify" />
                <Menu.Items
                  as="ul"
                  className="dropdown-menu dropdown-menu-light dropdown-menu-end show"
                  style={{ right: "0", left: "auto" }}
                >
                  <li>
                    <Link className="dropdown-item active" href="#">
                      10 notifications
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      12 messages
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      20 replies
                    </Link>
                  </li>
                </Menu.Items>
              </Menu>

              <div className="member-login">
                {displayUser ? (
                  <>
                    <Avatar
                      src={displayUser?.avatarUrl}
                      alt={displayName}
                      username={displayUser?.username}
                      size={40}
                    />
                    <div className="info-member">
                      <strong className="color-brand-1">{displayName}</strong>
                      <Menu as="div" className="dropdown">
                        <Menu.Button
                          as="a"
                          className="font-xs color-text-paragraph-2 icon-down"
                        >
                          {displayRole}
                        </Menu.Button>
                        <Menu.Items
                          as="ul"
                          className="dropdown-menu dropdown-menu-light dropdown-menu-end show"
                          style={{ right: "0", left: "auto" }}
                        >
                          <li>
                            <Link className="dropdown-item" href="/profile">
                              Profiles
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" href="/my-resume">
                              CV Manager
                            </Link>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={handleLogout}
                              style={{
                                width: "100%",
                                textAlign: "left",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                              }}
                            >
                              Logout
                            </button>
                          </li>
                        </Menu.Items>
                      </Menu>
                    </div>
                  </>
                ) : (
                  <Link
                    className="btn btn-default icon-edit hover-up"
                    href="/signin"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
