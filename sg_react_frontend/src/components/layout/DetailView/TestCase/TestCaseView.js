import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Box, Card, IconButton, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TestStepText from './TestStepText';
import AddIcon from '@mui/icons-material/Add';
import AddLinkIcon from '@mui/icons-material/AddLink';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { STEP_ACTION, STEP_RESULT } from '../../../constants';
import useRequestResource from '../../../../hooks/useRequestResource';

export default function TestCaseView() {
  const object = useSelector(state => state.object);
  const [steps, setSteps] = useState([]);
  const resourceLabel = "teststeps"
  const { updateOrder } = useRequestResource({ endpoint: "/suite/teststeps/update-order/", resourceLabel: resourceLabel });

  useEffect(() => {
    setSteps(object.test_steps);
  }, [object.test_steps]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
  
    const reorderedSteps = Array.from(steps);
    const [movedStep] = reorderedSteps.splice(result.source.index, 1);
    reorderedSteps.splice(result.destination.index, 0, movedStep);
  
    setSteps(reorderedSteps);
  
    const ids = reorderedSteps.map((step) => step.id);
    const orders = reorderedSteps.map((step, index) => index);
  
    console.log(ids);
    console.log(orders);
  
    updateOrder(ids, orders, () => {
      // Optional: Perform any additional actions after the order is updated
    });
  };

  return (
    <Box>
      <DragDropContext onDragEnd={onDragEnd}>
        {steps.length > 0 ?
          <Box>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'end', marginRight: '10px' }}>
                <IconButton>
                    <AddLinkIcon />
                </IconButton>
                <IconButton>
                    <AddIcon />
                </IconButton>
            </div>
            <Droppable droppableId={object.id.toString()}>
              {(provided, snapshot) => (
                <TableContainer component={Card}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ padding: 4 }}
                >
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight:'bold' }}>Step</TableCell>
                        <TableCell style={{ fontWeight:'bold' }}>Action</TableCell>
                        <TableCell style={{ fontWeight:'bold' }}>Expected Result</TableCell>
                        <TableCell style={{ fontWeight:'bold' }}>Resource</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {steps.map((step, index) => (
                        <Draggable key={step.id.toString()} draggableId={step.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <TableRow
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                padding: 16,
                                margin: 8,
                                minHeight: '50px',
                                backgroundColor: snapshot.isDragging ? 'rgba(42, 181, 255, 0.2)' : 'inherit',
                                borderRadius: 5,
                                color: 'white',
                                ...provided.draggableProps.style
                              }}
                            >
                                <TableCell>{index+1}.</TableCell>
                                <TableCell><TestStepText id={step.id} text={step.action} step={STEP_ACTION}/></TableCell>
                                <TableCell><TestStepText id={step.id} text={step.result} step={STEP_RESULT}/></TableCell>
                                <TableCell><IconButton>{!step.file ? <AddIcon /> : <AttachFileIcon />}</IconButton></TableCell>
                            </TableRow>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </TableBody>
                  </Table>
                  <Box style={{ display: 'flex', justifyContent: 'center' }}>
                    <IconButton style={{ margin: 10 }}>
                      <AddIcon style={{ fontSize: 36 }} />
                    </IconButton>
                  </Box>
                </TableContainer>
              )}
            </Droppable>
          </Box>
        : 
        "Nothing"
        }
      </DragDropContext>
    </Box>
  );
}