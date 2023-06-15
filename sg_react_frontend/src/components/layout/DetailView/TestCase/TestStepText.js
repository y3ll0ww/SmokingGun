import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Box, TextField } from '@mui/material';
import useRequestResource from "../../../../hooks/useRequestResource";

export default function TestStepText(props) {
    const [text, setText] = useState(props.text);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(false);
    const databaseIds = useSelector(state => state.testStepIds);
    const steps = useSelector(state => state.object.test_steps);
    const inputRef = useRef(null);
    const resourceLabel = "Teststep";
    const { updateResource } = useRequestResource({ endpoint: `/suite/teststep/update`, resourceLabel: resourceLabel });

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            if (text.length > 500) {
                event.preventDefault();
                setError("Use at least 5 to 500 characters.");
            } else if (text === props.text) {
                handleCancel();
            }
            else {
                if (databaseIds.length < steps) {
                    updateResource(props.id, { [props.step]: text });
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
        console.log('cancel');
        setError("");
        setIsEditing(false);
        setText(props.text);
    };

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
                  onBlur={handleCancel}
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