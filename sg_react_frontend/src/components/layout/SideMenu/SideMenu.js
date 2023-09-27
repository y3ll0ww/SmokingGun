import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Drawer, Toolbar, Divider, GlobalStyles, useTheme, Paper, Modal } from "@mui/material";
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import ProjectDropDown from "./ProjectDropDown";
import Tools from "./Tools";
import Directory from "./Directory";
import ModalAdd from "../DetailView/Modal/ModalAdd";
import { MODALSTYLE } from "../../constants";
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
        sx={MODALSTYLE}
        style={{ borderRadius: 10, overflowY: "auto", maxHeight: "500px" }}
      >
        <style>{`::-webkit-scrollbar {
          display: none;
        }`}</style>
        <ModalAdd handleCloseModal={handleCloseModal} type={type} projectId={store.getState().projects.currentProject.id} />
      </Paper>
    </Modal>
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
        <ProjectDropDown />
        <Tools handleOpenModal={handleOpenModal} />
      </Box>
      <Divider />
      <Box sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "end",
      }}>
        <UnfoldMoreIcon 
          onMouseDown={handleMouseDown} 
          style={{ 
            transform: 'rotate(90deg)', 
            marginTop: -10, 
            marginBottom: -20,
            marginRight: 0,
            fontSize: 19,
            color: 'lightgray',  
            cursor: 'col-resize' }}/>
      </Box>
      <Box style={{ overflowY: "auto" }}>
        <style>{`::-webkit-scrollbar {
          display: none;
        }`}</style>
        <Directory />
      </Box>
    </Box>
  );


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
        <div style={{ width: "100%", height: "100%" }}>{drawer}</div>
      </Drawer>
    </Box>
  );
}

SideMenu.propTypes = {
  mobileOpen: PropTypes.bool,
  setMobileOpen: PropTypes.func.isRequired,
};

export default SideMenu;