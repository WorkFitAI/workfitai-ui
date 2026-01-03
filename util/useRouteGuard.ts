"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  selectAuthUser,
  selectIsTokenValid,
  selectTokenExpiryTime,
  selectAuthStatus,
  clearExpiredSession,
  AUTH_STORAGE_KEY,
} from "@/redux/features/auth/authSlice";
import { clearAccessTokenSilent } from "@/lib/axios-client";

/**
 * Route configuration for role-based access control
 */
const ROUTE_CONFIG = {
  // Admin-only routes
  admin: {
    paths: ["/admin"],
    allowedRoles: ["ADMIN"] as string[],
  },
  // HR Manager routes
  hrManager: {
    paths: ["/hr-manager", "/hr"],
    allowedRoles: ["HR_MANAGER", "HR", "ADMIN"] as string[],
  },
  // Candidate-only routes (applications, CVs, candidate-specific features)
  candidateOnly: {
    paths: ["/my-applications", "/application", "/my-cvs"],
    allowedRoles: ["CANDIDATE"] as string[],
  },
  // Shared authenticated routes (profile, settings - all roles can access)
  authenticated: {
    paths: ["/profile", "/settings"],
    allowedRoles: ["CANDIDATE", "HR", "HR_MANAGER", "ADMIN"] as string[],
  },
};

interface UseRouteGuardOptions {
  // Redirect path when user doesn't have permission
  unauthorizedPath?: string;
  // Redirect path when user is not authenticated
  unauthenticatedPath?: string;
  // Disable automatic redirects (useful for custom handling)
  disableRedirect?: boolean;
  // Completely disable the guard (for public routes) - hook is still called to maintain hook order
  disabled?: boolean;
}

/**
 * Route guard hook that checks:
 * 1. Token expiry - clears Redux auth if expired
 * 2. User authentication - redirects to signin if not authenticated
 * 3. User authorization - redirects to unauthorized if lacks permission
 *
 * Usage:
 * ```tsx
 * // In layout or page component
 * useRouteGuard();
 * ```
 */
