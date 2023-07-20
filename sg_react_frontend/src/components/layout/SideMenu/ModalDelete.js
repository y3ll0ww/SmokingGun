import React from "react";
import { Box, IconButton, Button, Alert, AlertTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FOLDER, KEY_FOLDER, KEY_TESTCASE, TESTCASE, PROJECT } from "../../constants";
import useRequestResource from "../../../hooks/useRequestResource";
import store from "../Redux/store";
import * as actions from "../Redux/actionTypes";

export default function ModalDelete(props) {
    const resourceLabel = props.type === FOLDER ? '"' + KEY_FOLDER(props.id) + ' ' + props.name + '"' : 
                          props.typ === TESTCASE ? '"' + KEY_TESTCASE(props.id) + ' ' + props.name + '"' :
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
                    props.type === FOLDER ? KEY_FOLDER(props.id) + " " : 
                    KEY_TESTCASE(props.id) + " "}
                    {props.name}"
                </b>
                {props.type === TESTCASE ? '?' : ' and all of its child components?'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" style={{ textTransform: 'none', marginTop: '25px', width: '350px' }} onClick={() => handleClick(props.id)}>
                    Delete {props.type} 
                    {props.type === PROJECT ? '' : 
                        (props.type === FOLDER ? KEY_FOLDER(props.id).replace(':',"") : 
                        props.type === TESTCASE ? KEY_TESTCASE(props.id).replace(':',"") :
                        '')
                    }
                </Button>
            </div>
        </Box>
    );
}

