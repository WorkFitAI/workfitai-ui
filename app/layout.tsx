import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Providers from "./providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WorkfitAI - Job Portal",
  description: "WorkfitAI - Job Portal",
  icons: {
    icon: "/favicon.ico",
  },
};

// TODO: fix auth hydration issue
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
