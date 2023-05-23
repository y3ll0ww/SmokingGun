import React, { useState } from "react";
import { Box, TextField, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import store from "../Redux/store";
import * as actions from "../Redux/actionTypes";

export default function ModalAddFolder(props) {
    const [folderName, setFolderName] = useState(""); // State to hold the folder name
    const [error, setError] = useState(""); // State to hold the validation error message

    const handleCreateFolder = () => {
        if (folderName.length < 5 || folderName.length > 150) {
            setError("Use at least 5 to 150 characters.");
            return;
        }

        store.dispatch({ type: actions.CREATE_FOLDER, payload: { id: 123, name: 'hello-world' } })

        // Make an API request to create the folder
        const apiUrl = "api/suite/folders/create/"; // Replace with your actual API endpoint
        const data = {
            name: folderName,
            parent_folder: null, // Default parent_folder value
        };

        fetch(apiUrl, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((responseData) => {
            // Handle the API response if needed
            console.log(responseData);
        })
        .catch((error) => {
            // Handle errors
            console.error("Error:", error);
        });

        // Close the modal or perform other necessary actions
        props.handleCloseModal();
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleCreateFolder();
        } else if (event.key === "Escape") {
            props.handleCLoseModal();
        }
    };

    return (
        <Box >
            <IconButton
                aria-label="close"
                onClick={props.handleCloseModal}
                color="inherit"
                size="small"
                style={{ position: 'absolute', top: 2, right: 2 }}
            >
                <CloseIcon style={{ fontSize: '18px' }} />
            </IconButton>
            <h4 style={{ marginTop: '-5px', marginBottom: '5px' }}>Create a new folder</h4>
            <TextField 
                id="outlined-search" label="Add folder" type="search" 
                InputProps={{ style: { marginTop: '6px', height: '40px', width: '275px' }, }} 
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                error={!!error}
                helperText={error}
                onKeyDown={handleKeyDown}
            />
            <IconButton style={{ marginLeft: '7px' }} onClick={handleCreateFolder}>
                <CreateNewFolderIcon style={{ fontSize: '34px' }} />
            </IconButton>
        </Box>
    );
}

