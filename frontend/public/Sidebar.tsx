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
} from '../public/icons/IconSB';

import { useSidebar } from '../src/app/components/SidebarContext';
import { useAuth } from '../src/providers/AuthProvider';
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

  const menuItems = [
    { text: "Início", icon: Icons.HouseIcon() },
    { text: "Meus Certificados", icon: Icons.HatIcon() },
    { text: "Meu Desempenho", icon: Icons.GraphIcon() },
    { text: "Cursando", icon: Icons.BookIcon() },
  ];

  // Adiciona item de admin apenas se for staff
  if (isAdmin) {
    menuItems.push({ 
      text: "Cadastro de Detentos", 
      icon: Icons.UserAddIcon()
    });
  }

  const handleItemClick = (text: string) => {
    if (text === "Cadastro de Detentos") {
      router.push('/adicionar');
      toggleSidebar();
    }
    // Adicione navegação para outros itens aqui conforme necessário
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
              src='/logo.svg'
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
              sx={{ 
                ml: 2,
              }}>
              Painel do Aluno
            </Typography>
          )}
        </Box>
        
        <List>
          {menuItems.map((item, index) => (
            <ListItem 
              key={index}
              onClick={() => handleItemClick(item.text)}
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
