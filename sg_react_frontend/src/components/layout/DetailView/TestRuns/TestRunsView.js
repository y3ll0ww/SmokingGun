import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Card, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import FlakyIcon from '@mui/icons-material/Flaky';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import store from '../../Redux/store';
import * as actions from '../../Redux/actionTypes';
import { DETAILVIEW, DIRECTORY, TESTCASE, KEY_TESTCASE, FOLDER, SELECTION_COLOR, PRIMARY_COLOR, SECONDARY_COLOR, PASSED_COLOR, DATE, TESTRUNDETAILS } from '../../../constants';
import useRequestResource from '../../../../hooks/useRequestResource';
import { CircularProgress } from '@mui/material'


export default function TestRunsView() {
  const object = useSelector((state) => state.object);
  const projectId = useSelector((state) => state.projects.currentProject.id);
  const [testruns, setTestRuns] = useState();
  const [loading, setLoading] = useState(true);

  const { getResourceWithParams, resource: runs } = useRequestResource({ endpoint: `/suite/testruns` });
  const { getResource, resource: details } = useRequestResource({ endpoint: `/suite/testrun` });

  useEffect(() => {
    let values = {};
    setLoading(true);

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
    setTestRuns(runs);
  }, [runs]);

  useEffect(() => {
    if (testruns) {
      setLoading(false);
    }
  }, [testruns]);

  const handleSwitchView = () => {
    store.dispatch({ type: actions.SET_VIEW, payload: { location: DETAILVIEW, view: DIRECTORY } })
  }

  const handleClick = (id) => {
    getResource(id);
  }

  useEffect(() => {
    if (details) {
      console.log(details);
      store.dispatch({ type: actions.GET_TESTRUN, payload: details });
      store.dispatch({ type: actions.SET_VIEW, payload: { location: DETAILVIEW, view: TESTRUNDETAILS } });
    }
  }, [details])
  
  return (
    <Box>
      <IconButton onClick={handleSwitchView}><KeyboardReturnIcon style={{ fontSize: 20, margin: 5, color: PRIMARY_COLOR }}/></IconButton>
      <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2 }}>
        {loading ? (
          <ListItem style={{ justifyContent: 'center' }}>
            <CircularProgress style={{ margin: 30 }}/>
          </ListItem>
        ) : (
          testruns && testruns.length > 0 ? (
            testruns.map((testrun, index) => (
              <ListItem button onClick={() => handleClick(testrun.id)} style={{ paddingLeft: 15 }}>
                <ListItemIcon style={{ padding: 5 }}>
                  {testrun.passed ? <CheckCircleIcon style={{color: PASSED_COLOR}}/> : <CancelIcon style={{color: PRIMARY_COLOR}}/>}
                </ListItemIcon>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <ListItemText 
                    primary={
                      <span>
                        <span style={{ color: 'gray', fontSize: '12px' }}>{KEY_TESTCASE(testrun.project_key, testrun.testcase_number)} </span>
                        {testrun.testcase_name}
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
            <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', backgroundImage: 'none' }} style={{ padding: 80 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <FlakyIcon style={{ color: 'silver', fontSize: '120px', color: PRIMARY_COLOR }} />
                    <h2>No contents</h2>
                    <p style={{ marginTop: '0px', textAlign: 'center', color: 'gray' }}>
                        This {object.type} doesn't contain any {object.type === TESTCASE ? ('') : (<span>testcases with </span>)}<b>testruns</b>.<br />
                        <b>Testruns</b> will be shown here whenever they've been executed.
                    </p>
                    <Button 
                      variant="outlined"
                      style={{ marginTop: 15, marginBottom: 10, textTransform: 'none' }}
                      onClick={handleSwitchView}>
                        Return
                    </Button>
                </div>
            </Card>
          )
        )}

      </List>

    
      
    </Box>
  );
}