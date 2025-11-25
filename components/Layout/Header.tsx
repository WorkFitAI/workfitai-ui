/* eslint-disable @next/next/no-html-link-for-pages */
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { logoutUser, selectAuthUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import useHasHydrated from "@/util/useHasHydrated";

interface HeaderProps {
  handleOpen: () => void;
  handleRemove: () => void;
  openClass: string;
}

const Header = ({ handleOpen, handleRemove, openClass }: HeaderProps) => {
  const [scroll, setScroll] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const hasHydrated = useHasHydrated();
  const authUser = useAppSelector(selectAuthUser);
  const displayUser = hasHydrated ? authUser : null;
  const menuRef = useRef<HTMLDivElement | null>(null);

  const displayName = displayUser?.fullName ?? displayUser?.username ?? "User";
  const role = displayUser?.role;
  const avatar = displayUser?.avatarUrl || "/assets/imgs/avatar/ava_1.png";

  useEffect(() => {
    const handleScroll = () => {
      const hasScrolled = window.scrollY > 100;
      setScroll(hasScrolled);
    };

    handleScroll();
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header
        className={scroll ? "header sticky-bar stick" : "header sticky-bar"}
      >
        <div className="container">
          <div className="main-header">
            <div className="header-left">
              <div className="header-logo">
                <Link href="/">
                  <span className="d-flex align-items-center">
                    <img
                      alt="WorkfitAI"
                      src="assets/imgs/template/workfitai.png"
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
            </div>
            <div className="header-nav">
              <nav className="nav-main-menu">
                <ul className="main-menu">
                  <li className="has-children">
                    <Link href="/">
                      <span className="active">Home</span>
                    </Link>

                    <ul className="sub-menu">
                      <li>
                        <Link href="/">
                          <span>Home 1</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/index-2">
                          <span>Home 2</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/index-3">
                          <span>Home 3</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/index-4">
                          <span>Home 4</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/index-5">
                          <span>Home 5</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/index-6">
                          <span>Home 6</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="has-children">
                    <Link href="/jobs-grid">
                      <span>Find a Job</span>
                    </Link>

                    <ul className="sub-menu">
                      <li>
                        <Link href="/jobs-grid">
                          <span>Jobs Grid</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/jobs-list">
                          <span>Jobs List</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/job-details">
                          <span>Jobs Details</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/job-details-2">
                          <span>Jobs Details 2 </span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="has-children">
                    <Link href="/companies-grid">
                      <span>Recruiters</span>
                    </Link>

                    <ul className="sub-menu">
                      <li>
                        <Link href="/companies-grid">
                          <span>Recruiters</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/company-details">
                          <span>Company Details</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="has-children">
                    <Link href="/candidates-grid">
                      <span>Candidates</span>
                    </Link>

                    <ul className="sub-menu">
                      <li>
                        <Link href="/candidates-grid">
                          <span>Candidates Grid</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/candidate-details">
                          <span>Candidate Details</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/candidate-profile">
                          <span>Candidate Profile</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="has-children">
                    <Link href="/blog-grid">
                      <span>Pages</span>
                    </Link>

                    <ul className="sub-menu">
                      <li>
                        <Link href="/page-about">
                          <span>About Us</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/page-pricing">
                          <span>Pricing Plan</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/page-contact">
                          <span>Contact Us</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/register">
                          <span>Register</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/signin">
                          <span>Signin</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/reset-password">
                          <span>Reset Password</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/page-content-protected">
                          <span>Content Protected</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="has-children">
                    <Link href="/blog-grid">
                      <span>Blog</span>
                    </Link>

                    <ul className="sub-menu">
                      <li>
                        <Link href="/blog-grid">
                          <span>Blog Grid</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/blog-grid-2">
                          <span>Blog Grid 2</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/blog-details">
                          <span>Blog Single</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link href="/page-contact">
                      <span>Contact</span>
                    </Link>
                  </li>
                </ul>
              </nav>
              <div
                className={`burger-icon burger-icon-white ${
                  openClass && "burger-close"
                }`}
                onClick={() => {
                  handleOpen();
                  handleRemove();
                }}
              >
                <span className="burger-icon-top" />
                <span className="burger-icon-mid" />
                <span className="burger-icon-bottom" />
              </div>
            </div>
            <div className="header-right">
              {displayUser ? (
                <div className="header-user" ref={menuRef}>
                  <button
                    type="button"
                    className={`header-user__button ${isMenuOpen ? "is-open" : ""}`}
                    onClick={() => setIsMenuOpen((open) => !open)}
                    aria-haspopup="menu"
                    aria-expanded={isMenuOpen}
                  >
                    <span className="header-user__avatar">
                      <img src={avatar} alt={displayName} />
                    </span>
                    <span className="header-user__meta">
                      <span className="header-user__name">{displayName}</span>
                      {role ? <span className="header-user__role">{role}</span> : null}
                    </span>
                    <span className={`fi-rr-angle-small-${isMenuOpen ? "up" : "down"}`} aria-hidden="true" />
                  </button>
                  {isMenuOpen ? (
                    <div className="header-user__dropdown" role="menu">
                      <Link href="/profile" className="header-user__item" onClick={closeMenu}>
                        <span>Hồ sơ</span>
                      </Link>
                      <button
                        type="button"
                        className="header-user__item header-user__item--action"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                      >
                        {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="block-signin">
                  <Link href="register">
                    <span className="text-link-bd-btom hover-up">Register</span>
                  </Link>

                  <Link href="signin">
                    <span className="btn btn-default btn-shadow ml-40 hover-up">
                      Sign in
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <div className="mobile-header-active mobile-header-wrapper-style perfect-scrollbar">
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
                  <ul className="mobile-menu font-heading">
                    <li className="has-children">
                      <Link href="/">
                        <span className="active">Home</span>
                      </Link>

                      <ul className="sub-menu">
                        <li>
                          <Link href="/">
                            <span>Home 1</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-2">
                            <span>Home 2</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-3">
                            <span>Home 3</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-4">
                            <span>Home 4</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-5">
                            <span>Home 5</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-6">
                            <span>Home 6</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <Link href="/jobs-grid">
                        <span>Find a Job</span>
                      </Link>

                      <ul className="sub-menu">
                        <li>
                          <Link href="/jobs-grid">
                            <span>Jobs Grid</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/jobs-list">
                            <span>Jobs List</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/job-details">
                            <span>Jobs Details</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/job-details-2">
                            <span>Jobs Details 2 </span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <Link href="/companies-grid">
                        <span>Recruiters</span>
                      </Link>

                      <ul className="sub-menu">
                        <li>
                          <Link href="/companies-grid">
                            <span>Recruiters</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/company-details">
                            <span>Company Details</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <Link href="/candidates-grid">
                        <span>Candidates</span>
                      </Link>

                      <ul className="sub-menu">
                        <li>
                          <Link href="/candidates-grid">
                            <span>Candidates Grid</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/candidate-details">
                            <span>Candidate Details</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <Link href="/blog-grid">
                        <span>Pages</span>
                      </Link>

                      <ul className="sub-menu">
                        <li>
                          <Link href="/page-about">
                            <span>About Us</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-pricing">
                            <span>Pricing Plan</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-contact">
                            <span>Contact Us</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/register">
                            <span>Register</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/signin">
                            <span>Signin</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/reset-password">
                            <span>Reset Password</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-content-protected">
                            <span>Content Protected</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <Link href="/blog-grid">
                        <span>Blog</span>
                      </Link>

                      <ul className="sub-menu">
                        <li>
                          <Link href="/blog-grid">
                            <span>Blog Grid</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/blog-grid-2">
                            <span>Blog Grid 2</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/blog-details">
                            <span>Blog Single</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link href="/page-contact">
                        <span>Contact</span>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="mobile-account">
                <h6 className="mb-10">Your Account</h6>
                <ul className="mobile-menu font-heading">
                  <li>
                    <Link href="#">
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span>Work Preferences</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span>Account Settings</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span>Go Pro</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/signin">
                      <span>Sign Out</span>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="site-copyright">
                Copyright 2022 © workfitAI. <br />
                Designed by AliThemes.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mobile-header-active mobile-header-wrapper-style perfect-scrollbar">
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
                  <ul className="mobile-menu font-heading">
                    <li className="has-children">
                      <Link href="/">
                        <span className="active">Home</span>
                      </Link>

                      <ul className="sub-menu">
                        <li>
                          <Link href="/">
                            <span>Home 1</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-2">
                            <span>Home 2</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-3">
                            <span>Home 3</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-4">
                            <span>Home 4</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-5">
                            <span>Home 5</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-6">
                            <span>Home 6</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <Link href="/jobs-grid">
                        <span>Find a Job</span>
                      </Link>

                      <ul className="sub-menu">
                        <li>
                          <Link href="/jobs-grid">
                            <span>Jobs Grid</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/jobs-list">
                            <span>Jobs List</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/job-details">
                            <span>Jobs Details</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/job-details-2">
                            <span>Jobs Details 2 </span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <Link href="/companies-grid">
                        <span>Recruiters</span>
                      </Link>

                      <ul className="sub-menu">
                        <li>
                          <Link href="/companies-grid">
                            <span>Recruiters</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/company-details">
                            <span>Company Details</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <Link href="/candidates-grid">
                        <span>Candidates</span>
                      </Link>

                      <ul className="sub-menu">
                        <li>
                          <Link href="/candidates-grid">
                            <span>Candidates Grid</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/candidate-details">
                            <span>Candidate Details</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <Link href="/blog-grid">
                        <span>Pages</span>
                      </Link>

                      <ul className="sub-menu">
                        <li>
                          <Link href="/page-about">
                            <span>About Us</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-pricing">
                            <span>Pricing Plan</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-contact">
                            <span>Contact Us</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/register">
                            <span>Register</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/signin">
                            <span>Signin</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/reset-password">
                            <span>Reset Password</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-content-protected">
                            <span>Content Protected</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <Link href="/blog-grid">
                        <span>Blog</span>
                      </Link>

                      <ul className="sub-menu">
                        <li>
                          <Link href="/blog-grid">
                            <span>Blog Grid</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/blog-grid-2">
                            <span>Blog Grid 2</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/blog-details">
                            <span>Blog Single</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link href="/page-contact">
                        <span>Contact</span>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="mobile-account">
                <h6 className="mb-10">Your Account</h6>
                <ul className="mobile-menu font-heading">
                  <li>
                    <Link href="#">
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span>Work Preferences</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span>Account Settings</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span>Go Pro</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/signin">
                      <span>Sign Out</span>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="site-copyright">
                Copyright 2022 © workfitAI. <br />
                Designed by AliThemes.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
