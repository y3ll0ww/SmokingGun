import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, IconButton, TextField } from "@mui/material";
import { FOLDER, TESTCASE, ROOT, KEY_FOLDER, KEY_TESTCASE } from '../../constants';
import DataObjectIcon from '@mui/icons-material/DataObject';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import store from "../Redux/store";


export default function Title() {
    const type = useSelector(state => state.type);
    const object = useSelector(state => state.object);
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [isModified, setIsModified] = useState(false);

    const created = new Date(object.created_on).toLocaleString();
    const edited = new Date(object.edited_on).toLocaleString();

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleTitleChange = (event) => {
        const updatedTitle = event.target.value;
        console.log(newTitle);
        setNewTitle(updatedTitle);
        console.log(newTitle);
        setIsModified(true);
    };

    const handleSaveClick = () => {
        if (newTitle.length < 5 || newTitle.length > 50) {
            // Display an error message or handle the error appropriately
            return;
        }

        // Make the update call to the backend with the newTitle
        // ...

        setIsEditing(false);
        setIsModified(false);
    };

    const handleClickOutside = () => {
        if (isModified) {
            handleSaveClick();
        } else {
            setIsEditing(false);
            setNewTitle(object.name ? object.name : 'Project name');
        }
    };

    useEffect(() => {
        setNewTitle(store.getState().object.name);
    }, [store.getState().object.name, []]);

    useEffect(() => {
        setNewTitle(newTitle);
    }, [newTitle]);

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            setIsEditing(false);
        }
    };

    const key = (
        <span style={{ color: 'gray', fontSize: '22px' }}>
            {type === FOLDER ? KEY_FOLDER(object.id) :
             type === TESTCASE ? KEY_TESTCASE(object.id) :
             type === ROOT ? <DataObjectIcon /> :
             ''}
        </span>
    )

    return (
        <Box>
            {!isEditing ? (
                <h1 style={{ marginBottom: 0 }}>
                    {key} {object.name}
                    <IconButton style={{ marginLeft: '5px' }} onClick={handleEditClick}>
                        <EditIcon />
                    </IconButton>
                </h1>
            ) : (
                <h1 style={{ marginBottom: '-1px' }}>
                    {key}
                    <TextField
                        key={newTitle}
                        value={newTitle}
                        onChange={handleTitleChange}
                        onKeyDown={handleKeyDown}
                        onBlur={handleClickOutside}
                        variant="standard"
                        size="small"
                        autoFocus
                        style={{ width: '80%', marginLeft: '5px' }}
                        inputProps={{
                            maxLength: 50,
                            style: {
                                fontSize: 'inherit',
                                fontWeight: 'bold',
                                lineHeight: 'inherit',
                                padding: '0px'
                            },
                        }}
                        InputProps={{
                            style: {
                                fontSize: 'inherit',
                            },
                        }}
                    />
                </h1>
            )}
            <span style={{ color: 'gray', fontSize: '12px' }}>Created on <b>{created}</b> - Last edited on <b>{edited}</b></span>
        </Box>
    );
}