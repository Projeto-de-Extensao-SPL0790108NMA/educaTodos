"use client";

import { Box, Toolbar } from "@mui/material";
import Sidebar from "../../../public/Sidebar";
import Header from "./Header";
import { SidebarProvider } from "./SidebarContext";

export default function MainLayout({ children }: { children: React.ReactNode }){
  return (
    <SidebarProvider>
      <Box 
      sx={{ 
        display: "flex",
      }}>
      <Sidebar />
      <Box 
        sx={{ 
          flexGrow: 1,
        }}>
      <Header />
        <Toolbar /> {/* Espaço para não cobrir o conteúdo pelo AppBar */}
        <Box component="main" 
          sx={{ 
            p: 3,
          }}>
          {children}
        </Box>
      </Box>
    </Box>
    </SidebarProvider>
  );
}

//mainlayout juntas os arquivos sidebar e header
