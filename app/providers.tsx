"use client";

import React, { useEffect, useLayoutEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import {
  AUTH_STORAGE_KEY,
  isCompleteStoredSession,
  refreshToken,
  restoreSessionFromStorage,
  type StoredSession,
} from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const AuthHydrator = () => {
  const dispatch = useAppDispatch();

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    let shouldRefresh = false;

    if (!raw) {
      shouldRefresh = true;
    } else {
      try {
        const parsed = JSON.parse(raw) as unknown;

        if (isCompleteStoredSession(parsed)) {
          dispatch(restoreSessionFromStorage(parsed));
          return;
        }

        const candidate = parsed as Partial<StoredSession>;
        if (candidate?.accessToken) {
          dispatch(
            restoreSessionFromStorage({
              accessToken: candidate.accessToken,
              expiryInMinutes:
                typeof candidate.expiryInMinutes === "number" && Number.isFinite(candidate.expiryInMinutes)
                  ? candidate.expiryInMinutes
                  : null,
              username: typeof candidate.username === "string" ? candidate.username : "",
              roles: Array.isArray(candidate.roles)
                ? candidate.roles.filter((role): role is string => typeof role === "string")
                : [],
            }),
          );
        }

        shouldRefresh = true;
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } catch {
        shouldRefresh = true;
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }

    if (shouldRefresh) {
      dispatch(refreshToken());
    }
  }, [dispatch]);

  return null;
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <AuthHydrator />
      {children}
    </Provider>
  );
};

export default Providers;
