import React from "react";
import { Box, IconButton, Alert, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FOLDER, KEY_FOLDER, KEY_TESTCASE } from "../../constants";
import { useSelector } from "react-redux";
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import TurnLeftIcon from '@mui/icons-material/TurnLeft';


export default function ModalMove(props) {
    const projectName = useSelector((state) => state.projects.currentProject.name);
    const treeFolders = useSelector((state) => state.tree.folders);
    const padding = 3;

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            props.handleCloseModal();
        }
    };

    const handleClickRoot = () => {
        props.handleCloseModal();
    }

    const handleClick = (id) => {
        props.handleCloseModal();
        //deleteResource(id);
        //store.dispatch({ type: actions.TREE_UPDATE, payload: { name: props.name } })
    }

    function folderNode(folder, padding=3, root=true) {
        const newPadding = root ? padding : padding + 15;
        return (
            <div>
                <ListItem button onClick={handleClick} style={{ paddingLeft: padding, fontSize: "8px" }}>
                    <ListItemIcon>{root ? <FolderIcon /> : <TurnLeftIcon style={{ transform: 'rotate(180deg)' }}/> }</ListItemIcon>
                    <ListItemText primary={<span><span style={{ color: 'gray', fontSize: '12px' }}>{folder.key} </span>{folder.name}</span>} />
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
            <h3 style={{ marginTop: '5px'}}>Move "{props.type === FOLDER ? KEY_FOLDER(props.id) : KEY_TESTCASE(props.id)} {props.name}"</h3>
            <Alert severity="info" style={{ margin: 10, marginTop: 0 }}>
                Select a new location for the {props.type} "<b>{props.name}</b>" below.
            </Alert>
            <List>
                <ListItem button onClick={handleClickRoot} style={{ paddingLeft: padding, fontSize: "8px" }}>
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText><span style={{ fontWeight: 550 }}>{projectName}</span> (root)</ListItemText>
                </ListItem>
                {treeFolders.map((folder) => (folderNode(folder)))}
            </List>
        </Box>
    );
}

