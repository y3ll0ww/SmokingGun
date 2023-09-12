import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Card, List, ListItem } from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import AddIcon from '@mui/icons-material/Add';
import store from '../../Redux/store';
import * as actions from '../../Redux/actionTypes';
import { DATE } from '../../../constants';


export default function ProjectView() {
    const availableProjects = useSelector(state => state.projects.availableProjects);
    const [projects, setProjects] = useState([]);
    
    useEffect(() => {
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
                <p><TagIcon style={{ fontSize: 14, color: 'gray', marginRight: 3 }} /> <span style={{ color: 'gray', fontSize: '12px' }}>{project.key}</span> {project.name} <span style={{ fontSize: 12, color: 'gray' }}>| last edited {DATE(project.edited_on)}</span></p>
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