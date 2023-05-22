import React, { useState } from "react";
import { Box, Card, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

export default function ModalDelete(props) {
    //const [folderName, setFolderName] = useState(""); // State to hold the folder name
    //const [error, setError] = useState(""); // State to hold the validation error message

    //const handleCreateFolder = () => {
//
    //    // Make an API request to create the folder
    //    const apiUrl = "api/suite/folders/create/"; // Replace with your actual API endpoint
    //    const data = {
    //        name: folderName,
    //        parent_folder: null, // Default parent_folder value
    //    };
//
    //    fetch(apiUrl, {
    //        method: "POST",
    //        headers: {
    //        "Content-Type": "application/json",
    //        },
    //        body: JSON.stringify(data),
    //    })
    //    .then((response) => response.json())
    //    .then((responseData) => {
    //        // Handle the API response if needed
    //        console.log(responseData);
    //    })
    //    .catch((error) => {
    //        // Handle errors
    //        console.error("Error:", error);
    //    });
//
    //    // Close the modal or perform other necessary actions
    //    props.handleCloseModal();
    //};

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            props.handleCLoseModal();
        }
    };

    const isFolder = props.type === 'folder';

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
            <h2 style={{ textAlign: 'center', marginTop: '-5px'}}>WARNING</h2>
            <p style={{ marginTop: '5px', marginBottom: '5px', fontSize: '16px', textAlign: 'justify' }}>
                Are you sure you want to delete the {props.type} <b>"{props.name}"</b>{isFolder ? ' all of its child components?' : '?'}
            </p>
            <Card variant="outlined" style={{ display: 'flex', alignItems: 'center', fontSize: '14px', padding: '20px', marginTop: '20px' }}>
                <ReportProblemIcon style={{ fontSize: '48px', marginRight: '25px' }} />
                <div><i>This action cannot be undone; {isFolder ? ' everything' : 'the testcase'} will be deleted <b>permanently</b>{isFolder ? ' including underlying testcases.' : '.'}</i></div>
            </Card>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" style={{ textTransform: 'none', marginTop: '25px', width: '350px' }}>Delete {props.type} (ID:{props.id})</Button>
            </div>
        </Box>
    );
}

