"use client";

import "./globals.css";
import {Poppins} from "next/font/google";
import { theme } from "./theme";
import MainLayout from "./components/MainLayout";
import { ThemeProvider } from "@emotion/react";
import { usePathname } from "next/navigation";

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
    const isAuthPage = pathname?.includes("/login") || pathname?.includes("/adicionar");

  return (
    <html lang="pt-BR" className={poppins.className}>
      <body>
          <ThemeProvider theme={theme}>
            {isAuthPage ? children : <MainLayout>{children}</MainLayout>}
          </ThemeProvider>
      </body>
    </html>
  );
}
