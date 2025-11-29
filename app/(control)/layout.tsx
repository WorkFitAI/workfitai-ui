import type { ReactNode } from "react";
import AdminLayout from "@/components/layout/control/Layout";
import "@/public/assets/control/css/style.css";

export default function AdminGroupLayout({ children }: { children: ReactNode }) {
  return (
    <AdminLayout headTitle="Admin Dashboard" breadcrumbTitle="Dashboard" breadcrumbActive="Dashboard">
      {children}
    </AdminLayout>
  );
}
