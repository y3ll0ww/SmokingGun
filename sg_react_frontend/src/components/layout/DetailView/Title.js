import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, IconButton, TextField } from "@mui/material";
import { FOLDER, TESTCASE, PROJECT, KEY_FOLDER, KEY_TESTCASE, DATE } from '../../constants';
import TagIcon from '@mui/icons-material/Tag';
import EditIcon from '@mui/icons-material/Edit';
import store from "../Redux/store";
import * as actions from "../Redux/actionTypes";
import useRequestResource from "../../../hooks/useRequestResource";


export default function Title() {
    const project = useSelector(state => state.projects.currentProject);
    const type = useSelector(state => state.type);
    const object = useSelector(state => state.object);
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [error, setError] = useState("");
    const resourceLabel = `${type.charAt(0).toUpperCase() + type.slice(1)} "${object.name ? object.name : project.name}"`;
    const { updateResource } = useRequestResource({ endpoint: `/suite/${type}/update`, resourceLabel: resourceLabel });
    
    const created = DATE(object.created_on ? object.created_on : project.created_on, true);
    const edited = DATE(object.edited_on ? object.edited_on : project.edited_on, true);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleTitleChange = (event) => {
        const updatedTitle = event.target.value;
        setNewTitle(updatedTitle);
    };

    const handleClickOutside = () => {
        setError("");
        setIsEditing(false);
        setNewTitle(object.name ? object.name : project.name);
    };

    useEffect(() => {
        if (type !== PROJECT) {
            setNewTitle(object.name);
        } else {
            setNewTitle(project.name);
        }
    }, [object.name, []]);

    useEffect(() => {
        setNewTitle(newTitle);
    }, [newTitle]);

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            if (newTitle.length < 5 || newTitle.length > 150) {
                event.preventDefault();
                setError("Use at least 5 to 150 characters.");
            } else {
                updateResource(object.id ? object.id : project.id, { name: newTitle });
                setError("");
                setIsEditing(false);
                if (type === FOLDER) {
                    store.dispatch({ type: actions.UPDATE_FOLDER, payload: { name: newTitle } });
                } else if (type === TESTCASE) {
                    store.dispatch({ type: actions.UPDATE_TESTCASE, payload: { name: newTitle } });
                } else if (type === PROJECT) {
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
             type === PROJECT ? <TagIcon style={{ marginRight: 5 }}/> :
             ''}
        </span>
    )

    return (
        <Box>
            {!isEditing ? (
                <h1 style={{ marginBottom: 0 }}>
                    {key}
                    <React.Fragment>
                        {object.name ? object.name : project.name}
                        <IconButton style={{ marginLeft: '5px' }} onClick={handleEditClick}>
                            <EditIcon />
                        </IconButton>
                    </React.Fragment>
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
                        style={{ width: '60%', marginLeft: '5px' }}
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