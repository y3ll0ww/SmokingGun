import React, { useEffect, useState } from "react";
import { Box, TextField, Card, IconButton, Button } from '@mui/material';
import { useSelector } from "react-redux";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { FOLDER, TESTCASE } from "../../constants";
import store from "../Redux/store";
import * as actions from "../Redux/actionTypes";
import useRequestResource from "../../../hooks/useRequestResource";

export default function Description() {
    const type = useSelector(state => state.type);
    const object = useSelector(state => state.object);
    const description = useSelector(state => state.object.description);
    const [newText, setNewText] = useState(description);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");
    const resourceLabel = `${type.charAt(0).toUpperCase() + type.slice(1)} ${object.name}`;
    const { updateResource } = useRequestResource({ endpoint: `/suite/${type}/update`, resourceLabel: resourceLabel });

    const handleClick = () => {
        if (newText !== description) {
            setNewText(description);
        }
        setIsEditing(true);
    }

    const handleChange = (event) => {
        const updatedText = event.target.value;
        setNewText(updatedText);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            if ((newText.length < 5 ) || newText.length > 250) {
                event.preventDefault();
                setError("Use at least 5 to 150 characters.");
            } else if (newText === description) {
                handleCancel();
            }
            else {
                setError("");
                updateResource(object.id, { description: newText });
                if (type === FOLDER) {
                    store.dispatch({ type: actions.UPDATE_FOLDER, payload: { name: newText } });
                } else if (type === TESTCASE) {
                    store.dispatch({ type: actions.UPDATE_TESTCASE, payload: { name: newText } });
                }
                setIsEditing(false);
            }
        }
        if (event.key === "Escape") {
            handleCancel();
        }
    };

    const handleCancel = () => {
        setError("");
        setIsEditing(false);
        setNewText(description);
    };

    return (
        <Box>
            { isEditing ?
                <TextField
                  autoFocus
                  value={newText}
                  onChange={handleChange}
                  onBlur={handleCancel}
                  onKeyDown={handleKeyDown}
                  error={!!error}
                  style={{ marginTop: 5, marginBottom: 5, width: '100%' }} />            
            : description !== undefined && description.length > 0 ?
                <Card variant="outlined" style={{ padding: 15, marginTop: 5, marginBottom: 5 }}>
                    {description}
                    <IconButton 
                      style={{ marginLeft: 5 }}
                      onClick={handleClick}>
                        <EditIcon style={{ fontSize: 14 }}/>
                    </IconButton>
                </Card>
            :
                <Button 
                  variant="outlined"
                  style={{ marginTop: 15, marginBottom: 10, textTransform: 'none' }}
                  onClick={handleClick}>
                    <AddIcon style={{ marginLeft: -5, marginRight: 5 }}/> Add a Description
                </Button>
            }
        </Box>
    );
}