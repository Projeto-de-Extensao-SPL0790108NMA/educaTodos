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
  UserAddIcon,
  CoursesIcon
} from '../../../public/icons/IconSB';

import { useSidebar } from './SidebarContext';
import { useAuth } from '../../providers/AuthProvider';
import { useRouter } from 'next/navigation';


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
  CoursesIcon: (props = {}) => (
    <Box component="img" src={CoursesIcon} alt="courses" sx={{ width: 24, height: 'auto' }} {...props} />
  ),
};

const drawerWidth = 280;
const drawerWidthClosed = 120;


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
    { text: "Meus Cursos", icon: Icons.BookIcon(), path: "/cursando" },
    { text: "Cursos", icon: Icons.CoursesIcon(), path: "/cursos" },
  ];

  const adminMenuItems = [
    { text: "Visão Geral", icon: Icons.GraphIcon(), path: "/visao-geral" },
    { text: "Gestão de Alunos", icon: Icons.HatIcon(), path: "/gestao-alunos" },
    { text: "Gestão de Cursos", icon: Icons.BookIcon(), path: "/gestao-cursos" }
  ];

  const menuItems = isAdmin ? adminMenuItems : studentMenuItems;

  const handleItemClick = (path: string) => {
    router.push(path);
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : drawerWidthClosed,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        [`& .MuiDrawer-paper`]: { 
          width: open ? drawerWidth : drawerWidthClosed,
          boxSizing: "border-box",
          transition: 'width 0.3s ease',
          overflowX: "hidden",
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: isAdmin ? '#1F1D2B' : undefined,
          color: isAdmin ? '#FFFFFF' : undefined,
        },
      }}
    >
      <Box sx={{ 
        mt: '80px',
      }}> {/* Offset interno para o conteúdo */}
        <List sx={{ pt: 2 }}>
          {menuItems.map((item, index) => (
            <ListItem 
              key={index}
              onClick={() => handleItemClick(item.path)}
              sx={{
                justifyContent: open ? 'initial' : 'center',
                cursor: 'pointer',
                color: isAdmin ? '#FFFFFF' : undefined,
                px: open ? 2 : 1,
                py: 1.5,
                '&:hover': {
                  backgroundColor: isAdmin ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              <ListItemIcon 
                sx={{
                  justifyContent: 'center', 
                  minWidth: open ? 40 : 'auto',
                  color: isAdmin ? '#FFFFFF' : undefined,
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && (
                <ListItemText 
                  primary={item.text}
                  sx={{
                    opacity: open ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>
        
      </Box>

      <Box
        sx={{
          p: 1,
          textAlign: 'center',
        }}
      >
        <IconButton 
          onClick={toggleSidebar}
          sx={{
            color: isAdmin ? '#FFFFFF' : undefined,
            transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          {Icons.ChevronLeftIcon()}
        </IconButton>
      </Box> 
    </Drawer>
  );
}
