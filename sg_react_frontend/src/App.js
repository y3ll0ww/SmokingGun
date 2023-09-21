import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import { SnackbarProvider } from "notistack";

import AuthContextProvider from "./contexts/AuthContextProvider";
import RequireAuth from "./components/RequireAuth";
import RequireNotAuth from "./components/RequireNotAuth";
import BaseLayout from "./components/layout";
import SideMenu from "./components/layout";

import logo from './logo.svg';
import './App.css';
import DetailView from "./components/layout/DetailView/DetailView";

import { themeDark, themeLight } from "./components/Theme";
import { ThemeProvider } from "@mui/material";
import { Provider, useSelector } from "react-redux";
import store from "./components/layout/Redux/store";
import { DARK } from "./components/constants";

function App() {
  const storeTheme = useSelector((state) => state.theme);
  const [theme, setTheme] = useState(storeTheme === DARK ? themeDark : themeLight);
  
  useEffect(() => {
    setTheme(storeTheme === DARK ? themeDark : themeLight);
  }, [storeTheme]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContextProvider>
        <SnackbarProvider>
          <Router>
            <Box sx={{
              bgcolor: (theme) => theme.palette.background.default,
              minHeight: "100vh"
            }}>
              <Routes>

                <Route element={<BaseLayout />}>
                  <Route path={`/test`} element={<DetailView />} />
                </Route>

                <Route element={<RequireAuth />}>
                  <Route path={`/hiya`} element={<SideMenu />} />
                </Route>

              </Routes>
            </Box>
          </Router>
        </SnackbarProvider>
      </AuthContextProvider>
    </ThemeProvider>
  );
}

export default function StoreProvider() {
  return (
  <Provider store={store}>
    <App />
  </Provider>
  );
}
