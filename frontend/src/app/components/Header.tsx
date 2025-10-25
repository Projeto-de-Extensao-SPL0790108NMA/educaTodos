"use client";

import * as React from 'react';
import { AppBar, Toolbar, Box, InputBase, IconButton } from "@mui/material";
import { theme } from '../theme';
import { ThemeProvider } from '@emotion/react';
import { useSidebar } from './SidebarContext';

export default function Header() {
  const { toggleSidebar } = useSidebar();

  return (
    <ThemeProvider theme={theme}>
    <AppBar 
      position="fixed"
      sx={{
        //backgroundColor: 'transparent',
        boxShadow: 'none',
        p: 2,
      }} 
    >
      <Toolbar>
        <IconButton 
          onClick={toggleSidebar}
          sx={{
            '& img': {
              width: 40,
              height: 'auto',
              cursor: 'pointer',
            }
          }}
        >
          <img
            src='/logo.svg'
            alt='Logo'
          />
        </IconButton>

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            backgroundColor: "#383838ff",
            borderRadius: 60,
            px: 2,
            ml: 180,
            width: 10,
          }}
        >
          <img
            src='/search.svg'
            alt='Search'
            style={{
              width: '24px',
              height: 'auto',
              marginRight: '8px'
            }}
          />
          <InputBase
            placeholder="Buscar cursos..."
            sx={{ 
              ml: 1, 
              flex: 1,
              color: '#fff',
            }}
          />
        </Box>

        <IconButton color="inherit" 
          sx={{ 
            ml: 2, 
            alignItems: "center",
          }}>
          <img
            src='/perfil.svg'
            alt='Profile'
              style={{
                width: '44px',
                height: 'auto'
              }}
          />
        </IconButton>
      </Toolbar>
    </AppBar>
    </ThemeProvider>
  );
}
