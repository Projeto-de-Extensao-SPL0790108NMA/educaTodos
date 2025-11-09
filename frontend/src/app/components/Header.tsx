"use client";

import * as React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  InputBase, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemText, 
  Typography,
} from "@mui/material";
import { theme } from '../theme';
import { ThemeProvider } from '@emotion/react';
import { useSidebar } from './SidebarContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import SearchModal from './SearchModal';

interface HeaderProps {
  isAdmin?: boolean;
}

export default function Header({ isAdmin }: HeaderProps) {
  const { toggleSidebar, open } = useSidebar();
  const { logout } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSearchModal, setShowSearchModal] = React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Redireciona para a home apropriada baseado no tipo de usuário
  const handleLogoClick = () => {
    if (isAdmin) {
      router.push('/visao-geral');
    } else {
      router.push('/');
    }
  };

  // Handler para pressionar Enter na barra de busca do header
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchQuery.trim()) {
      setShowSearchModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowSearchModal(false);
    setSearchQuery('');
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
      className={isAdmin ? 'admin-header' : undefined}
      sx={{
        boxShadow: 'none',
        p: 1,
        zIndex: (theme) => theme.zIndex.drawer + 1, // Fica acima do drawer
        borderBottom: '1px solid #1F1D2B',
      }} 
    >
            <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            onClick={handleLogoClick}
            sx={{
              '& img': {
                width: 60,
                height: 'auto',
                cursor: 'pointer',
              }
            }}
          >
            <img
              src='/Logo.png'
              alt='Logo'
            />
          </IconButton>
          {open && (
            <Typography 
              variant="h6"
              sx={{ 
                ml: 2,
                color: isAdmin ? '#1F1D2B' : '#1F1D2B',
                whiteSpace: 'nowrap',
                fontWeight: 600,
                transition: 'opacity 0.3s ease',
                cursor: 'pointer',
              }}
              onClick={handleLogoClick}
            >
              {isAdmin ? 'Painel de Controle' : 'Painel do Aluno'}
            </Typography>
          )}
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        {!isAdmin && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#383838ff",
              borderRadius: 60,
              px: 2,
              width: 'auto',
              minWidth: '300px',
              mr: 2,
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{ 
                ml: 1, 
                flex: 1,
                color: '#fff',
              }}
            />
          </Box>
        )}
        <IconButton 
          color="inherit" 
          onClick={handleClick}
          aria-controls={menuOpen ? 'profile-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? 'true' : undefined}
          sx={{ 
            ml: 2, 
            alignItems: "center",
          }}
        >
          <img
            src={isAdmin ? '/perfil.svg' : '/perfil.svg'}
            alt='Profile'
            style={{
              width: '44px',
              height: 'auto',
              filter: isAdmin ? 'brightness(0) invert(1)' : 'none'
            }}
          />
        </IconButton>
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          open={menuOpen}
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

          <MenuItem onClick={handleLogout}>

            <ListItemText>Deslogar</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>

    {/* Modal de resultados de busca */}
    <SearchModal 
      open={showSearchModal}
      onClose={handleCloseModal}
      initialQuery={searchQuery}
    />

    </ThemeProvider>
  );
}