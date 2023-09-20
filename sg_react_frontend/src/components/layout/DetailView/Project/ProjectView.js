import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Card, List, ListItem, Modal, Paper } from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import AddIcon from '@mui/icons-material/Add';
import store from '../../Redux/store';
import * as actions from '../../Redux/actionTypes';
import { DATE, MODALSTYLE } from '../../../constants';
import ModalAddProject from './ModalAddProject';


export default function ProjectView() {
    const availableProjects = useSelector(state => state.projects.availableProjects);
    const [projects, setProjects] = useState([]);
    const [modalAdd, setModalAdd] = useState(false);
    
    useEffect(() => {
        setProjects(availableProjects);
    }, [availableProjects])

    const handleSelectProject = (projectId) => {
        store.dispatch({ type: actions.SET_PROJECT, payload: projectId });    
    }

    const handleOpenModal = (projectId) => {
      setModalAdd(true);
    };

    const handleCloseModal = () => {
      setModalAdd(false);
    };

    const addModal = (
      <Modal open={modalAdd} onClose={handleCloseModal}>
        <Paper
          sx={MODALSTYLE}
          style={{ borderRadius: 10, overflowY: "auto", maxHeight: "500px" }}
        >
          <style>{`::-webkit-scrollbar {
            display: none;
          }`}</style>
          <ModalAddProject handleCloseModal={handleCloseModal} />
        </Paper>
      </Modal>
    );
    
    return (
      <Box>
        {addModal}
        <h1>Select a Project</h1>
        <div style={{ marginTop: -15, width: "80%" }}>
          <p>You don't have a project selected. You can select an exsisting project or create a new one.</p>
        </div>
        
        <Card style={{ width: '100%' }}>
          <List>
            {projects.map((project) => (
              <ListItem button onClick={() => handleSelectProject(project.id)} key={project.id}>
                <p><TagIcon style={{ fontSize: 14, color: 'gray', marginRight: 3 }} /> <span style={{ color: 'gray', fontSize: '12px' }}>{project.key}</span> {project.name} <span style={{ fontSize: 12, color: 'gray' }}>| last edited {DATE(project.edited_on)}</span></p>
              </ListItem>
            ))}
            <ListItem button onClick={handleOpenModal}>
              <p>
                <AddIcon style={{ fontSize: 14, color: 'gray', marginRight: 7 }} /> 
                <span style={{ color: 'gray' }}>Add new project</span>
              </p>
            </ListItem>
          </List>
        </Card>
      </Box>
    
    );
}