import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import { FOLDER, TESTCASE, ROOT, KEY_FOLDER, KEY_TESTCASE } from '../../constants';
import DataObjectIcon from '@mui/icons-material/DataObject';

export default function Title() {
    const type = useSelector(state => state.type);
    const object = useSelector(state => state.object);
    const name = object.name ? object.name : 'Project name';

    const created = new Date(object.created_on).toLocaleString();
    const edited = new Date(object.edited_on).toLocaleString();
    
    return (
        <Box>
            <h1 style={{ marginBottom: 0 }}>
                <span style={{ color: 'gray', fontSize: '22px' }}>
                    {type === FOLDER ? KEY_FOLDER(object.id) : 
                     type === TESTCASE ? KEY_TESTCASE(object.id) : 
                     type === ROOT ? <DataObjectIcon /> :
                     ''}
                </span> {name}
            </h1>
            <span style={{ color: 'gray', fontSize: '12px' }}>Created on <b>{created}</b> - Last edited on <b>{edited}</b></span>
        </Box>
    );
}