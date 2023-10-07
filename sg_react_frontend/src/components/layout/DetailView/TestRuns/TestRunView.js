import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Card, List, ListItem, Modal, Paper, IconButton } from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import AddIcon from '@mui/icons-material/Add';
import store from '../../Redux/store';
import * as actions from '../../Redux/actionTypes';
import { DETAILVIEW, DIRECTORY } from '../../../constants';


export default function TestRunView() {

    const handleSwitchView = () => {
        store.dispatch({ type: actions.SET_VIEW, payload: { location: DETAILVIEW, view: DIRECTORY } })
    }
    
    return (
      <Box>
        <Button onClick={handleSwitchView}>Switch Back</Button>
      </Box>
    );
}