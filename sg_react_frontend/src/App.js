import React from "react";
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

export default function App() {
  return (
    <div>
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
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"))
