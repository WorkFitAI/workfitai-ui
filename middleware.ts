import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for route protection
 * 
 * NOTE: Backend uses OPAQUE tokens (not JWT), so we cannot decode token 
 * to check roles at middleware level. Role-based access control must be 
 * handled either:
 * 1. Client-side: Page components check Redux auth state and redirect
 * 2. Backend API: Endpoints validate token and return 403 if unauthorized
 * 
 * Middleware currently only handles basic routing, not role-based protection.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow auth pages and public routes
  if (pathname.startsWith("/auth") ||
    pathname.startsWith("/signin") ||
    pathname.startsWith("/register")) {
    return NextResponse.next();
  }

  // For opaque tokens, we cannot check roles here
  // Role checking happens client-side via Redux + useEffect in page components

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/candidate/:path*",
    "/hr/applications/:path*",
    "/hr-manager/:path*",
    "/admin/:path*",
    "/auth/:path*",
  ],
};
