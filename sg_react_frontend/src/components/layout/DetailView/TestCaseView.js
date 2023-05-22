import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ListIcon from '@mui/icons-material/List';

export default function TestCaseView(props) {
    return (
        <Box>
            <h1>T{props.object.id}: {props.object.name}</h1>
            {props.object.description}
        </Box>
    );
}