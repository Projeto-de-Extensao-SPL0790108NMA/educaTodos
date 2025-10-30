"use client";

import * as React from 'react';
import { AppBar, Toolbar, Box, InputBase, IconButton, Menu, MenuItem, ListItemText } from "@mui/material";
import { theme } from '../theme';
import { ThemeProvider } from '@emotion/react';
import { useSidebar } from './SidebarContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

export default function Header() {
  const { toggleSidebar } = useSidebar();
  const { logout } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    router.push('/perfil');
    handleClose();
  };

  // Logout completo: limpa tokens, cookies e força reload para limpar cache
  const handleLogout = () => {
    handleClose();
    
    // 1. Limpa access, refresh do localStorage e cookies
    logout();
    
    // 2. Aguarda 300ms e força reload (simula Ctrl+F5)
    // Isso garante limpeza de cache e redirecionamento automático para /auth/login
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

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

        <IconButton 
          color="inherit" 
          onClick={handleClick}
          aria-controls={open ? 'profile-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          sx={{ 
            ml: 2, 
            alignItems: "center",
          }}
        >
          <img
            src='/perfil.svg'
            alt='Profile'
            style={{
              width: '44px',
              height: 'auto'
            }}
          />
        </IconButton>
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiMenuItem-root': {
                minWidth: 150,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleProfile}>
            <ListItemText>Perfil</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleLogout}>

            <ListItemText>Deslogar</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
    </ThemeProvider>
  );
}