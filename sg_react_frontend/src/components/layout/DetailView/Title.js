import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, IconButton, TextField } from "@mui/material";
import { FOLDER, TESTCASE, ROOT, KEY_FOLDER, KEY_TESTCASE } from '../../constants';
import DataObjectIcon from '@mui/icons-material/DataObject';
import EditIcon from '@mui/icons-material/Edit';
import store from "../Redux/store";
import * as actions from "../Redux/actionTypes";
import useRequestResource from "../../../hooks/useRequestResource";


export default function Title() {
    const type = useSelector(state => state.type);
    const object = useSelector(state => state.object);
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    //const [isModified, setIsModified] = useState(false);
    const [error, setError] = useState("");
    const resourceLabel = `${type} ${object.name}`;
    const { updateResource } = useRequestResource({ endpoint: `/suite/${type}/update`, resourceLabel: resourceLabel });
    

    const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const created = new Date(object.created_on).toLocaleString(undefined, dateOptions);
    const edited = new Date(object.edited_on).toLocaleString(undefined, dateOptions);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleTitleChange = (event) => {
        const updatedTitle = event.target.value;
        setNewTitle(updatedTitle);
        //setIsModified(true);
    };

    const handleSaveClick = () => {
        if (newTitle.length < 5 || newTitle.length > 50) {
            // Display an error message or handle the error appropriately
            return;
        }

        // Make the update call to the backend with the newTitle
        // ...

        setIsEditing(false);
        //setIsModified(false);
    };

    const handleClickOutside = () => {
        setError("");
        setIsEditing(false);
        setNewTitle(object.name ? object.name : 'Project name');
    };

    useEffect(() => {
        setNewTitle(store.getState().object.name);
    }, [store.getState().object.name, []]);

    useEffect(() => {
        setNewTitle(newTitle);
    }, [newTitle]);

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            if (newTitle.length < 5 || newTitle.length > 150) {
                event.preventDefault();
                console.log(newTitle);
                setError("Use at least 5 to 150 characters.");
                //setIsModified(false);
            } else {
                updateResource(object.id, { name: newTitle });
                setError("");
                setIsEditing(false);
                if (type === FOLDER) {
                    store.dispatch({ type: actions.UPDATE_FOLDER, payload: { name: newTitle } });
                } else if (type === TESTCASE) {
                    store.dispatch({ type: actions.UPDATE_TESTCASE, payload: { name: newTitle } });
                }
                
            }
        }
        if (event.key === "Escape") {
            setError("");
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
                    {key} {object.name != undefined ? (
                        <React.Fragment>
                            {object.name}
                            <IconButton style={{ marginLeft: '5px' }} onClick={handleEditClick}>
                                <EditIcon />
                            </IconButton>
                        </React.Fragment>
                    ) : 'Project name'}
                </h1>
            ) : (
                <h1 style={{ marginBottom: '-1px' }}>
                    {key}
                    <TextField
                        value={newTitle}
                        onChange={handleTitleChange}
                        onKeyDown={handleKeyDown}
                        onBlur={handleClickOutside}
                        variant="standard"
                        size="small"
                        autoFocus
                        error={!!error}
                        style={{ width: '55%', marginLeft: '5px' }}
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
            <span style={{ color: 'gray', fontSize: '12px' }}>
                Created on <b>{created}</b> {created !== edited && `- Last edited on `}{created !== edited && <b>{edited}</b>}
            </span>
        </Box>
    );
}