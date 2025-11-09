"use client";

import { Box, Toolbar } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { SidebarProvider, useSidebar } from "./SidebarContext";

interface MainLayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

function MainLayoutContent({ children, isAdmin }: MainLayoutProps) {
  const { open } = useSidebar();
  const drawerWidth = 280;
  const drawerWidthClosed = 94;

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box 
        sx={{ 
          flexGrow: 1,
          marginLeft: open ? `${drawerWidth}px` : `${drawerWidthClosed}px`,
          transition: 'margin 0.3s ease',
        }}
      >
        <Header isAdmin={isAdmin} />
        <Toolbar /> {/* Offset for AppBar */}
        <Box component="main" sx={{ pt: 3, px: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default function MainLayout({ children, isAdmin }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <MainLayoutContent isAdmin={isAdmin}>
        {children}
      </MainLayoutContent>
    </SidebarProvider>
  );
}

//mainlayout juntas os arquivos sidebar e header
