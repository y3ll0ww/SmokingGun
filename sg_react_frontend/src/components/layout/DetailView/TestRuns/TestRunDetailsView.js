import React, { useState, useEffect } from 'react';
import { Box, Button, Chip, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { DETAILVIEW, DIRECTORY, TESTCASE, TESTRUNS, KEY_TESTCASE, FOLDER, SELECTION_COLOR, PRIMARY_COLOR, SECONDARY_COLOR, PASSED_COLOR, DATE, TESTRUNDETAILS, SKIPPED_COLOR } from '../../../constants';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import NextPlanIcon from '@mui/icons-material/NextPlan';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCommentIcon from '@mui/icons-material/AddComment';
import CommentIcon from '@mui/icons-material/Comment';
import ReplayIcon from '@mui/icons-material/Replay';
import { useSelector } from 'react-redux';
import store from '../../Redux/store';
import * as actions from '../../Redux/actionTypes';

export default function TestRunDetailsView() {
    const object = useSelector((state) => state.object);
    const run = useSelector((state) => state.testrun);
    
    const handleSwitchView = () => {
        store.dispatch({ type: actions.SET_VIEW, payload: { location: DETAILVIEW, view: TESTRUNS } })
    }

    console.log(run);
    
    return (
        <Box>
            

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: -0.7, marginBottom: -0.7 }}>
                <IconButton onClick={handleSwitchView}><KeyboardReturnIcon style={{ fontSize: 20, margin: 5, color: PRIMARY_COLOR }}/></IconButton>
                <h2 style={{ fontSize: '18px' }}>
                    <span style={{ color: 'gray', fontSize: '14px' }}>{KEY_TESTCASE(run.project_key, run.testcase_number)}</span> {run.testcase_name}
                </h2>
                <Chip style={{
                        color: run.passed ? PASSED_COLOR : PRIMARY_COLOR, 
                        borderColor: run.passed ? PASSED_COLOR : PRIMARY_COLOR,
                        fontSize: '12px'
                    }}
                    size="small"
                    variant="outlined"
                    icon={run.passed ? <CheckCircleIcon style={{ color: PASSED_COLOR }}/> : <CancelIcon style={{ color: PRIMARY_COLOR }} />}
                    label={<span>{DATE(run.timestamp)}: {run.id} - Test {run.passed ? "Passed" : "Failed"}</span>}
                />
            </Box>

            <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2 }}>
                <ListItem key='header' sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                    <ListItemIcon>
                        <IconButton  style={{ padding: 5 }}>
                            <ReplayIcon />
                        </IconButton>
                    </ListItemIcon>
                    <ListItemText sx={{ flex: 1, marginLeft: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}
                        primary={ <span style={{ fontWeight: 'bold' }}>Action</span> }
                    />
                    <ListItemText sx={{ flex: 1, marginLeft: 2, overflow: 'hidden', textOverflow: 'ellipsis' }} 
                        primary={ <span style={{ fontWeight: 'bold' }}>Expected Result</span> }
                    />
                    <ListItemText sx={{ flex: 0.15, marginLeft: 2 }} />
                </ListItem>
                {run.steps && run.steps.length > 0 ? (
                    run.steps.map((step, index) => (
                        <ListItem key={step.id} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                            <ListItemIcon style={{ padding: 5, alignSelf: 'center' }}>
                                {step.executed ? (
                                    step.passed ? <CheckCircleIcon style={{color: PASSED_COLOR}}/> : <CancelIcon style={{color: PRIMARY_COLOR}}/>
                                ) : (
                                    <NextPlanIcon style={{ color: SKIPPED_COLOR }} />
                                )}
                            </ListItemIcon>
                            <ListItemText sx={{ flex: 1, marginLeft: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}
                                primary={ <span style={{ fontSize: '14px' }}>{step.details.action}</span> }
                            />
                            <ListItemText sx={{ flex: 1, marginLeft: 2, overflow: 'hidden', textOverflow: 'ellipsis' }} 
                                primary={ <span style={{ fontSize: '14px' }}>{step.details.result}</span> }
                            />
                            
                            <ListItemText sx={{ flex: 0.1, marginLeft: 2, alignSelf: 'center', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                primary={
                                    <IconButton size='small' style={{ color: 'gray' }}>
                                        {step.comment ? <CommentIcon /> : <AddCommentIcon />}
                                    </IconButton>
                                }
                            />
                      </ListItem>
                    ))
                ) : ( 
                    <div></div>
                )}
            </List>
        </Box>
    )
}