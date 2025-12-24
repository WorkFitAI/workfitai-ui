import type { ReactNode } from "react";
import Layout from "@/components/layout/Layout";
import "@/public/assets/css/style.css";
import "@/styles/globals.css";

export default function CandidateGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
