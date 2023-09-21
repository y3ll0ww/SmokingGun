import { createTheme } from '@mui/material/styles';
import "typeface-nunito";
import { PRIMARY_COLOR, SECONDARY_COLOR } from './constants';

// Install: npm install --save typeface-arial
// Uninstall: npm uninstall --save typeface-arial

export const themeDark = createTheme({
  typography: {
    fontFamily: 'Nunito',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: PRIMARY_COLOR,
    },
    secondary: {
      main: SECONDARY_COLOR,
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
      main: PRIMARY_COLOR,
    },
    secondary: {
      main: SECONDARY_COLOR,
    },
  },
});