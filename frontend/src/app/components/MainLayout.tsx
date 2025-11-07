"use client";

import { Box, Toolbar } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { SidebarProvider } from "./SidebarContext";

interface MainLayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

export default function MainLayout({ children, isAdmin }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1 }}>
          <Header isAdmin={isAdmin} />
          <Toolbar /> {/* Offset for AppBar */}
          <Box component="main" sx={{ pt: 3, px: 3 }}>
            {children}
          </Box>
        </Box>
      </Box>
    </SidebarProvider>
  );
}

//mainlayout juntas os arquivos sidebar e header
