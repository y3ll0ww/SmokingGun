import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import PropTypes from "prop-types";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { NavLink } from "react-router-dom";
import { Box } from "@mui/system";
import { GlobalStyles, useTheme, Paper, Modal, IconButton } from "@mui/material";
import ProjectDropDown from "./ProjectDropDown";
import Directory from "./Directory";
import ModalAdd from "./ModalAdd";
import { FOLDER, TESTCASE, modalStyle } from "../../constants";
import store from "../Redux/store";

const SidebarGlobalStyles = () => {
  const theme = useTheme();
  return (
    <GlobalStyles
      styles={{
        ".sidebar-nav-item": {
          color: "unset",
          textDecoration: "none",
        },
        ".sidebar-nav-item-active": {
          textDecoration: "none",
          color: theme.palette.primary.main,
          "& .MuiSvgIcon-root": {
            color: theme.palette.primary.main,
          },
          "& .MuiTypography-root": {
            fontWeight: 500,
            color: theme.palette.primary.main,
          },
        },
      }}
    />
  );
};

const SidebarGlobalStylesMemo = React.memo(SidebarGlobalStyles);

export function SideMenu(props) {
  const { mobileOpen, setMobileOpen } = props;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [modalAdd, setModalAdd] = useState(false);
  const [type, setType] = useState(undefined);

  const handleOpenModal = (newType) => {
    setType(newType);
    setModalAdd(true);
  };

  const handleCloseModal = () => {
    setType(undefined);
    setModalAdd(false);
  };

  const addModal = (
    <Modal open={modalAdd} onClose={handleCloseModal}>
      <Paper
        sx={modalStyle}
        disableEqualOverflow
        style={{ borderRadius: 10, overflowY: "auto", maxHeight: "500px" }}
      >
        <style>{`::-webkit-scrollbar {
          display: none;
        }`}</style>
        <ModalAdd handleCloseModal={handleCloseModal} type={type} projectId={store.getState().projects.currentProject.id} />
      </Paper>
    </Modal>
  );

  const drawer = (
    <Box>
      <Toolbar />
      <Divider />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 1,
          marginTop: 1
        }}
      >
        <Provider store={store}>
          <ProjectDropDown />
        </Provider>
        <NavLink
          className={(props) => {
            return `${
              props.isActive ? "sidebar-nav-item-active" : "sidebar-nav-item"
            }`;
          }}
        >
          <List
            sx={{ display: "flex", flexDirection: "row", alignItems: "flex-end" }}
            style={{ paddingRight: 8 }}
          >
            <ListItem onClick={() => handleOpenModal(FOLDER)} style={{ padding: 1 }}>
              <IconButton><CreateNewFolderIcon /></IconButton>
            </ListItem>
            <ListItem onClick={() => handleOpenModal(TESTCASE)} style={{ padding: 1 }}>
            <IconButton><PlaylistAddIcon /></IconButton>
            </ListItem>
            <ListItem style={{ padding: 1 }}>
                <IconButton><UnfoldMoreIcon /></IconButton>
            </ListItem>
          </List>
        </NavLink>
      </Box>
      <Divider />
      <List>
        <Directory />
      </List>
    </Box>
  );

  // Scale the width of the menu
  const [currentDrawerWidth, setCurrentDrawerWidth] = useState(35);

  const handleMouseDown = (event) => {
    
    const startX = event.clientX;
    const startWidth = currentDrawerWidth;

    const handleMouseMove = (event) => {
      const widthChange = ((event.clientX - startX) / window.innerWidth) * 100;
      const newWidth = startWidth + widthChange;

      // Limit the width within a certain range if needed
      const minWidth = 20; // Minimum width in percentage
      const maxWidth = 45; // Maximum width in percentage
      const clampedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);

      setCurrentDrawerWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <Box
      component="nav"
      sx={{ width: { md: `${currentDrawerWidth}%` }, flexShrink: { sm: 0 } }}
    >
      {addModal}
      <SidebarGlobalStylesMemo />

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: `${currentDrawerWidth}%`,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: `${currentDrawerWidth}%`,
          },
        }}
        open
      >
        <div
          style={{ width: "100%", height: "100%" }}
          onMouseDown={handleMouseDown}
        >
          {drawer}
        </div>
      </Drawer>
    </Box>
  );
}

SideMenu.propTypes = {
  mobileOpen: PropTypes.bool,
  setMobileOpen: PropTypes.func.isRequired,
};

export default SideMenu;