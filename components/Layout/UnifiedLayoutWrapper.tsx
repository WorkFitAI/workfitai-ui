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

    // Note: CSS is loaded in respective layout files, not dynamically here

    return <>{children}</>;
}
