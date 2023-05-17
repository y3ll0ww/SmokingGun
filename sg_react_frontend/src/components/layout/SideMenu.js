import React from "react";
import PropTypes from "prop-types";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";

import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";

import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

import { NavLink } from "react-router-dom";

import { Box } from "@mui/system";
import { GlobalStyles, useTheme, Paper, Modal } from "@mui/material";
import Directory from "./Directory";
import ModalAddFolder from "../ModalAddFolder";

const drawerWidth = '30%';
const drawerMinWidth = 350;

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
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export function SideMenu(props) {
    const { mobileOpen, setMobileOpen } = props;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const [modalAddFolder, modalAddFolderIsOpen] = React.useState(false);

    const handleOpenModalAddFolder = () => {
        modalAddFolderIsOpen(true);
    }

    const handleCloseModalAddFolder = () => {
        modalAddFolderIsOpen(false);
    }

    const addFolderModal = (
        <Modal open={modalAddFolder} onClose={handleCloseModalAddFolder}>
            
            <Paper sx={modalStyle} disableEqualOverflow 
                 style={{ borderRadius: 10, overflowY:'auto', maxHeight:"500px" }}>      
                <style>
                    {`::-webkit-scrollbar {
                        display: none;
                    }`}
                </style>
                <ModalAddFolder handleCloseModal={handleCloseModalAddFolder} />
            </Paper>
        </Modal>
    )

    const drawer = (
        <Box>
            <Toolbar />
            <Divider />
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', marginTop: 1 }}>
                <NavLink
                    className={(props) => {
                        return `${props.isActive ? 'sidebar-nav-item-active' : 'sidebar-nav-item'}`;
                    }}
                >
                    <List sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                        <ListItem onClick={handleOpenModalAddFolder}><CreateNewFolderIcon /></ListItem>
                        <ListItem><PlaylistAddIcon /></ListItem>
                    </List>
                </NavLink>
            </Box>
            <Divider />
            <List>
                <Directory />
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
            </List>
        </Box>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { md: drawerWidth }, flexShrink: { sm: 0 } }}
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
                        width: drawerWidth,
                        minWidth: drawerMinWidth
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
                        width: drawerWidth,
                        minWidth: drawerMinWidth
                    },
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    );
}

SideMenu.propTypes = {
    mobileOpen: PropTypes.bool,
    setMobileOpen: PropTypes.func.isRequired,
};

export default SideMenu;