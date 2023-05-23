import React from "react";
import { Box, Card, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { FOLDER, KEY_FOLDER, KEY_TESTCASE } from "../../constants";
import useRequestResource from "../../../hooks/useRequestResource";
import store from "../Redux/store";
import * as actions from "../Redux/actionTypes";

export default function ModalDelete(props) {
    const isFolder = props.type === FOLDER;
    const resourceLabel = isFolder ? KEY_FOLDER(props.id) + ' ' + props.name : KEY_TESTCASE(props.id) + ' ' + props.name;

    const { deleteResource, resource } = useRequestResource({ endpoint: `/suite/${props.type}/delete`, resourceLabel: resourceLabel });

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            props.handleCloseModal();
        }
    };

    const handleClick = (id) => {
        props.handleCloseModal();
        deleteResource(id);
        store.dispatch({ type: actions.DELETE_FOLDER, payload: { id: props.id, name: props.name } })
    }

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
                Are you sure you want to delete the {props.type} 
                <b>&nbsp;"{isFolder ? KEY_FOLDER(props.id) : KEY_TESTCASE(props.id)}&nbsp;{props.name}"</b>{isFolder ? ' all of its child components?' : '?'}
            </p>
            <Card variant="outlined" style={{ display: 'flex', alignItems: 'center', fontSize: '14px', padding: '20px', marginTop: '20px' }}>
                <ReportProblemIcon style={{ fontSize: '48px', marginRight: '25px' }} />
                <div><i>This action cannot be undone; {isFolder ? ' everything' : 'the testcase'} will be deleted <b>permanently</b>{isFolder ? ' including underlying testcases.' : '.'}</i></div>
            </Card>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" style={{ textTransform: 'none', marginTop: '25px', width: '350px' }} onClick={() => handleClick(props.id)}>
                    Delete {props.type} ({isFolder ? KEY_FOLDER(props.id).replace(':',"") : KEY_TESTCASE(props.id).replace(':',"")})</Button>
            </div>
        </Box>
    );
}

