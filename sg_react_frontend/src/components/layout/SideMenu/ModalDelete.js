import React from "react";
import { Box, IconButton, Button, Alert, AlertTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FOLDER, KEY_, TESTCASE, PROJECT } from "../../constants";
import useRequestResource from "../../../hooks/useRequestResource";
import store from "../Redux/store";
import * as actions from "../Redux/actionTypes";
import { useSelector } from "react-redux";

export default function ModalDelete(props) {
    const projectKey = useSelector((state) => state.projects.currentProject.key)
    const resourceLabel = props.type === FOLDER || TESTCASE ? '"' + KEY_(projectKey, props.item_number) + ': ' + props.name + '"' : 
                          'Project "' + props.name + '"';

    const { deleteResource, resource } = useRequestResource({ endpoint: `/suite/${props.type}/delete`, resourceLabel: resourceLabel });

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            props.handleCloseModal();
        }
    };

    const handleClick = (id) => {
        props.handleCloseModal();
        deleteResource(id);
        store.dispatch({ type: actions.TREE_UPDATE, payload: { name: props.name } })
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
            <h2 style={{ textAlign: 'center', marginTop: '-5px'}}>Premanently delete {props.type}</h2>
            <Alert severity="error" style={{ marginBottom: 20, marginTop: -5 }}>
                <AlertTitle><b>WARNING</b></AlertTitle>
                This action cannot be undone; 
                {props.type === TESTCASE ? ' the testcase' : ' everything'} will be deleted <b>permanently</b>
                {props.type === FOLDER ? ' including underlying testcases. ' : '. '}
                {props.type === TESTCASE ? '' : "Nothing can be recovered later, so make sure you don't lose anything you need." }
            </Alert>
            <p style={{ marginTop: '5px', marginBottom: '5px', fontSize: '16px', textAlign: 'justify' }}>
                Are you sure you want to delete the {props.type} 
                <b>&nbsp;"
                    {props.type === PROJECT ? '' : 
                     KEY_(projectKey, props.item_number) + ": "}
                    {props.name}"
                </b>
                {props.type === TESTCASE ? '?' : ' and all of its child components?'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" style={{ textTransform: 'none', marginTop: '25px', width: '350px' }} onClick={() => handleClick(props.id)}>
                    Delete {props.type} 
                    {props.type === PROJECT ? '' : 
                     ' ' + KEY_(projectKey, props.item_number)
                    }
                </Button>
            </div>
        </Box>
    );
}

