import React, { useEffect, useState } from "react";
import { Box, List, Alert, AlertTitle, ListItem, ListItemIcon, ListItemText, Modal, Paper } from "@mui/material";
import DirectoryNode from "./DirectoryNode";
import { useSelector } from "react-redux";
import TagIcon from '@mui/icons-material/Tag';
import AddIcon from '@mui/icons-material/Add';
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import useRequestResource from '../../../hooks/useRequestResource';
import { PROJECT, FOLDER, TESTCASE, MODALSTYLE, PRIMARY_COLOR } from "../../constants";
import ModalAdd from "../DetailView/Modal/ModalAdd";
import ModalAddProject from "../DetailView/Modal/ModalAddProject";
import store from "../Redux/store";
import * as actions from "../Redux/actionTypes";


export default function Directory() {
  const [treeItems, setTreeItems] = useState([]);
  const treeUpdate = useSelector((state) => state.tree.treeUpdate);
  const projectId = useSelector((state) => state.projects.currentProject.id);
  const projectName = useSelector((state) => state.projects.currentProject.name);
  const currentObjectType = useSelector((state) => state.object.type);
  const availableProjects = useSelector((state => state.projects.availableProjects));
  const [nodeProjects, setNodeProjects] = useState([]);
  const [modalAdd, setModalAdd] = useState(false);
  const [addType, setAddType] = useState();
  const { getResource: getRootResource, resource: rootResource } = useRequestResource({ endpoint: `/suite/root/tree/${projectId}` });
  const { getResource: getProjectsResource, resource: projectsResource } = useRequestResource({ endpoint: '/suite/projects/' });

  const handleClickRoot = () => {
    store.dispatch({ type: actions.SELECTION, payload: [] })
    store.dispatch({ type: actions.SET_PROJECT, payload: projectId });
    store.dispatch({ type: actions.TREE_UPDATE, payload: projectName });
  }

  useEffect(() => {
    if (projectId > 0) {
      getRootResource();
    } else {
      getProjectsResource();
      setTreeItems([]);
    }
  }, [projectId, treeUpdate]);

  useEffect(() => {
    if (rootResource && projectId > 0) {
      setTreeItems(rootResource);
      store.dispatch({ type: actions.TREE_SET_FOLDERS, payload: rootResource });
    } else if (projectsResource) {
      store.dispatch({ type: actions.GET_PROJECTS, payload: projectsResource.projects });
    }
  }, [rootResource, projectsResource]);
  
  useEffect(() => {
    if (availableProjects.length > 0) {
      setNodeProjects(availableProjects.map((project) => ({ ...project, type: PROJECT })));
    }
  }, [availableProjects])

  const handleOpenModal = (type) => {
    setAddType(type);
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
        {addType === PROJECT ? 
          <ModalAddProject handleCloseModal={handleCloseModal} />
        :
          <ModalAdd handleCloseModal={handleCloseModal} type={addType} projectId={projectId} />
        }
      </Paper>
    </Modal>
  );
  
  if (treeItems.length > 0) {
    return (
      <List style={{ fontSize: "8px", overflowY: "auto" }}>
        <style>{`::-webkit-scrollbar {
          display: none;
        }`}</style>
        <ListItem button onClick={handleClickRoot} style={{ 
              paddingLeft: 10, 
              fontSize: 8,
              borderRadius: 5 
            }}>
                <ListItemIcon><TagIcon style={{ color: currentObjectType === PROJECT ? PRIMARY_COLOR : '',  }}/></ListItemIcon>
                <ListItemText>
                  <b>{projectName}</b>
                </ListItemText>

        </ListItem>
        {treeItems.map((item) => (
          <div key={item.key}>
            <DirectoryNode key={item.id} item={item} padding={10} />
          </div>
        ))}
      </List>
    );
  } else if (projectId) {
    return (
      <Box>
        {addModal}
        <Alert severity="warning" style={{ margin: 10, marginTop: 0 }}>
          <AlertTitle>Empty project</AlertTitle>
          It looks like this project is empty. You might want to add some <b>folders</b> and <b>testcases</b>.
        </Alert>
        <ListItem button onClick={() => handleOpenModal(FOLDER)}>
          <ListItemIcon><CreateNewFolderIcon /></ListItemIcon>
          <ListItemText><i style={{ color: 'gray' }}>Add folder</i></ListItemText>
        </ListItem>
        <ListItem button onClick={() => handleOpenModal(TESTCASE)}>
          <ListItemIcon><PlaylistAddIcon /></ListItemIcon>
          <ListItemText><i style={{ color: 'gray' }}>Add testcase</i></ListItemText>
        </ListItem>
      </Box>
    );
  } else {
    return (
      <Box style={{ overflowY: "auto" }}>
        <style>{`::-webkit-scrollbar {
          display: none;
        }`}</style>
        {addModal}
        <Alert severity="info" style={{ margin: 10, marginTop: 0 }}>
          <AlertTitle>No project selected</AlertTitle>
          There can only exsist <b>folders</b> and <b>testcases</b> within a project. Select a project first, or create a new one.
        </Alert>
        {nodeProjects.length > 0 ?
          nodeProjects.map((project) => (
            <DirectoryNode key={project.id} item={project} padding={10} />
          )) : ''
        }
        <ListItem button onClick={() => handleOpenModal(PROJECT)}>
          <ListItemIcon><AddIcon /></ListItemIcon>
          <ListItemText><i style={{ color: 'gray' }}>Add new project</i></ListItemText>
        </ListItem>
      </Box>
    );
  }
}
