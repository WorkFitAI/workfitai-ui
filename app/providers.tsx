"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "@/redux/store";
import {
  refreshToken,
  selectIsLoggedOut,
  hydrateFromLocalStorage,
} from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setStoreForTokenRefresh } from "@/lib/tokenRefreshHandler";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Chart.js global registration
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * AuthHydrator - Handles auth state restoration on app mount
 *
 * NEW FLOW (Sync then Async):
 * 1. SYNC: Restore user/roles from localStorage immediately (for route guards)
 * 2. ASYNC: Attempt token refresh via RT cookie in background
 * - No access token stored in localStorage anymore (XSS protection)
 * - RT cookie (HttpOnly) is sent automatically with refresh request
 * - If refresh succeeds: token stored in memory via axios-client
 * - If refresh fails: user remains logged out
 */
const AuthHydrator = () => {
  const dispatch = useAppDispatch();
  const isLoggedOut = useAppSelector(selectIsLoggedOut);

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;

    // Check logout flag in localStorage
    // This flag persists across page refresh to prevent token refresh attempts
    const logoutFlag = localStorage.getItem("auth_logged_out") === "true";

    if (isLoggedOut || logoutFlag) {
      console.log("[AuthHydrator] User logged out, skipping hydration");
      return;
    }

    // STEP 1: Synchronously restore user/roles from localStorage
    // This makes user data available to route guards immediately
    console.log("[AuthHydrator] Hydrating user/roles from localStorage");
    dispatch(hydrateFromLocalStorage());

    // STEP 2: Async token refresh in background
    // This gets fresh token from RT cookie
    console.log("[AuthHydrator] Attempting token refresh on mount");
    dispatch(refreshToken());
  }, [dispatch, isLoggedOut]);

  return null;
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<AppStore | undefined>(undefined);

  if (!storeRef.current) {
    // Create store with empty auth state
    // Token will be populated by AuthHydrator via refresh (RT cookie)
    storeRef.current = makeStore();

    // Set store instance for token refresh handler
    setStoreForTokenRefresh(storeRef.current);
  }

  return (
    <Provider store={storeRef.current}>
      <AuthHydrator />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {children}
    </Provider>
  );
};

export default Providers;