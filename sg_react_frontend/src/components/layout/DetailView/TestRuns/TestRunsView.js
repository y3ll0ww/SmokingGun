import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Card, List, ListItem, ListItemIcon, ListItemText, Modal, Paper, IconButton } from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import store from '../../Redux/store';
import * as actions from '../../Redux/actionTypes';
import { DETAILVIEW, DIRECTORY, TESTCASE, KEY_TESTCASE, FOLDER, SELECTION_COLOR, PRIMARY_COLOR, SECONDARY_COLOR, PASSED_COLOR, DATE } from '../../../constants';
import useRequestResource from '../../../../hooks/useRequestResource';


export default function TestRunsView() {
  const object = useSelector((state) => state.object);
  const state = useSelector((state) => state);
  const projectId = useSelector((state) => state.projects.currentProject.id);
  const [testruns, setTestRuns] = useState();


  const { getResourceWithParams, resource } = useRequestResource({ endpoint: `/suite/testruns` });

  useEffect(() => {
    let values = {};

    switch (object.type) {
      case TESTCASE:
        values = {
          testcase: object.id
        };
        break;
      case FOLDER:
        values = {
          parent_folder: object.id
        };
        break;
      default:
        values = {
          project: projectId
        };
    };

    getResourceWithParams(values);
  }, [object]);

  useEffect(() => {
    setTestRuns(resource);
  }, [resource]);

  useEffect(() => {
    console.log(testruns);
  }, [testruns]);

  const handleSwitchView = () => {
      store.dispatch({ type: actions.SET_VIEW, payload: { location: DETAILVIEW, view: DIRECTORY } })
  }
  
  return (
    <Box>
      <Button onClick={handleSwitchView}>Switch Back</Button>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {testruns && testruns.length > 0 ? (
          testruns.map((testrun, index) => (
            <ListItem button onClick={handleSwitchView} style={{ paddingLeft: 15 }}>
              <ListItemIcon style={{ padding: 5 }}>
                {testrun.passed ? <CheckCircleIcon style={{color: PASSED_COLOR}}/> : <CancelIcon style={{color: PRIMARY_COLOR}}/>}
              </ListItemIcon>
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <ListItemText 
                  primary={
                    <span>
                      <span style={{ color: 'gray', fontSize: '12px' }}>{KEY_TESTCASE(testrun.project_key, testrun.testcase_number)} </span>
                      {testrun.testcase_name} {testrun.id}
                    </span>
                  } 
                />
                <ListItemText style={{ marginLeft: 'auto', textAlign: 'right', marginRight: 15 }}
                  primary={
                    <span style={{ color: 'gray', fontWeight: 'bold' }}>
                      {DATE(testrun.timestamp, true)}
                    </span>
                  }
                />
              </div>
            </ListItem>
          ))
        ) : (
          <p>No testruns</p>
        )}
      </List>

    
      
    </Box>
  );
}