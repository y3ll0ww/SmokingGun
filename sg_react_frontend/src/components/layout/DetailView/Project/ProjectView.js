import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Card, List, ListItem, Modal, Paper, IconButton } from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import AddIcon from '@mui/icons-material/Add';
import store from '../../Redux/store';
import * as actions from '../../Redux/actionTypes';
import { DATE, MODALSTYLE, PROJECT } from '../../../constants';
import ModalAddProject from '../Modal/ModalAddProject';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NodeMenu from '../../SideMenu/NodeMenu';
import ModalDelete from '../Modal/ModalDelete';


export default function ProjectView() {
    const availableProjects = useSelector(state => state.projects.availableProjects);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState({});
    const [modalAdd, setModalAdd] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    
    useEffect(() => {
        const updatedProjects = availableProjects.map(project => ({
          ...project,
          type: 'project'
        }));

        setProjects(updatedProjects);
    }, [availableProjects])

    const handleSelectProject = (projectId) => {
        store.dispatch({ type: actions.SET_PROJECT, payload: projectId });    
    }

    const handleOpenOptions = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleCloseOptions = () => {
      setAnchorEl(null);
    };

    const handleOpenModalAdd = () => {
      setModalAdd(true);
    };

    const handleCloseModalAdd = () => {
      setModalAdd(false);
    };

    const handleOpenModalDelete = () => {
      setModalDelete(true);
    }
  
    const handleCloseModalDelete = () => {
      setModalDelete(false);
    }

    const addModal = (
      <Modal open={modalAdd} onClose={handleCloseModalAdd}>
        <Paper
          sx={MODALSTYLE}
          style={{ borderRadius: 10, overflowY: "auto", maxHeight: "500px" }}
        >
          <style>{`::-webkit-scrollbar {
            display: none;
          }`}</style>
          <ModalAddProject handleCloseModal={handleCloseModalAdd} />
        </Paper>
      </Modal>
    );

    const deleteModal = (
      <Modal open={modalDelete} onClose={handleCloseModalDelete}>
          <Paper sx={MODALSTYLE}
               style={{ borderRadius: 10, overflowY:'auto', maxHeight:"500px", width: "500px" }}>      
              <style>
                  {`::-webkit-scrollbar {
                      display: none;
                  }`}
              </style>
              <ModalDelete handleCloseModal={handleCloseModalDelete} name={`${selectedProject.key}: ${selectedProject.name}`} type={selectedProject.type} id={selectedProject.id} />
          </Paper>
      </Modal>
    );
    
    return (
      <Box>
        {addModal}
        {deleteModal}
        <h1>Select a Project</h1>
        <div style={{ marginTop: -15, width: "80%" }}>
          <p>You don't have a project selected. You can select an existing project or create a new one.</p>
        </div>
        <Card style={{ width: '100%' }}>
          <List>
            {projects.map((project) => (
              <ListItem
                button
                key={project.id}
                style={{ display: 'flex', justifyContent: 'space-between' }}
                onClick={() => handleSelectProject(project.id)}
              >
                <div>
                  <p>
                    <span style={{ color: 'gray', fontSize: '12px' }}>{project.key}</span> {project.name} <span style={{ fontSize: 12, color: 'gray' }}>| last edited {DATE(project.edited_on)}</span>
                  </p>
                </div>
                <IconButton onClick={(event) => { event.stopPropagation(); handleOpenOptions(event); setSelectedProject(project); }} sx={{ padding: "3px", margin: "-2px" }}>
                  <MoreVertIcon sx={{ fontSize: "18px" }} />
                </IconButton>
                <NodeMenu item={project} anchorEl={anchorEl} handleCloseOptions={(event) => { event.stopPropagation(); handleCloseOptions(); }} handleOpenModalDelete={handleOpenModalDelete} />
              </ListItem>
            ))}
            <ListItem button onClick={handleOpenModalAdd}>
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