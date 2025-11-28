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
  type StoredSession,
} from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const loadStoredSession = (): StoredSession | null => {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (isCompleteStoredSession(parsed)) {
      return parsed;
    }

    const candidate = parsed as Partial<StoredSession>;
    if (candidate?.accessToken) {
      return {
        accessToken: candidate.accessToken,
        expiryInMinutes:
          typeof candidate.expiryInMinutes === "number" && Number.isFinite(candidate.expiryInMinutes)
            ? candidate.expiryInMinutes
            : null,
        username: typeof candidate.username === "string" ? candidate.username : "",
        roles: Array.isArray(candidate.roles)
          ? candidate.roles.filter((role): role is string => typeof role === "string")
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

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const hasRefreshTokenCookie = document.cookie
      .split(";")
      .some((cookie) => cookie.trim().toLowerCase().startsWith("rt="));
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    let storageValid = false;

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as unknown;

        if (isCompleteStoredSession(parsed)) {
          dispatch(restoreSessionFromStorage(parsed));
          storageValid = true;
        } else {
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
            storageValid = true;
          } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }

    // Refresh only when RT cookie exists but storage is missing or invalid.
    if (hasRefreshTokenCookie && !storageValid) {
      dispatch(refreshToken());
    }
  }, [dispatch]);

  return null;
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    const storedSession = loadStoredSession();
    const preloadedState = storedSession ? { auth: buildAuthStateFromStoredSession(storedSession) } : undefined;
    storeRef.current = makeStore(preloadedState);
  }

  return (
    <Provider store={storeRef.current}>
      <AuthHydrator />
      {children}
    </Provider>
  );
};

export default Providers;
