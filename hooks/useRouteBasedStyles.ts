"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Hook to dynamically load CSS based on route pattern
 * Returns the current route type: 'control' or 'default'
 */
export function useRouteBasedStyles(): 'control' | 'default' {
    const pathname = usePathname();

    // Determine if this is a control panel route
    const isControlRoute = pathname?.startsWith('/admin') ||
        pathname?.startsWith('/hr') ||
        pathname?.startsWith('/hr-manager');

    useEffect(() => {
        // Add a data attribute to body for CSS scoping
        if (typeof document !== 'undefined') {
            if (isControlRoute) {
                document.body.setAttribute('data-layout', 'control');
            } else {
                document.body.setAttribute('data-layout', 'default');
            }
        }

        return () => {
            if (typeof document !== 'undefined') {
                document.body.removeAttribute('data-layout');
            }
        };
    }, [isControlRoute]);

    return isControlRoute ? 'control' : 'default';
}
