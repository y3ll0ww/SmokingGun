import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Card, List, ListItem, IconButton, Modal, Paper } from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import AddIcon from '@mui/icons-material/Add';
import store from '../../Redux/store';
import * as actions from '../../Redux/actionTypes';


export default function ProjectView(props) {
    const availableProjects = useSelector(state => state.projects.availableProjects);
    const [projects, setProjects] = useState([]);
    
    useEffect(() => {
        console.log(availableProjects);
        setProjects(availableProjects);
    }, [availableProjects])

    const handleSelectProject = (projectId) => {
        store.dispatch({ type: actions.SET_PROJECT, payload: projectId });
        
    }

    const handleCreateProject = () => {
        console.log("CREATE");
    }
    
    return (
      <Box>
        <h1>Select a Project</h1>
        <div style={{ marginTop: -15, width: "80%" }}>
          <p>You don't have a project selected. You can select an exsisting project or create a new one.</p>
        </div>
        
        <Card style={{ width: '100%' }}>
          <List>
            {projects.map((project) => (
              <ListItem button onClick={() => handleSelectProject(project.id)}>
                <p><TagIcon style={{ fontSize: 14, color: 'gray', marginRight: 3 }} /> {project.name}</p>
              </ListItem>
            ))}
            <ListItem button onClick={handleCreateProject}>
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