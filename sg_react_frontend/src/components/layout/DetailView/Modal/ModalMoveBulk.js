import React, { useState } from "react";
import { Box, IconButton, ListItem, ListItemIcon, ListItemText, Alert, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FolderIcon from "@mui/icons-material/Folder";
import TurnLeftIcon from "@mui/icons-material/TurnLeft";
import TagIcon from "@mui/icons-material/Tag";
import { KEY_, FOLDER, TESTCASE } from "../../../constants";
import useRequestResource from "../../../../hooks/useRequestResource";
import store from "../../Redux/store";
import * as actions from "../../Redux/actionTypes";
import { useSelector } from "react-redux";


export default function ModalMoveBulk(props) {
    const folders = props.items.filter(item => item.split('_')[0] === FOLDER);
    const testcases = props.items.filter(item => item.split('_')[0] === TESTCASE);
    const selectedFolders = folders.map(folder => parseInt(folder.split('_')[1])) || [];
    const selectedTestcases = testcases.map(testcase => parseInt(testcase.split('_')[1])) || [];
    const currentObjectId = useSelector((state) => state.object.id);
    const projectName = useSelector((state) => state.projects.currentProject.name);
    const projectKey = useSelector((state) => state.projects.currentProject.key);
    const treeFolders = useSelector((state) => state.tree.folders);
    const [alertText, setAlertText] = useState(null);
    const resourceLabel = `${folders.length} folders and ${testcases.length} testcases`;
    const padding = 3;

    const { updateResources } = useRequestResource({ endpoint: '/suite/bulk/move/', resourceLabel: resourceLabel });

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            props.handleCloseModal();
        }
    };

    const handleClick = (id) => {
        if (selectedFolders.includes(id)) {
            setAlertText('It is not possible to move a folder into itself; please choose a different location.');
        } else if (id === currentObjectId || id === 0 && props.parent_folder === null) {
            setAlertText(`The items are already in this location.`);
        } else {
            props.handleCloseModal();
            props.setSelectionMode();
    
            const payload = { parent_folder: id, folders: selectedFolders, testcases: selectedTestcases };
            
            console.log(payload);

            updateResources(payload);
            store.dispatch({ type: actions.TREE_UPDATE, payload: payload });
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
                                {folder.name} {selectedFolders.includes(folder.id) ? (<span style={{ color: 'gray' }}>(selected)</span>
                                ) : folder.id === currentObjectId ? (<span style={{ color: 'gray' }}>(parent)</span>
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
            <h3 style={{ marginTop: '5px'}}>Move {folders.length} folders and {testcases.length} testcases</h3>
            {alertText ? (
                <Alert severity="error" style={{ margin: 10, marginTop: 0 }}>
                    {alertText}
                </Alert>
            ) : (
                <Alert severity="info" style={{ margin: 10, marginTop: 0 }}>
                    Select a new location for the items below.
                </Alert>
            )}
            <Paper variant="outlined" style={{
                maxHeight: 300, // Set your desired height
                overflow: 'auto', // Add a scrollbar when content overflows
            }}>
                <ListItem button onClick={() => handleClick(0)} style={{ paddingLeft: padding, fontSize: "8px" }}>
                    <ListItemIcon><TagIcon /></ListItemIcon>
                    <ListItemText><span style={{ color: 'gray', fontSize: '12px' }}>
                        {projectKey} </span><span style={{ fontWeight: 550 }}>{projectName}</span> <span style={{ color: 'gray' }}>{props.parent_folder === null ? '(parent)' : '(root)'}</span>
                    </ListItemText>
                </ListItem>
                {treeFolders.map((folder) => (folderNode(folder)))}
            </Paper>
        </Box>
    );
}

