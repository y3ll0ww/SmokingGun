import { createTheme, ThemeProvider } from '@mui/material/styles';


export const themeDark = createTheme({
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