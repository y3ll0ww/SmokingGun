import React, { useState, useEffect } from "react";
import { Box, IconButton, TextField, Button, Alert, AlertTitle, Menu } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyIcon from '@mui/icons-material/Key';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import useRequestResource from "../../../../hooks/useRequestResource";
import store from "../../Redux/store";
import * as actions from '../../Redux/actionTypes';

export default function ModalAddProject(props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [key, setKey] = useState("");
    const [nameError, setNameError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [keyError, setKeyError] = useState("");
    const [hasErrors, setHasErrors] = useState("");
    const [inputIsValid, setInputIsValid] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const height = 40;
    const mTop = 6;
    const maxLengthName = 50;
    const maxLengthDescription = 150;
    const { addResource } = useRequestResource({ endpoint: "/suite/project/create/", resourceLabel: `Project "${name}"` });

    const handleSubmit = () => {
        validateInput();
    };

    const validateInput = () => {
        let isValid = true;
        setHasErrors(false);

        if (name.length < 5) {
            setNameError("• Name must have at least 5 characters");
            setHasErrors(true);
            isValid = false;
        } else { setNameError(""); }

        if (key.length < 4) {
            setKeyError("• Key must be 4 characters");
            setHasErrors(true);
            isValid = false;
        } else { setKeyError(""); }

        setInputIsValid(isValid);
    }

    useEffect(() => {
        if (inputIsValid) {
            addResource({ name: name, description: description, key: key }, () => {
                store.dispatch({ type: actions.TREE_UPDATE, payload: { name: name } });
                props.handleCloseModal();
                setInputIsValid(false);
            });
        }
    }, [inputIsValid])

    const handleSetName = (value) => {
        if (value.length <= maxLengthName) {
            const formattedValue = value.replace(/[^A-Za-z\s]/g, '');
            setName(formattedValue);
        }
    }

    const handleSetDescription = (value) => {
        if (value.length <= maxLengthDescription) {
            const formattedValue = value.replace(/[^A-Za-z\s]/g, '');
            setDescription(formattedValue);
        }
    }

    const handleSetKey = (value) => {
        if (value.length <= 4) {
            const formattedValue = value.replace(/[^A-Za-z\s]/g, '');
            const capitalizedValue = formattedValue.toUpperCase();
            setKey(capitalizedValue);
        }
    };

    const handleKeyGen = () => {
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let randomKey = '';
        for (let i = 0; i < 4; i++) {
            const index = Math.floor(Math.random() * charset.length);
            randomKey += charset[index];
        }
        setKey(randomKey);
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSubmit();
        } else if (event.key === "Escape") {
            props.handleCloseModal();
        }
    };

    const handleKeyInfo = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    }

    const errorAlert = () => {
        let errors = []

        if (nameError) { errors.push(nameError); }
        if (keyError) { errors.push(keyError) }

        return (
            <Alert severity="error">
                <AlertTitle>Invalid input</AlertTitle>
                {errors.map((error) => (
                    <div style={{ fontSize: 12 }}>{error}</div>
                ))}
            </Alert>
        );
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
            <h4 style={{ marginTop: -5, marginBottom: 15 }}>Create a new project</h4>
            {hasErrors ? errorAlert() : ""}
            <TextField
                required
                id="project-name"
                label="Project name"
                InputProps={{ style: { marginTop: mTop, height: height, marginBottom: 15, width: 337 }, }} 
                value={name}
                onChange={(e) => handleSetName(e.target.value)}
                error={!!nameError}
                onKeyDown={handleKeyDown}
            />
            <TextField
                multiline
                id="project-description"
                label="Description"
                inputProps={{ style: { marginTop: mTop, height: height*2, marginBottom: 15, width: 309 }, }}
                value={description}
                onChange={(e) => handleSetDescription(e.target.value)}
                error={!!descriptionError}
                onKeyDown={handleKeyDown}
            />
            <Box style={{ marginBottom: 15, marginTop: mTop*2 }}>
                <TextField
                    required
                    id="project-key"
                    label="Key"
                    InputProps={{ 
                        maxLength: 10,
                        autoCapitalize: 'characters',
                        style: { marginTop: mTop, marginRight: 10, height: height, width: 100 }
                    }} 
                    value={key}
                    onChange={(e) => handleSetKey(e.target.value)}
                    error={!!keyError}
                    onKeyDown={handleKeyDown}
                />
                <Button 
                  variant="outlined"
                  style={{ marginTop: mTop, textTransform: 'none', height: height }}
                  onClick={handleKeyGen}>
                    <KeyIcon style={{ marginLeft: -5, marginRight: 5 }}/> Generate Key
                </Button>
                <IconButton onClick={(e) => handleKeyInfo(e)} style={{ marginTop: mTop, marginLeft: 5 }}>
                    <HelpOutlineIcon />
                </IconButton>
            </Box>
            <Button 
              variant="contained"
              style={{ marginTop: mTop, textTransform: 'none', height: height }}
              onClick={handleSubmit}>
                Create Project
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'center',
                horizontal: 'center',
              }}
              style={{ width: 950 }}
            >
              <Alert 
                severity="info" 
                style={{ 
                    marginTop: -10,
                    marginBottom: -10,
              }}>

                <p style={{ fontSize: 12, marginTop: 0, textAlign: "justify" }}>
                    The key is used to easily identify the project. A key doesn't have to be unique, but it's recommended.
                </p>
                <p style={{ fontSize: 12, marginBottom: 0, textAlign: "justify" }}>
                    Only characters are allowed; '<b>ABCD</b>' or '<b>WXYZ</b>' are examples of valid keys.
                </p>
              </Alert>
            </Menu>
        </Box>
    );
}

