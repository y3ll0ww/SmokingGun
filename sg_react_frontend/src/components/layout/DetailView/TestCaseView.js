import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Box } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function TestCaseView(props) {
    const steps = useSelector(state => state.object.test_steps);

    return (
        <Box>
            {steps.map((step) => (
                <div key={step.id}>
                    <p>{step.order + 1}. {step.action} - {step.result}</p>
                </div>
            ))}          
        </Box>
    );
}