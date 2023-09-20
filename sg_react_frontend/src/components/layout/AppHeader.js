import React from "react";
import { Link } from 'react-router-dom';
import { AuthContext } from "../../contexts/AuthContextProvider";
import useRequestAuth from "../../hooks/useRequestAuth";
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography, Box, Modal, TextField, CircularProgress, Divider, ListItemIcon, ListItemText, Chip } from "@mui/material";
import PropTypes from "prop-types";
import MenuIcon from "@mui/icons-material/Menu";
import { AccountCircle, DarkMode, Inbox, Logout } from "@mui/icons-material";

import logo from '../../logo.svg';
import store from "./Redux/store";
import * as actions from "./Redux/actionTypes";

const drawerWidth = 240;

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

export function AppHeader({ mobileOpen, setMobileOpen }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const { user } = React.useContext(AuthContext);
    const { logout, logoutPending } = useRequestAuth();

    const handleLogout = () => {
        logout();
    }

    const handleOpenModal = () => {
        setModalIsOpen(true);
        setAnchorEl(null);
    }

    const handleCloseModal = () => {
        setModalIsOpen(false);
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const modal = (
        <Modal open={modalIsOpen} onClose={handleCloseModal}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2" sx={{
                    mb: 3
                }}>
                    Profile
                </Typography>
                <TextField id="username"
                    variant="outlined"
                    label="Username"
                    value={user ? user.username : ""}
                    disabled
                    sx={{
                        mb: 3,
                        width: "100%"
                    }}
                />
                <TextField id="email"
                    variant="outlined"
                    label="Email"
                    value={user ? user.email : ""}
                    disabled
                    sx={{
                        mb: 3,
                        width: "100%"
                    }}
                />
            </Box>
        </Modal>
    )

    const handleTheme = () => {
        store.dispatch({ type: actions.SET_THEME });
    }

    const authLinks = (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
                aria-label="toggle dark mode"
                aria-controls="menu-appbar"
                aria-haspopup="false"
                color="inherit"
                size="large"
            >
                <DarkMode onClick={handleTheme}/>
            </IconButton>
            <Divider variant="middle" orientation="vertical" color="inherit" flexItem style={{ marginRight:'.5rem', marginLeft:'.5rem' }} />
            <IconButton
                aria-label="open notifications"
                aria-controls="menu-appbar"
                aria-haspopup="false"
                color="inherit"
                size="large"
            >
                <Inbox />
            </IconButton>
            <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                size="large"
            >
                <AccountCircle />
            </IconButton>

            <Menu
                id="menu-appbar"
                PaperProps={{
                    style: {
                      width: 200
                    }
                }}
                anchorEl={anchorEl}
                anchorReference="anchorPosition"
                anchorPosition={{
                    top: anchorEl ? anchorEl.getBoundingClientRect().bottom : 0,
                    left: anchorEl ? anchorEl.getBoundingClientRect().right : 0,
                }}
                keepMounted
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
            >
                <Divider variant="middle"><Chip label="Pages" /></Divider>
                <MenuItem onClick={handleOpenModal}>
                    Profile
                </MenuItem>
                <MenuItem>
                    Feed
                </MenuItem>
                <MenuItem>
                    Watchlists
                </MenuItem>
                <MenuItem>
                    News
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Link to="/companies/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Companies
                    </Link>
                </MenuItem>
                <MenuItem>
                    Training
                </MenuItem>
                <Divider variant="middle"><Chip label="Settings" /></Divider>
                <MenuItem onClick={handleOpenModal}>
                    Account
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Link to="/user/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Edit profile
                    </Link>
                </MenuItem>
                <MenuItem onClick={handleOpenModal}>
                    Subscriptions
                </MenuItem>
                <Divider variant="middle" /> 
                <MenuItem disabled={logoutPending} onClick={handleLogout}>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        {logoutPending === true ? <CircularProgress size={20} sx={{
                            mr: 2
                        }} /> : null}
                    </Box>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Log out</ListItemText>
                </MenuItem>
            </Menu>
        </Box>
    );

    return (
        <AppBar
            position="fixed"
            xs={{
                width: { md: `calc(100% - ${drawerWidth}px)` },
                ml: { md: `${drawerWidth}px` },
            }}
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { md: "none" } }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                    <img src={logo}
                     alt="Logo V101" 
                     width="100"
                     style={{marginTop: '10px', width: '80px'}}/>
                </Typography>
                {authLinks}
            </Toolbar>
            {modal}
        </AppBar>
    );
}

AppHeader.propTypes = {
    mobileOpen: PropTypes.bool,
    setMobileOpen: PropTypes.func.isRequired,
};

export default AppHeader;