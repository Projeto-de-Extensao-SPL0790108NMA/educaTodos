"use client";

import "./globals.css";
import * as React from "react";
import {Poppins} from "next/font/google";
import { theme } from "./theme";
import MainLayout from "./components/MainLayout";
import AdminRouteGuard from "./components/AdminRouteGuard";
import { useAuth } from "@/providers/AuthProvider";
import { ThemeProvider } from "@emotion/react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/providers/AuthProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.includes("/login");

  return (
    <html lang="pt-BR" className={poppins.className}>
      <body suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <AdminRouteGuard>
              <AuthBodyWrapper isAuthPage={isAuthPage}>{children}</AuthBodyWrapper>
            </AdminRouteGuard>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

function AuthBodyWrapper({ children, isAuthPage }: { children: React.ReactNode; isAuthPage: boolean }) {
  const { user } = useAuth();
  const isAdmin = user && user.is_staff;
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('admin-bg', !!isAdmin);
    }
  }, [isAdmin]);
  return isAuthPage ? <>{children}</> : <MainLayout isAdmin={isAdmin}>{children}</MainLayout>;
}
