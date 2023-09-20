import React from "react";
import { Box, IconButton, Button, Alert, AlertTitle, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FOLDER, TESTCASE } from "../../../constants";
import useRequestResource from "../../../../hooks/useRequestResource";
import store from "../../Redux/store";
import * as actions from "../../Redux/actionTypes";


export default function ModalDeleteBulk(props) {
    const folders = props.items.filter(item => item.split('_')[0] === FOLDER);
    const testcases = props.items.filter(item => item.split('_')[0] === TESTCASE);
    const resourceLabel = `${folders.length} folders and ${testcases.length} testcases`;

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

    const itemList = (items) => {
        let string = ''

        for (const item of items) {
            if (items.indexOf(item) > 0) {
                string += ", "
            }
            string += `<i>${item.split('_')[2]}</i>`;
        }

        return <span dangerouslySetInnerHTML={{ __html: string }} />;
    }

    const verificationString = () => {
        let string = 'Are you sure you want to <b>permanently</b> delete '
        const numFolders = folders.length;
        const numTestcases = testcases.length;

        if (numFolders > 0) {
            string += `<b>${numFolders}</b> folder${numFolders > 1 ? 's' : ''}`;
            if (numTestcases > 0) {
                string += ' and ';
            }
        }
        if (numTestcases > 0) {
            string += `<b>${numTestcases}</b> testcase${numTestcases > 1 ? 's' : ''}`;
        }

        string += '?';

        return <p dangerouslySetInnerHTML={{ __html: string }} />;
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
            
            {folders.length > 0 || testcases.length > 0 ? (
                <div>
                    <p style={{ marginTop: '5px', marginBottom: '5px', fontSize: '16px', textAlign: 'justify' }}>
                        {verificationString()}
                    </p>
                    <Paper style={{ padding: 10, marginBottom: 25 }}>             
                        {folders.length > 0 ? (
                            <Box>
                                <p><b>Folder{folders.length > 1 ? 's' : ''} ({folders.length})</b></p>
                                <p style={{ marginTop: -20 }}>{itemList(folders)}</p>
                            </Box>
                        ) : ("")}
                        {testcases.length > 0 ? (
                            <Box>
                                <p><b>Testcase{testcases.length > 1 ? 's' : ''} ({testcases.length})</b></p>
                                <p style={{ marginTop: -20 }}>{itemList(testcases)}</p>
                            </Box>
                        ) : ("")}
                    </Paper>
                    <Alert severity="error" style={{ marginBottom: 15, marginTop: -5 }}>
                        <AlertTitle><b>WARNING</b></AlertTitle>
                        This action cannot be undone; <b>Nothing can be recovered later</b>.
                    </Alert>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" style={{ textTransform: 'none', marginTop: '5px', width: '350px' }} onClick={() => handleClick(props.id)}>
                            Delete selection
                        </Button>
                    </div>
                </div>
            ) : (
                <div>You don't have anything selected</div>
            )}
        </Box>
    );
}

