"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";
import dynamic from "next/dynamic";

// Dynamically import CSS based on route
import "@/styles/globals.css"; // Always load global styles

interface UnifiedLayoutWrapperProps {
    children: ReactNode;
}

/**
 * Unified layout wrapper that conditionally loads layout-specific CSS
 * This prevents layout/CSS mismatches between SSR and CSR
 */
export default function UnifiedLayoutWrapper({ children }: UnifiedLayoutWrapperProps) {
    const pathname = usePathname();

    // Determine layout type based on route pattern
    const isControlRoute = useMemo(() => {
        return pathname?.startsWith('/admin') ||
            pathname?.startsWith('/hr') ||
            pathname?.startsWith('/hr-manager');
    }, [pathname]);

    // Conditionally load CSS - this happens on client side only
    useMemo(() => {
        if (typeof window !== 'undefined') {
            if (isControlRoute) {
                // Load control CSS
                import("@/public/assets/control/css/style.css");
                import("@/public/assets/control/css/application-table.css");
                import("@/public/assets/control/css/search-filters.css");
            } else {
                // Load default CSS
                import("@/public/assets/css/style.css");
            }
        }
    }, [isControlRoute]);

    return <>{children}</>;
}
