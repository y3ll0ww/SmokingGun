import React, { useState } from "react";
import PropTypes from "prop-types";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { NavLink } from "react-router-dom";
import { Box } from "@mui/system";
import { GlobalStyles, useTheme, Paper, Modal, Card } from "@mui/material";
import Directory from "./Directory";
import ModalAddFolder from "./ModalAddFolder";

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

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export function SideMenu(props) {
  const { mobileOpen, setMobileOpen } = props;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [modalAddFolder, setModalAddFolder] = useState(false);

  const handleOpenModalAddFolder = () => {
    setModalAddFolder(true);
  };

  const handleCloseModalAddFolder = () => {
    setModalAddFolder(false);
  };

  const addFolderModal = (
    <Modal open={modalAddFolder} onClose={handleCloseModalAddFolder}>
      <Paper
        sx={modalStyle}
        disableEqualOverflow
        style={{ borderRadius: 10, overflowY: "auto", maxHeight: "500px" }}
      >
        <style>{`::-webkit-scrollbar {
          display: none;
        }`}</style>
        <ModalAddFolder handleCloseModal={handleCloseModalAddFolder} />
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
          justifyContent: "end",
          marginTop: 1,
        }}
      >
        <NavLink
          className={(props) => {
            return `${
              props.isActive ? "sidebar-nav-item-active" : "sidebar-nav-item"
            }`;
          }}
        >
          <List
            sx={{ display: "flex", flexDirection: "row", alignItems: "flex-end" }}
          >
            <ListItem onClick={handleOpenModalAddFolder}>
              <CreateNewFolderIcon />
            </ListItem>
            <ListItem>
              <PlaylistAddIcon />
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
      {addFolderModal}
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