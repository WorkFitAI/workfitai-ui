import type { ReactNode } from "react";
import AdminLayout from "@/components/layout/admin/Layout";

export default function AdminGroupLayout({ children }: { children: ReactNode }) {
  return (
    <AdminLayout headTitle="Admin Dashboard" breadcrumbTitle="Dashboard" breadcrumbActive="Dashboard">
      {children}
    </AdminLayout>
  );
}
