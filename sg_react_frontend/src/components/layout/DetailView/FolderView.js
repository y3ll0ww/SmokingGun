import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, List } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import * as actions from '../Redux/actionTypes';
import DirectoryNode from '../SideMenu/DirectoryNode';
import { FOLDER, TESTCASE } from '../../constants';

export default function FolderView(props) {
    const object = useSelector((state) => state.object);
     
    return (
      <Card>
        <List>
          {object?.child_folders?.map((folder) => (
            <DirectoryNode key={folder.id} item={{ ...folder, type: FOLDER }} padding={20} type={FOLDER} />
          ))}
          {object?.test_cases?.map((testcase) => (
            <DirectoryNode key={testcase.id} item={{ ...testcase, type: TESTCASE }} padding={20} type={TESTCASE} />
          ))}
        </List>
      </Card>
    );
  }