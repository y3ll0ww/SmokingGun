import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Box, TextField } from '@mui/material';
import useRequestResource from "../../../../hooks/useRequestResource";
import store from '../../Redux/store';
import * as actions from '../../Redux/actionTypes';

export default function TestStepText(props) {
    const [text, setText] = useState(props.text);
    const [originalText, setOriginalText] = useState(props.text);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(false);
    const newStepIds = useSelector(state => state.steps.newStepIds);
    const inputRef = useRef(null);
    const resourceLabel = "Teststep";
    const { updateResource } = useRequestResource({ endpoint: `/suite/teststep/update`, resourceLabel: resourceLabel });
    const { addResource } = useRequestResource({ endpoint: "/suite/teststep/create", resourceLabel: resourceLabel });

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            if (text.length > 500) {
                event.preventDefault();
                setError("Use at least 5 to 500 characters.");
            } else if (text === originalText) {
                handleCancel();
            }
            else {
                if (!newStepIds.includes(props.id)) {
                    updateResource(props.id, { [props.step]: text });
                    setOriginalText(text);
                } else {
                    store.dispatch({ type: actions.TESTSTEPS_ADD_NEW_LINE, payload: props.id });
                    addResource({ testcase: props.tc, [props.step]: text });
                }
                setIsEditing(false);
                setError("");
            }
        }
        if (event.key === "Escape") {
            handleCancel();
        }
    };

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
        handleKeyDown({ key: "Enter" });
    }

    useEffect(() => {
        if (isEditing && inputRef.current) {
          inputRef.current.selectionStart = inputRef.current.value.length;
          inputRef.current.selectionEnd = inputRef.current.value.length;
          inputRef.current.focus();
        }
    }, [isEditing]);

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
            <Box onClick={() => setIsEditing(true)}>
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