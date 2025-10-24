import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',  // Tema escuro como base
    // primary: {      main: '#ffffff',  // Branco para sidebar, header e tags    },
    background: {
      default: '#ffffffff',  // Background principal escuro
    },
    text: {
      primary: '#ffffff',  // Texto branco
    },
  },
  typography: {
    fontFamily: 'Poppins',
  },
  div: {
    fontFamily: 'Poppins',
  },
  components: {
    fontFamily: 'Poppins',   
     MuiIconButton: {  // Para accordions e cards
      styleOverrides: {
        root: {
          color: '#000',  // Branco para elementos como sidebar direita
        },
     },
    },
    MuiAppBar: {  // Para header
      styleOverrides: {
        root: {
          backgroundColor: '#ffffffff',
        },
      },
    },
    MuiDrawer: {  // Para sidebar esquerda
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          color: "#000",
        },
      },
    },
  },
});
