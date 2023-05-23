import React, { useState } from "react";
import { Box, TextField, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PestControlIcon from '@mui/icons-material/PestControl';
import store from "../Redux/store";
import * as actions from "../Redux/actionTypes";
import useRequestResource from "../../../hooks/useRequestResource";
import { FOLDER, TESTCASE } from "../../constants";

export default function ModalAdd(props) {
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const resourceLabel = `New ${props.type}`;
    const { addResource } = useRequestResource({ endpoint: `/suite/${props.type}/create/`, resourceLabel: resourceLabel });

    const handleClick = () => {
        if (name.length < 5 || name.length > 150) {
            setError("Use at least 5 to 150 characters.");
            return;
        }

        const values = {
            name: name,
            parent_folder: undefined,
            folder: undefined
        };

        addResource(values, () => {
                if (props.type === FOLDER) {
                    store.dispatch({ type: actions.CREATE_FOLDER, payload: { name: name } });
                } else if (props.type === TESTCASE) {
                    store.dispatch({ type: actions.CREATE_TESTCASE, payload: { name: name } });
                }
                props.handleCloseModal();
            },
            () => {
            setError("Something went wrong...")
        });        
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleClick();
        } else if (event.key === "Escape") {
            props.handleCloseModal();
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
            <h4 style={{ marginTop: '-5px', marginBottom: '5px' }}>Create a new {props.type}</h4>
            <TextField 
                id="outlined-search" label={`Add ${props.type}`} type="search" 
                InputProps={{ style: { marginTop: '6px', height: '40px', width: '275px' }, }} 
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!error}
                helperText={error}
                onKeyDown={handleKeyDown}
            />
            <IconButton style={{ marginLeft: '7px' }} onClick={handleClick}>
                {props.type === FOLDER ? <CreateNewFolderIcon style={{ fontSize: '34px' }} /> :
                 props.type === TESTCASE ? <PlaylistAddIcon style={{ fontSize: '34px' }} /> :
                 <PestControlIcon style={{ fontSize: '34px' }} />
                }
            </IconButton>
        </Box>
    );
}

