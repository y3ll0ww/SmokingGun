import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Card, IconButton, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TestStepText from './TestStepText';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import AddLinkIcon from '@mui/icons-material/AddLink';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { STEP_ACTION, STEP_RESULT } from '../../../constants';
import useRequestResource from '../../../../hooks/useRequestResource';
import store from '../../Redux/store';
import * as actions from '../../Redux/actionTypes';

export default function TestCaseView() {
  const object = useSelector(state => state.object);
  const [steps, setSteps] = useState([]);
  const storeSteps = useSelector(state => state.object.test_steps);
  const { updateOrder } = useRequestResource({ endpoint: '/suite/teststeps/update-order/', resourceLabel: 'teststeps' });
  const { addResource } = useRequestResource({ endpoint: '/suite/teststep/create/' });
  const { deleteResource } = useRequestResource({ endpoint: '/suite/teststep/delete', resourceLabel: 'Teststep' });
  const { getResource, resource } = useRequestResource({ endpoint: `/suite/testcase` });
  const databaseIds = storeSteps.map(step => step.id);

  useEffect(() => {
    setSteps(storeSteps);
  }, [storeSteps]);

  function reOrderSteps(result, currentSteps) {
    const { source, destination } = result;
    if (!destination) return;

    const reorderedSteps = Array.from(currentSteps);
    const [movedStep] = reorderedSteps.splice(source.index, 1);
    reorderedSteps.splice(destination.index, 0, movedStep);

    const updatedSteps = reorderedSteps.map((step, index) => ({
      ...step,
      order: index,
    }));

    const ids = updatedSteps.map(step => step.id);
    const orders = updatedSteps.map(step => step.order);

    updateOrder(ids, orders, () => {});
    store.dispatch({ type: actions.TESTSTEPS_REORDER_STEPS, payload: updatedSteps });
  }

  const onDragEnd = (result) => {
    if (!result.destination) return;

    if (storeSteps.length > databaseIds.length) {
      let promises = [];

      for (const step of storeSteps) {
        if (databaseIds.includes(step.id)) {
          continue;
        } else {
          const values = {
            action: step.action,
            result: step.result,
            testcase: object.id,
          };

          const promise = addResource(values);
          promises.push(promise);
        }
      }

      Promise.all(promises)
        .then(() => getResource(object.id))
        .then((res) => {
          reOrderSteps(result, res.test_steps);
        });
    } else {
      reOrderSteps(result, storeSteps);
    }
  };

  const handleAddNewLine = () => {
    const order = storeSteps.length;
    store.dispatch({ type: actions.TESTSTEPS_ADD_NEW_LINE, payload: { action: '\u200B', result: '\u200B', order: order } });
    setSteps([...storeSteps]);
  };

  const handleDelete = (id) => {
    if (id in databaseIds) {
      deleteResource(id);
    }
    const stepsMinusDeleted = steps.filter(step => step.id !== id);
    store.dispatch({ type: actions.TESTSTEPS_DELETE_STEP, payload: stepsMinusDeleted });
  }

  const TableHead = () => {
    return (
      <TableRow>
        <TableCell style={{ fontWeight: 'bold' }}>Step</TableCell>
        <TableCell style={{ fontWeight: 'bold' }}>Action</TableCell>
        <TableCell style={{ fontWeight: 'bold' }}>Expected Result</TableCell>
        <TableCell style={{ fontWeight: 'bold' }}></TableCell>
      </TableRow>
    );
  }

  return (
    <Box>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'end', marginRight: '10px' }}>
          <IconButton>
            <AddLinkIcon />
          </IconButton>
          <IconButton>
            <AddIcon />
          </IconButton>
        </div>
        {steps.length > 0 ? (
          <Box>
            <Droppable droppableId={object.id.toString()}>
              {(provided, snapshot) => (
                <TableContainer
                  component={Card}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ padding: 4 }}
                >
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      {TableHead}
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
                                ...provided.draggableProps.style,
                              }}
                            >
                              <TableCell>{index + 1}.</TableCell>
                              <TableCell>
                                <TestStepText id={step.id} text={step.action} step={STEP_ACTION} />
                              </TableCell>
                              <TableCell>
                                <TestStepText id={step.id} text={step.result} step={STEP_RESULT} />
                              </TableCell>
                              <TableCell>
                                <IconButton style={{ padding: 0, margin: 2 }}>{!step.file ? <UploadIcon style={{ fontSize: 20 }}/> : <AttachFileIcon style={{ fontSize: 20 }}/>}</IconButton>
                                <IconButton style={{ padding: 0, margin: 2 }} onClick={() => handleDelete(step.id)}><DeleteForeverIcon style={{ fontSize: 20 }}/></IconButton>
                              </TableCell>
                            </TableRow>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </TableBody>
                  </Table>
                  <Box style={{ display: 'flex', justifyContent: 'center' }}>
                    <IconButton style={{ margin: 10 }}>
                      <AddIcon style={{ fontSize: 36 }} onClick={handleAddNewLine} />
                    </IconButton>
                  </Box>
                </TableContainer>
              )}
            </Droppable>
          </Box>
        ) : (
          <TableContainer component={Card} style={{ padding: 4 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                {TableHead}
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4}>
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                      <IconButton style={{ margin: 10 }}>
                        <AddIcon style={{ fontSize: 36 }} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DragDropContext>
    </Box>
  );
}