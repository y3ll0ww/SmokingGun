import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useRequestResource from "../../../hooks/useRequestResource";
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import ListIcon from '@mui/icons-material/List';
import store from '../Redux/store';
import * as actions from '../Redux/actionTypes';
import DirectoryNode from '../SideMenu/DirectoryNode';

export default function FolderView(props) {
    const type = useSelector((state) => state.type);
    const object = useSelector((state) => state.object);
    const dispatch = useDispatch();
  
    const handleClick = (item) => {
      Promise.all([
        fetch(`/api/suite/${item.type}/${item.id}/`).then((response) =>
          response.json()
        ),
        fetch(`/api/suite/${item.type}/${item.id}/`).then(
          (response) => response.json()
        ),
        fetch(`/api/suite/${item.type}/${item.id}/`).then((response) =>
          response.json()
        ),
      ])
        .then(([data, childFoldersData, testCasesData]) => {
          const object = {
            id: data.id,
            name: data.name,
            type: item.type,
            icon: <FolderIcon />,
            child_folders: childFoldersData.child_folders || [],
            testcases: testCasesData.testcases || [],
          };

          if (item.type === 'folder') {
            dispatch({ type: actions.GET_FOLDER, payload: object });
          } else if (item.type === 'testcase') {
            dispatch({ type: actions.GET_TESTCASE, payload: object });
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };
  
    return (
      <Box>
        <h1>F{object.id}: {object.name}</h1>
        {object.description}
        <List>
          {object?.child_folders?.map((folder) => (
            <div key={folder.key}>
              <ListItem
                button
                onClick={() => handleClick({ type: 'folder', id: folder.id })}
              >
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText>F{folder.id}: {folder.name}</ListItemText>
              </ListItem>
            </div>
          ))}
          {object?.test_cases?.map((testcase) => (
            <div key={testcase.key}>
              <ListItem
                button
                onClick={() => handleClick({ type: 'testcase', id: testcase.id })}
              >
                <ListItemIcon>
                  <ListIcon />
                </ListItemIcon>
                <ListItemText>T{testcase.id}: {testcase.name}</ListItemText>
              </ListItem>
            </div>
          ))}
        </List>
      </Box>
    );
  }