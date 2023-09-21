import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, IconButton, TextField } from "@mui/material";
import { PROJECT, KEY_, DATE, PRIMARY_COLOR } from '../../constants';
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
                store.dispatch({ type: actions.TREE_UPDATE, payload: { name: newTitle } });
            }
        }
        if (event.key === "Escape") {
            setError("");
            setIsEditing(false);
        }
    };

    const key = (
        <span style={{ color: 'gray', fontSize: '22px' }}>
            {type === PROJECT ? <TagIcon style={{ marginRight: 5 }}/> : ''}
            {type === PROJECT ? project.key + ' ' : KEY_(project.key, object.item_number) + ' '}
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
                            <EditIcon style={{ color: PRIMARY_COLOR }}/>
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