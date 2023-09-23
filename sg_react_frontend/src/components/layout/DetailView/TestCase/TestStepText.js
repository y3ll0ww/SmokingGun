import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Box, TextField } from '@mui/material';
import useRequestResource from "../../../../hooks/useRequestResource";
import store from '../../Redux/store';
import * as actions from '../../Redux/actionTypes';
import { STEP_ACTION, STEP_RESULT } from "../../../constants";

export default function TestStepText(props) {
    const [text, setText] = useState(props.text || "");
    const [originalText, setOriginalText] = useState(props.text);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(false);
    const newStepIds = useSelector(state => state.steps.newStepIds);
    const storeSteps = useSelector(state => state.object.test_steps);
    const storeEditing = useSelector(state => state.steps.editing);
    const inputRef = useRef(null);
    const resourceLabel = "Teststep";
    const { updateResource } = useRequestResource({ endpoint: `/suite/teststep/update`, resourceLabel: resourceLabel });
    const { addResource } = useRequestResource({ endpoint: "/suite/teststep/create", resourceLabel: resourceLabel });


    const handleKeyDown = (event) => {
        if (event.key === "Tab") {
            event.preventDefault();
            handleNewLine(true);
            handleNewFocus(props.id);            
        }
        if (event.key === "Enter") {
            event.preventDefault();
            handleNewLine();
        }
        if (event.key === "Escape") {
            handleCancel();
        }
    };

    const handleNewLine = (tab=false) => {
        if (text.length > 500) {
            setError("Use at least 5 to 500 characters.");
        } else if (text === originalText) {
            handleCancel();
        } else {
            if (!newStepIds.includes(props.id)) {
                updateResource(props.id, { [props.step]: text });
                setOriginalText(text);
            } else {
                // When STEP_RESULT => No new line and focus
                store.dispatch({ type: actions.TESTSTEPS_ADD_NEW_LINE, payload: props.id });
                addResource({ testcase: props.tc, [props.step]: text }, (response) => {
                    if (tab) {
                        handleNewFocus(response.id);
                    }
                });
            }
            setIsEditing(false);
            setError("");
        }
    }

    const handleNewFocus = (stepId) => {
        if (props.step === STEP_ACTION) {
            store.dispatch({ type: actions.TESTSTEPS_CHANGE_EDITING, payload: { id: stepId, step: STEP_RESULT }});
        } else {
            for (const step of storeSteps) {
                if (stepId === step.id) {
                    const index = storeSteps.indexOf(step);
                    try {
                        
                        const newId = storeSteps[index+1].id;
                        store.dispatch({ type: actions.TESTSTEPS_CHANGE_EDITING, payload: { id: newId, step: STEP_ACTION }});
                    } catch(e) {
                        props.addStep();
                    }
                }
            }
        }
    }

    const handleChange = (event) => {
        const updatedText = event.target.value;
        setText(updatedText);
    };

    const handleCancel = () => {
        setError("");
        setIsEditing(false);
        setText(originalText);
    };

    const handleClick = () => {
        handleNewLine();
    }

    const handleEditing = () => {
        setIsEditing(true);
        store.dispatch({ type: actions.TESTSTEPS_CHANGE_EDITING, payload: { id: props.id, step: props.step }});
    }

    useEffect(() => {
        if (isEditing && inputRef.current) {
          inputRef.current.selectionStart = inputRef.current.value.length;
          inputRef.current.selectionEnd = inputRef.current.value.length;
          inputRef.current.focus();
        }
    }, [isEditing]);

    useEffect(() => {
        try {
            if (storeEditing.id === props.id && storeEditing.step === props.step) {
                setIsEditing(true);
            }
        } catch (TypeError) {}
        
    }, [storeEditing])

    return (
        <Box>
            {isEditing ? (
                <TextField
                  value={text}
                  multiline
                  fullWidth
                  autoFocus
                  variant="standard"
                  error={!!error}
                  onBlur={handleClick}
                  onKeyDown={handleKeyDown}
                  onChange={handleChange}
                  inputRef={inputRef}
                  inputProps={{
                        maxLength: 500,
                        style: {
                            fontSize: 'inherit',
                            fontWeight: 'inherit',
                            lineHeight: 'inherit',
                            padding: '0px'
                        },
                  }}
                  InputProps={{
                        style: {
                            fontSize: 'inherit',
                        },
                  }}
                />
            ) : (
            <Box onClick={handleEditing}>
                {text !== "" && text !== undefined ? (
                  text
                ) : (
                    '\u200B'
                )}
            </Box>
            )}
        </Box>
    );
}