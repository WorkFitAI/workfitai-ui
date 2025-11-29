"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  selectAuthErrorType,
  clearAuthError,
  type AuthErrorType,
} from "@/redux/features/auth/authSlice";

interface UseAuthErrorRedirectOptions {
  // Skip redirect for specific error types (e.g., skip 401 redirect on login page)
  skipRedirectFor?: AuthErrorType[];
  // Custom redirect paths
  unauthorizedPath?: string;
  forbiddenPath?: string;
}

/**
 * Hook to handle automatic redirects based on auth error types.
 *
 * - 401 (unauthorized): Session expired/invalid -> redirect to signin
 * - 403 (forbidden): User doesn't have permission -> redirect to unauthorized page
 *
 * Usage:
 * ```tsx
 * useAuthErrorRedirect(); // Use defaults
 * useAuthErrorRedirect({ skipRedirectFor: ["unauthorized"] }); // Skip 401 on login page
 * ```
 */
export const useAuthErrorRedirect = (
  options: UseAuthErrorRedirectOptions = {}
) => {
  const {
    skipRedirectFor = [],
    unauthorizedPath = "/signin",
    forbiddenPath = "/unauthorized",
  } = options;

  const router = useRouter();
  const dispatch = useAppDispatch();
  const errorType = useAppSelector(selectAuthErrorType);

  useEffect(() => {
    if (!errorType || skipRedirectFor.includes(errorType)) {
      return;
    }

    // Clear the error before redirecting to prevent redirect loops
    dispatch(clearAuthError());

    switch (errorType) {
      case "unauthorized":
        // 401: Token expired or invalid - redirect to signin
        router.push(unauthorizedPath);
        break;
      case "forbidden":
        // 403: User doesn't have permission - redirect to unauthorized page
        router.push(forbiddenPath);
        break;
      default:
        // Generic errors don't trigger redirects
        break;
    }
  }, [
    errorType,
    skipRedirectFor,
    unauthorizedPath,
    forbiddenPath,
    router,
    dispatch,
  ]);

  return { errorType };
};

export default useAuthErrorRedirect;
