"use client";

import type { ReactNode } from "react";
import AdminLayout from "@/components/Layout/control/Layout";
import { ToastProvider } from "@/components/application/common/Toast";
import "@/public/assets/css/style.css";
import "@/public/assets/control/css/style.css";
import "@/public/assets/control/css/application-table.css";
import "@/public/assets/control/css/search-filters.css";

export default function AdminGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ToastProvider>
      <AdminLayout
        headTitle="Admin Dashboard"
        breadcrumbTitle="Dashboard"
        breadcrumbActive="Dashboard"
      >
        {children}
      </AdminLayout>
    </ToastProvider>
  );
}
