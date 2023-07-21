import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { List, ListItem } from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { NavLink } from "react-router-dom";
import { IconButton } from "@mui/material";
import { FOLDER, TESTCASE } from "../../constants";


export default function Tools(props) {
    const projectId = useSelector(state => state.projects.currentProject.id);
    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        if (projectId > 0) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [projectId])


    return (
        <NavLink
          className={(props) => {
            return `${
              props.isActive ? "sidebar-nav-item-active" : "sidebar-nav-item"
            }`;
          }}
        >
          <List
            sx={{ display: "flex", flexDirection: "row", alignItems: "flex-end" }}
            style={{ paddingRight: 8, cursor: 'default' }}
          >
            <ListItem style={{ padding: 1, cursor: isDisabled ? 'default' : '' }}>
              <IconButton onClick={() => props.handleOpenModal(FOLDER)} disabled={isDisabled}>
                <CreateNewFolderIcon style={{ color: isDisabled ? 'gray' : '' }} />
              </IconButton>
            </ListItem>
            <ListItem style={{ padding: 1, cursor: isDisabled ? 'default' : '' }}>
              <IconButton onClick={() => props.handleOpenModal(TESTCASE)} disabled={isDisabled}>
                <PlaylistAddIcon style={{ color: isDisabled ? 'gray' : '' }} />
              </IconButton>
            </ListItem>
            <ListItem style={{ padding: 1, cursor: isDisabled ? 'default' : '' }}>
              <IconButton disabled={isDisabled}>
                <UnfoldMoreIcon style={{ color: isDisabled ? 'gray' : '' }} />
              </IconButton>
            </ListItem>
          </List>
        </NavLink>
    )
}