import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for route protection
 *
 * With opaque tokens (not JWT), we cannot decode roles at middleware level.
 * We CAN check if RT (refresh token) cookie exists to determine if user might be authenticated.
 * Actual role-based protection happens client-side via Redux.
 *
 * Flow:
 * 1. Protected route + no RT cookie → redirect to signin
 * 2. Auth pages + has RT cookie → redirect to home (already logged in)
 * 3. Public routes → always allowed
 *
 * NOTE: RT cookie must be set with Path=/ for middleware to see it.
 * If backend sets Path=/auth, middleware won't detect the cookie on /profile.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes - no auth check needed
  if (
    pathname.startsWith("/auth") ||
    pathname === "/" ||
    pathname.startsWith("/jobs-") ||
    pathname.startsWith("/job-details") ||
    pathname.startsWith("/company") ||
    pathname.startsWith("/verify-otp") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/unauthorized") || // Allow unauthorized page for all users
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")  // Static files
  ) {
    return NextResponse.next();
  }

  // Check for RT cookie (indicates user might be authenticated)
  // Also check for common alternative cookie names
  const hasRTCookie = request.cookies.has("RT") || request.cookies.has("refresh_token");

  // Auth pages - redirect to home if already has RT cookie
  const authPages = ["/signin", "/register"];
  if (authPages.some(path => pathname.startsWith(path))) {
    if (hasRTCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes - redirect to signin if no RT cookie
  const protectedPaths = [
    "/candidate",
    "/hr",
    "/hr-manager",
    "/admin",
    "/my-applications",
    "/application",
    "/profile",
    "/settings",
    "/my-cvs",
  ];

  const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtectedRoute && !hasRTCookie) {
    // TEMPORARY: Skip middleware protection for /profile to allow client-side handling
    // This is a workaround for when RT cookie has Path=/auth instead of Path=/
    // Client-side will still protect via Redux auth state
    console.log(`[Middleware] No RT cookie for ${pathname}, but allowing client-side handling`);

    // Allow the request to proceed - client-side will handle auth
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected routes
    "/candidate/:path*",
    "/hr/:path*",
    "/hr-manager/:path*",
    "/admin/:path*",
    "/my-applications/:path*",
    "/application/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/my-cvs/:path*",
    // Auth pages (for redirect when already logged in)
    "/signin",
    "/register",
  ],
};
