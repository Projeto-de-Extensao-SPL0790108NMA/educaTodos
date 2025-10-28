"use client";

import "./globals.css";
import {Poppins} from "next/font/google";
import { theme } from "./theme";
import ThemeRegistry from "./ThemeRegistry";
import MainLayout from "./components/MainLayout";
import { ThemeProvider } from "@emotion/react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const metadata = {
  title: "Painel do Aluno",
  description: "Template Base",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) 

{
  return (
    <html lang="pt-BR" className={poppins.className}>
      <body>
          <ThemeProvider theme={theme}>
            <MainLayout>{children}</MainLayout>
          </ThemeProvider>
      </body>
    </html>
  );
}
