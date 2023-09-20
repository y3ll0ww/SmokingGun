import React, { useState } from "react";
import { Box, IconButton, Alert, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { KEY_ } from "../../../constants";
import { useSelector } from "react-redux";
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import TurnLeftIcon from '@mui/icons-material/TurnLeft';
import useRequestResource from "../../../../hooks/useRequestResource";
import store from "../../Redux/store";
import * as actions from "../../Redux/actionTypes";


export default function ModalMove(props) {
    const projectName = useSelector((state) => state.projects.currentProject.name);
    const projectKey = useSelector((state) => state.projects.currentProject.key);
    const treeFolders = useSelector((state) => state.tree.folders);
    const [sameIdAlert, setSameIdAlert] = useState(false);
    const resourceLabel = `"${KEY_(projectKey, props.item_number)}: ${props.name}"`;
    const padding = 3;

    const { updateResource } = useRequestResource({ endpoint: `/suite/${props.type}/move`, resourceLabel: resourceLabel });

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            props.handleCloseModal();
        }
    };

    const handleClick = (id) => {
        if (id === props.id) {
            setSameIdAlert(true);
        } else {
            props.handleCloseModal();
            setSameIdAlert(false);
            updateResource(props.id, { parent_folder: id });
            store.dispatch({ type: actions.TREE_UPDATE, payload: { name: props.name } })
        }
    }

    function folderNode(folder, padding=3, root=true) {
        const newPadding = root ? padding : padding + 15;
        return (
            <div>
                <ListItem button onClick={() => handleClick(folder.id)} style={{ paddingLeft: padding, fontSize: "8px" }}>
                    <ListItemIcon>{root ? <FolderIcon /> : <TurnLeftIcon style={{ transform: 'rotate(180deg)' }}/> }</ListItemIcon>
                    <ListItemText primary={<span><span style={{ color: 'gray', fontSize: '12px' }}>{KEY_(projectKey, folder.item_number)} </span>{folder.name}</span>} />
                </ListItem>              
                <div>
                  {folder.child_folders &&
                    folder.child_folders.map((child) => (
                      folderNode(child, newPadding, false)
                    ))}
                </div>
            </div>
        )
    }

    return (
        <Box>
            <IconButton
                aria-label="close"
                onClick={props.handleCloseModal}
                color="inherit"
                size="small"
                style={{ position: 'absolute', top: 2, right: 2 }}
            >
                <CloseIcon style={{ fontSize: '18px' }} />
            </IconButton>
            <h3 style={{ marginTop: '5px'}}>Move "{KEY_(projectKey, props.item_number)}: {props.name}"</h3>
            {sameIdAlert ? (
                <Alert severity="error" style={{ margin: 10, marginTop: 0 }}>
                    It is not possible to move a folder into itself; please choose a different location.
                </Alert>
            ) : (
                <Alert severity="info" style={{ margin: 10, marginTop: 0 }}>
                    Select a new location for the {props.type} "<b>{props.name}</b>" below.
                </Alert>
            )}
            <List>
                <ListItem button onClick={() => handleClick(0)} style={{ paddingLeft: padding, fontSize: "8px" }}>
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText><span style={{ color: 'gray', fontSize: '12px' }}>{projectKey} </span><span style={{ fontWeight: 550 }}>{projectName}</span> (root)</ListItemText>
                </ListItem>
                {treeFolders.map((folder) => (folderNode(folder)))}
            </List>
        </Box>
    );
}