export const useRouteGuard = (options: UseRouteGuardOptions = {}) => {
  const {
    unauthorizedPath = "/unauthorized",
    unauthenticatedPath = "/signin",
    disableRedirect = false,
    disabled = false,
  } = options;

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectAuthUser);
  const isTokenValid = useAppSelector(selectIsTokenValid);
  const expiryTime = useAppSelector(selectTokenExpiryTime);
  const authStatus = useAppSelector(selectAuthStatus);

  // Track if initial hydration is complete
  const [hydrated, setHydrated] = useState(false);

  // Check for hydration: if localStorage has session but Redux is empty, wait briefly
  useEffect(() => {
    if (typeof window === "undefined") {
      setHydrated(true);
      return;
    }

    // If user data is already in Redux, we're hydrated
    if (user) {
      setHydrated(true);
      return;
    }

    // Check if localStorage has session data
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) {
      // No stored session, we're hydrated (empty state is correct)
      setHydrated(true);
      return;
    }

    // localStorage has data but Redux doesn't yet - wait for AuthHydrator
    const timeout = setTimeout(() => {
      setHydrated(true);
    }, 150); // Wait 150ms for sync hydration to complete

    return () => clearTimeout(timeout);
  }, [user]);

  useEffect(() => {
    console.log("[RouteGuard] Running effect:", {
      disabled,
      pathname,
      isPublic: isPublicRoute(pathname),
      user: user?.username,
      userRole: user?.role,
      isTokenValid,
      authStatus,
      expiryTime,
      now: Date.now(),
      hydrated,
    });

    // Skip guard if disabled or for public routes
    if (disabled || isPublicRoute(pathname)) {
      console.log(
        "[RouteGuard] Guard disabled or public route, skipping checks for",
        pathname
      );
      return;
    }

    // Wait for hydration before checking auth
    if (!hydrated) {
      console.log("[RouteGuard] Waiting for hydration...");
      return;
    }

    // CRITICAL: Wait for token refresh to complete before making auth decisions
    // This prevents redirect loops where the guard redirects before refresh completes
    // AuthHydrator dispatches refreshToken() which sets status to "loading"
    if (authStatus === "loading") {
      console.log(
        "[RouteGuard] Auth status loading (refresh in progress), waiting..."
      );
      return;
    }

    // Check if user session exists (from localStorage hydration)
    // For OAuth users who don't have RT cookie, we still have user data from localStorage
    // Allow them to navigate - they'll be redirected when API call fails
    if (!user) {
      console.log("[RouteGuard] No user session, redirecting to signin");
      if (!disableRedirect) {
        router.push(unauthenticatedPath);
      }
      return;
    }

    // Check token expiry - but only if we have a token
    // OAuth users may not have token after page reload (no RT cookie)
    // In that case, we let them stay - API interceptor will redirect on 401
    if (isTokenValid && expiryTime && expiryTime <= Date.now()) {
      console.log("[RouteGuard] Token expired, clearing session");
      // Clear Redux auth state
      dispatch(clearExpiredSession());
      // Clear in-memory token (without setting logged out flag)
      clearAccessTokenSilent();

      if (!disableRedirect) {
        router.push(unauthenticatedPath);
      }
      return;
    }

    // Note: We intentionally don't redirect if !isTokenValid but user exists
    // This allows OAuth users without RT cookie to navigate the UI
    // The API interceptor (axios-client) will redirect on 401 when they try API calls

    // Check role-based access
    const userRole = user.role;
    if (!userRole) {
      console.log("[RouteGuard] User has no role, redirecting to unauthorized");
      if (!disableRedirect) {
        router.push(unauthorizedPath);
      }
      return;
    }

    // Check if user has permission for current route
    const hasPermission = checkRoutePermission(pathname, userRole);
    if (!hasPermission) {
      console.log(
        `[RouteGuard] User (${userRole}) lacks permission for ${pathname}`
      );
      if (!disableRedirect) {
        router.push(unauthorizedPath);
      }
      return;
    }

    console.log(
      `[RouteGuard] Access granted for ${pathname} (role: ${userRole})`
    );
  }, [
    pathname,
    user,
    isTokenValid,
    authStatus,
    expiryTime,
    router,
    dispatch,
    unauthorizedPath,
    unauthenticatedPath,
    disableRedirect,
    disabled,
    hydrated,
  ]);

  return {
    user,
    isTokenValid,
    isAuthenticated: !!user && isTokenValid,
    hasPermission:
      user && isTokenValid
        ? checkRoutePermission(pathname, user.role || "")
        : false,
  };
};

/**
 * Check if route is public (no auth required)
 */
function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    "/signin",
    "/register",
    "/verify-otp",
    "/reset-password",
    "/forgot-password",
    "/unauthorized",
    "/oauth-callback",
    "/jobs-grid",
    "/jobs-list",
    "/job-details",
    "/company",
  ];

  // Exact match for home route
  if (pathname === "/") {
    return true;
  }

  // Prefix match for other public routes
  return publicRoutes.some((route) => pathname.startsWith(route));
}

/**
 * Check if user has permission to access route based on role
 */
function checkRoutePermission(pathname: string, userRole: string): boolean {
  // Check each route configuration
  for (const [key, config] of Object.entries(ROUTE_CONFIG)) {
    // If pathname matches this route category
    if (config.paths.some((path) => pathname.startsWith(path))) {
      // Check if user's role is allowed
      return config.allowedRoles.includes(userRole);
    }
  }

  // If no specific route config found, allow access (default to permissive)
  return true;
}

/**
 * Hook to check if user has specific role
 */
export const useHasRole = (requiredRole: string | string[]): boolean => {
  const user = useAppSelector(selectAuthUser);
  const isTokenValid = useAppSelector(selectIsTokenValid);

  if (!user || !isTokenValid) {
    return false;
  }

  const userRole = user.role || "";
  const requiredRoles = Array.isArray(requiredRole)
    ? requiredRole
    : [requiredRole];

  return requiredRoles.includes(userRole);
};

/**
 * Hook to check if user can access a specific route
 */
export const useCanAccessRoute = (path: string): boolean => {
  const user = useAppSelector(selectAuthUser);
  const isTokenValid = useAppSelector(selectIsTokenValid);

  if (!user || !isTokenValid) {
    return false;
  }

  const userRole = user.role || "";
  return checkRoutePermission(path, userRole);
};

export default useRouteGuard;
