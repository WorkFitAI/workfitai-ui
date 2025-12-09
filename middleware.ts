import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check for access token in cookies (this is where we'd check in production)
  // For now, we'll rely on client-side checks in the pages themselves

  const { pathname } = request.nextUrl;

  // Allow auth pages
  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // For protected routes, we'll handle authorization in the page components
  // using useEffect and Redux state, since middleware runs on edge runtime
  // and can't access localStorage or complex state management

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/candidate/:path*",
    "/hr-dashboard/:path*",
    "/hr-manager-dashboard/:path*",
    "/admin/:path*",
    "/auth/:path*",
  ],
};
