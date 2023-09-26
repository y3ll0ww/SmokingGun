import React, { useState } from "react";
import { Box, IconButton, Alert, Paper, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { KEY_, FOLDER } from "../../../constants";
import { useSelector } from "react-redux";
import  TagIcon from '@mui/icons-material/Tag';
import FolderIcon from '@mui/icons-material/Folder';
import TurnLeftIcon from '@mui/icons-material/TurnLeft';
import useRequestResource from "../../../../hooks/useRequestResource";
import store from "../../Redux/store";
import * as actions from "../../Redux/actionTypes";


export default function ModalMove(props) {
    const projectName = useSelector((state) => state.projects.currentProject.name);
    const projectKey = useSelector((state) => state.projects.currentProject.key);
    const treeFolders = useSelector((state) => state.tree.folders);
    const [alertText, setAlertText] = useState(null);
    const resourceLabel = `"${KEY_(projectKey, props.item.item_number)}: ${props.item.name}"`;
    const padding = 3;

    const { updateResource } = useRequestResource({ endpoint: `/suite/${props.item.type}/move`, resourceLabel: resourceLabel });

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            props.handleCloseModal();
        }
    };

    const handleClick = (id) => {
        if (id === props.item.id && props.item.type === FOLDER) {
            setAlertText('It is not possible to move a folder into itself; please choose a different location.');
        } else if (id === props.item.parent_folder || id === 0 && props.item.parent_folder === null) {
            setAlertText(`The ${props.item.type} is already in this location.`);
        } else {
            props.handleCloseModal();
            setAlertText(null);
            updateResource(props.item.id, { parent_folder: id });
            store.dispatch({ type: actions.TREE_UPDATE, payload: { name: props.item.name } })
        }
    }

    function folderNode(folder, padding=3, root=true) {
        const newPadding = root ? padding : padding + 15;
        return (
            <div>
                <ListItem button onClick={() => handleClick(folder.id)} style={{ paddingLeft: padding, fontSize: "8px" }}>
                    <ListItemIcon>{root ? <FolderIcon /> : <TurnLeftIcon style={{ transform: 'rotate(180deg)' }}/> }</ListItemIcon>
                    <ListItemText 
                        primary={
                            <span>
                                <span style={{ color: 'gray', fontSize: '12px' }}>{KEY_(projectKey, folder.item_number)} </span>
                                {folder.name} {props.item.id === folder.id && props.item.type === FOLDER ? (<span style={{ color: 'gray' }}>(selected)</span>
                                ) : props.item.parent_folder === folder.id ? (<span style={{ color: 'gray' }}>(parent)</span>
                                ) : null}
                            </span>} />
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
            <h3 style={{ marginTop: '5px'}}>Move "{KEY_(projectKey, props.item.item_number)}: {props.item.name}"</h3>
            {alertText ? (
                <Alert severity="error" style={{ margin: 10, marginTop: 0 }}>
                    {alertText}
                </Alert>
            ) : (
                <Alert severity="info" style={{ margin: 10, marginTop: 0 }}>
                    Select a new location for the {props.item.type} "<b>{props.item.name}</b>" below.
                </Alert>
            )}
            <Paper variant="outlined" style={{
                maxHeight: 300, // Set your desired height
                overflow: 'auto', // Add a scrollbar when content overflows
            }}>
                <ListItem button onClick={() => handleClick(0)} style={{ paddingLeft: padding, fontSize: "8px" }}>
                    <ListItemIcon><TagIcon /></ListItemIcon>
                    <ListItemText><span style={{ color: 'gray', fontSize: '12px' }}>{projectKey} </span><span style={{ fontWeight: 550 }}>{projectName}</span> <span style={{ color: 'gray' }}>(root)</span></ListItemText>
                </ListItem>
                {treeFolders.map((folder) => (folderNode(folder)))}
            </Paper>
        </Box>
    );
}

