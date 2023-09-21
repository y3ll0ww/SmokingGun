import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { FOLDER, PRIMARY_COLOR, TESTCASE } from "../../../constants";
import ModalAdd from "./ModalAdd";

export default function ModalAddAny(props) {
    const [type, setType] = useState(undefined);

    const handleClick = (newType) => {
        setType(newType);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleClick();
        } else if (event.key === "Escape") {
            props.handleCloseModal();
        }
    };

    if (type != undefined) {
        return <ModalAdd handleCloseModal={props.handleCloseModal} type={type} parent_folder={props.parent_folder} projectId={props.projectId} />
    }

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
            <h4 style={{ marginTop: '-5px', marginBottom: '5px', textAlign: 'center' }}>Create a new resource</h4>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <IconButton onClick={() => handleClick(FOLDER)}>
                    <CreateNewFolderIcon style={{ fontSize: '120px', color: 'gray', color: PRIMARY_COLOR }} />
                </IconButton>
                <IconButton onClick={() => handleClick(TESTCASE)}>
                    <PlaylistAddIcon style={{ fontSize: '120px', color: 'gray', color: PRIMARY_COLOR }} />
                </IconButton>
            </div>
        </Box>
    );
}

