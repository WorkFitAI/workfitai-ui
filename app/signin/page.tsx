"use client";

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import Layout from "@/components/Layout/Layout";
import {
  clearAuthError,
  loginUser,
  selectAuthError,
  selectAuthMessage,
  selectAuthStatus,
} from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function Signin() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const message = useAppSelector(selectAuthMessage);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

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
    const result = await dispatch(loginUser({ usernameOrEmail, password }));

    if (loginUser.fulfilled.match(result)) {
      router.replace("/");
    }
  };

  return (
    <>
      <Layout>
        <section className="pt-100 login-register">
          <div className="container">
            <div className="row login-register-cover">
              <div className="col-lg-4 col-md-6 col-sm-12 mx-auto">
                <div className="text-center">
                  <p className="font-sm text-brand-2">Welcome back! </p>
                  <h2 className="mt-10 mb-5 text-brand-1">Member Login</h2>
                  <p className="font-sm text-muted mb-30">
                    Access to all features. No credit card required.
                  </p>
                  <button className="btn social-login hover-up mb-20" type="button">
                    <img src="assets/imgs/template/icons/icon-google.svg" alt="workfitAI" />
                    <strong>Sign in with Google</strong>
                  </button>
                  <div className="divider-text-center">
                    <span>Or continue with</span>
                  </div>
                </div>
                <form className="login-register text-start mt-20" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="usernameOrEmail">
                      Username or Email address *
                    </label>
                    <input
                      className="form-control"
                      id="usernameOrEmail"
                      type="text"
                      required
                      name="usernameOrEmail"
                      placeholder="stevenjob"
                      value={usernameOrEmail}
                      onChange={(event) => setUsernameOrEmail(event.target.value)}
                      autoComplete="username"
                    />
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
                      autoComplete="current-password"
                    />
                  </div>
                  <div className="login_footer form-group d-flex justify-content-between">
                    <span />
                    <Link href="/reset-password">
                      <span className="text-muted">Forgot Password</span>
                    </Link>
                  </div>
                  {error ? <p className="text-danger mb-10">{error}</p> : null}
                  {message ? <p className="text-success mb-10">{message}</p> : null}
                  <div className="form-group">
                    <button
                      className="btn btn-brand-1 hover-up w-100"
                      type="submit"
                      name="login"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Login"}
                    </button>
                  </div>
                  <div className="text-muted text-center">
                    Don&apos;t have an Account?
                    <Link href="/register">
                      <span>Sign up</span>
                    </Link>
                  </div>
                </form>
              </div>
              <div className="img-1 d-none d-lg-block">
                <img className="shape-1" src="assets/imgs/page/login-register/img-4.svg" alt="workfitAI" />
              </div>
              <div className="img-2">
                <img src="assets/imgs/page/login-register/img-3.svg" alt="workfitAI" />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
