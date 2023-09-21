import { createTheme } from '@mui/material/styles';
import "typeface-nunito";

// Install: npm install --save typeface-arial
// Uninstall: npm uninstall --save typeface-arial

export const themeDark = createTheme({
  typography: {
    fontFamily: 'Nunito',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#C02328',
    },
    secondary: {
      main: '#D9D454',
    },
  },
});

export const themeLight = createTheme({
  typography: {
    fontFamily: 'Nunito',
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#C02328',
    },
    secondary: {
      main: '#D9D454',
    },
  },
});