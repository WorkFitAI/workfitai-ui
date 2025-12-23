"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "@/redux/store";
import {
  AUTH_STORAGE_KEY,
  buildAuthStateFromStoredSession,
  isCompleteStoredSession,
  refreshToken,
  restoreSessionFromStorage,
  selectIsLoggedOut,
  type StoredSession,
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

const loadStoredSession = (): StoredSession | null => {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (isCompleteStoredSession(parsed)) {
      return parsed;
    }

    // Handle old format (expiryInMinutes instead of expiryTime)
    const candidate = parsed as Partial<StoredSession> & { expiryInMinutes?: number };
    if (candidate?.accessToken) {
      // Convert old expiryInMinutes to new expiryTime format
      let expiryTime: number | null = null;
      if (candidate.expiryTime !== undefined) {
        expiryTime = typeof candidate.expiryTime === "number" && Number.isFinite(candidate.expiryTime)
          ? candidate.expiryTime
          : null;
      } else if (candidate.expiryInMinutes !== undefined) {
        // Backward compatibility: convert expiryInMinutes to expiryTime
        // Assume token was just created (not accurate but safe)
        expiryTime = typeof candidate.expiryInMinutes === "number" && candidate.expiryInMinutes > 0
          ? Date.now() + (candidate.expiryInMinutes * 60 * 1000)
          : null;
      }

      return {
        accessToken: candidate.accessToken,
        expiryTime,
        username:
          typeof candidate.username === "string" ? candidate.username : "",
        roles: Array.isArray(candidate.roles)
          ? candidate.roles.filter(
            (role): role is string => typeof role === "string"
          )
          : [],
      };
    }
  } catch {
    // fall through
  }

  return null;
};

const AuthHydrator = () => {
  const dispatch = useAppDispatch();
  const isLoggedOut = useAppSelector(selectIsLoggedOut);

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;

    // Skip refresh if user explicitly logged out
    if (isLoggedOut) {
      console.log("[AuthHydrator] User logged out, skipping refresh");
      return;
    }

    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    let storageValid = false;

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as unknown;

        if (isCompleteStoredSession(parsed)) {
          dispatch(restoreSessionFromStorage(parsed));
          storageValid = true;
        } else {
          // Handle old format or partial session
          const candidate = parsed as Partial<StoredSession> & { expiryInMinutes?: number };
          if (candidate?.accessToken) {
            // Convert old expiryInMinutes to new expiryTime format
            let expiryTime: number | null = null;
            if (candidate.expiryTime !== undefined) {
              expiryTime = typeof candidate.expiryTime === "number" && Number.isFinite(candidate.expiryTime)
                ? candidate.expiryTime
                : null;
            } else if (candidate.expiryInMinutes !== undefined) {
              // Backward compatibility: convert expiryInMinutes to expiryTime
              expiryTime = typeof candidate.expiryInMinutes === "number" && candidate.expiryInMinutes > 0
                ? Date.now() + (candidate.expiryInMinutes * 60 * 1000)
                : null;
            }

            dispatch(
              restoreSessionFromStorage({
                accessToken: candidate.accessToken,
                expiryTime,
                username:
                  typeof candidate.username === "string"
                    ? candidate.username
                    : "",
                roles: Array.isArray(candidate.roles)
                  ? candidate.roles.filter(
                    (role): role is string => typeof role === "string"
                  )
                  : [],
              })
            );
            storageValid = true;
          } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }

    // Refresh only when RT cookie exists but storage is missing or invalid
    // AND user hasn't explicitly logged out
    if (!storageValid && !isLoggedOut) {
      console.log("[AuthHydrator] No valid storage, attempting refresh");
      dispatch(refreshToken());
    }
  }, [dispatch, isLoggedOut]);

  return null;
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<AppStore | undefined>(undefined);

  if (!storeRef.current) {
    const storedSession = loadStoredSession();
    const preloadedState = storedSession
      ? { auth: buildAuthStateFromStoredSession(storedSession) }
      : undefined;
    storeRef.current = makeStore(preloadedState);

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