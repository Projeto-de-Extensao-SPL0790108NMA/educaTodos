"use client";

import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import {
  HouseIcon, 
  HatIcon, 
  GraphIcon, 
  BookIcon, 
  ChevronLeftIcon,
  UserAddIcon
} from '../../../public/icons/IconSB';

import { useSidebar } from './SidebarContext';
import { useAuth } from '../../providers/AuthProvider';
import { useRouter } from 'next/navigation';


// Criar funções que retornam imagens usando o mesmo padrão do `logo.svg` (component='img')
const Icons = {
  HouseIcon: (props = {}) => (
    <Box component="img" src={HouseIcon} alt="house" sx={{ width: 24, height: 'auto' }} {...props} />
  ),
  HatIcon: (props = {}) => (
    <Box component="img" src={HatIcon} alt="hat" sx={{ width: 24, height: 'auto' }} {...props} />
  ),
  GraphIcon: (props = {}) => (
    <Box component="img" src={GraphIcon} alt="graph" sx={{ width: 24, height: 'auto' }} {...props} />
  ),
  BookIcon: (props = {}) => (
    <Box component="img" src={BookIcon} alt="book" sx={{ width: 24, height: 'auto' }} {...props} />
  ),
  ChevronLeftIcon: (props = {}) => (
    <Box component="img" src={ChevronLeftIcon} alt="chevron-left" sx={{ width: 24, height: 'auto' }} {...props} />
  ),
  UserAddIcon: (props = {}) => (
    <Box component="img" src={UserAddIcon} alt="user-add" sx={{ width: 24, height: 'auto' }} {...props} />
  ),
};

const drawerWidth = 280;


export default function Sidebar() {
  const {
    open,
    toggleSidebar,
  } = useSidebar();
  const { user } = useAuth();
  const router = useRouter();

  // Verifica se o usuário é staff (admin)
  const isAdmin = user && user.is_staff;

  // Define menu items with paths for better routing
  const studentMenuItems = [
    { text: "Início", icon: Icons.HouseIcon(), path: "/" },
    { text: "Meus Certificados", icon: Icons.HatIcon(), path: "/certificados" },
    { text: "Meu Desempenho", icon: Icons.GraphIcon(), path: "/desempenho" },
    { text: "Cursando", icon: Icons.BookIcon(), path: "/cursando" },
  ];

  const adminMenuItems = [
    { text: "Visão Geral", icon: Icons.GraphIcon(), path: "/visao-geral" },
    { text: "Gestão de Alunos", icon: Icons.HatIcon(), path: "/gestao-alunos" },
    { text: "Gestão de Cursos", icon: Icons.BookIcon(), path: "/gestao-cursos" }
  ];

  const menuItems = isAdmin ? adminMenuItems : studentMenuItems;

  const handleItemClick = (path: string) => {
    router.push(path);
    toggleSidebar();
  };

  return (
    <Drawer
      variant="temporary"
      open = {open}
      onClose={() => toggleSidebar()}
      sx={{
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth,
          boxSizing: "border-box",
          transition: 'width 0.2s ease',
          overflowX: "hidden",
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          //p: 2,
        },
      }}
    >
      <Box>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 2, 
            borderBottom: '2px solid #1F1D2B',
            justifyContent: open ? 'space-between' : 'center',
          }}
        >
            <Box
              component='img'
              src='/Logo.png'
              alt='Logo'
              sx={{
                width: open ? 40:40,
                height: 'auto',
                transition: 'width 0.3s ease',
                cursor: 'pointer',
              }}
              onClick={toggleSidebar}
            />   
          {open && (
            <Typography variant="h5"
              sx={{ ml: 2 }}>
              {isAdmin ? 'Painel de Controle' : 'Painel do Aluno'}
            </Typography>
          )}
        </Box>
        
        <List>
          {menuItems.map((item, index) => (
            <ListItem 
              key={index}
              onClick={() => handleItemClick(item.path)}
              sx={{
                justifyContent: open ? 'initial' : 'center',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              <ListItemIcon 
                sx={{
                  justifyContent: 'center', minWidth: open ? 40 : 'auto',
                }}
              >
                {item.icon}
            </ListItemIcon>
              {open && <ListItemText primary={item.text} />}
            </ListItem>
          ))}
        </List>
        </Box>

          <Box
            sx={{
              p:1,
              textAlign: 'right',
            }}
          >
            <IconButton onClick={toggleSidebar}>
              {Icons.ChevronLeftIcon()}
            </IconButton>
          </Box> 
    </Drawer>
  );
}
