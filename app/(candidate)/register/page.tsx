"use client";

import {
  clearAuthError,
  registerUser,
  selectAuthError,
  selectAuthMessage,
  selectAuthStatus,
} from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function Register() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const message = useAppSelector(selectAuthMessage);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const isLoading = status === "loading";

  useEffect(() => {
    if (accessToken) {
      router.replace("/");
    }
  }, [accessToken, router]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearAuthError()), 3500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [error, dispatch]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    setLocalError(null);

    const result = await dispatch(
      registerUser({ fullName, email, username, password, phoneNumber })
    );

    if (registerUser.fulfilled.match(result)) {
      router.replace("/");
    }
  };

  return (
    <>
        <section className="pt-100 login-register">
          <div className="container">
            <div className="row login-register-cover">
              <div className="col-lg-4 col-md-6 col-sm-12 mx-auto">
                <div className="text-center">
                  <p className="font-sm text-brand-2">Register </p>
                  <h2 className="mt-10 mb-5 text-brand-1">
                    Start for free Today
                  </h2>
                  <p className="font-sm text-muted mb-30">
                    Access to all features. No credit card required.
                  </p>
                  <button
                    className="btn social-login hover-up mb-20"
                    type="button"
                  >
                    <img
                      src="assets/imgs/template/icons/icon-google.svg"
                      alt="workfitAI"
                    />
                    <strong>Sign up with Google</strong>
                  </button>
                  <div className="divider-text-center">
                    <span>Or continue with</span>
                  </div>
                </div>
                <form
                  className="login-register text-start mt-20"
                  onSubmit={handleSubmit}
                >
                  <div className="form-group">
                    <label className="form-label" htmlFor="fullName">
                      Full Name *
                    </label>
                    <input
                      className="form-control"
                      id="fullName"
                      type="text"
                      required
                      name="fullName"
                      placeholder="Steven Job"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      Email *
                    </label>
                    <input
                      className="form-control"
                      id="email"
                      type="email"
                      required
                      name="email"
                      placeholder="stevenjob@gmail.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="username">
                      Username *
                    </label>
                    <input
                      className="form-control"
                      id="username"
                      type="text"
                      required
                      name="username"
                      placeholder="stevenjob"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      autoComplete="username"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="phoneNumber">
                      Phone Number *
                    </label>
                    <input
                      className="form-control"
                      id="phoneNumber"
                      type="tel"
                      required
                      name="phoneNumber"
                      placeholder="+841234567890"
                      value={phoneNumber}
                      onChange={(event) => setPhoneNumber(event.target.value)}
                    />
                    <small className="text-muted">
                      Format: 10 digits or +84 followed by 10 digits.
                    </small>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="password">
                      Password *
                    </label>
                    <input
                      className="form-control"
                      id="password"
                      type="password"
                      required
                      name="password"
                      placeholder="************"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="confirmPassword">
                      Confirm Password *
                    </label>
                    <input
                      className="form-control"
                      id="confirmPassword"
                      type="password"
                      required
                      name="confirmPassword"
                      placeholder="************"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      autoComplete="new-password"
                    />
                  </div>
                  {localError ? (
                    <p className="text-danger mb-10">{localError}</p>
                  ) : null}
                  {error ? <p className="text-danger mb-10">{error}</p> : null}
                  {message ? (
                    <p className="text-success mb-10">{message}</p>
                  ) : null}
                  <div className="form-group">
                    <button
                      className="btn btn-brand-1 hover-up w-100"
                      type="submit"
                      name="login"
                      disabled={isLoading}
                    >
                      {isLoading ? "Submitting..." : "Submit & Register"}
                    </button>
                  </div>
                  <div className="text-muted text-center">
                    Already have an account?
                    <Link href="/signin">
                      <span>Sign in</span>
                    </Link>
                  </div>
                </form>
              </div>
              <div className="img-1 d-none d-lg-block">
                <img
                  className="shape-1"
                  src="assets/imgs/page/login-register/img-1.svg"
                  alt="workfitAI"
                />
              </div>
              <div className="img-2">
                <img
                  src="assets/imgs/page/login-register/img-2.svg"
                  alt="workfitAI"
                />
              </div>
            </div>
          </div>
        </section>
    </>
  );
}
