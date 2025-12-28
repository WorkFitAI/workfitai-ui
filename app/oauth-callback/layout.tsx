import type { ReactNode } from "react";

/**
 * OAuth Callback Layout
 * Minimal layout without navigation - just shows callback status
 */
export default function OAuthCallbackLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
