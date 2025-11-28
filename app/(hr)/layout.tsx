import type { ReactNode } from "react";
import AdminLayout from "@/components/layout/admin/Layout";

export default function HrGroupLayout({ children }: { children: ReactNode }) {
  return (
    <AdminLayout headTitle="HR Dashboard" breadcrumbTitle="HR" breadcrumbActive="Dashboard">
      {children}
    </AdminLayout>
  );
}
