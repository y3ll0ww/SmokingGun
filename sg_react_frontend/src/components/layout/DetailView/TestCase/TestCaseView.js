import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Box, Card } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function TestCaseView() {
  const object = useSelector(state => state.object);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    setSteps(object.test_steps);
  }, [object.test_steps]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedSteps = Array.from(steps);
    const [movedStep] = reorderedSteps.splice(result.source.index, 1);
    reorderedSteps.splice(result.destination.index, 0, movedStep);

    setSteps(reorderedSteps);
  };

  return (
    <Box>
      <DragDropContext onDragEnd={onDragEnd}>
        {steps.length > 0 ?
        <Droppable droppableId={object.id.toString()}>
          {(provided, snapshot) => (
            <Card
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                background: snapshot.isDraggingOver ? 'lightblue' : 'white',
                padding: 4,
              }}
            >
              {steps.map((step, index) => (
                <Draggable key={step.id.toString()} draggableId={step.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        userSelect: 'none',
                        padding: 16,
                        margin: 8,
                        minHeight: '50px',
                        backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
                        color: 'white',
                        ...provided.draggableProps.style
                      }}
                    >
                      {index+1} {step.id}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Card>
          )}
        </Droppable>
        : "Nothing" }
      </DragDropContext>
    </Box>
  );
}