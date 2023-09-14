import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import useRequestResource from "../../../hooks/useRequestResource";
import store from "../Redux/store";
import * as actions from '../Redux/actionTypes';

export default function ProjectDropDown() {
  const [projectId, setProjectId] = useState('');
  const { getResource, resource } = useRequestResource({ endpoint: '/suite/projects/' });
  const fontSize = 14;
  const [projects, setProjects] = useState([]);
  const currentProjectId = useSelector((state) => state.projects.currentProject.id)
  const treeUpdate = useSelector((state) => state.tree.treeUpdate)

  const handleChange = (event: SelectChangeEvent) => {
    store.dispatch({ type: actions.SELECTION, payload: [] })
    setProjectId(event.target.value);
  };

  useEffect(() => {
    if (currentProjectId) {
        setProjectId(currentProjectId);
    } else {
        setProjectId(0);
    }    
  }, [currentProjectId])

  useEffect(() => {
    getResource();
  }, [treeUpdate]);

  useEffect(() => {
    if (resource) {
        setProjects(resource.projects);
        store.dispatch({ type: actions.GET_PROJECTS, payload: resource.projects })
    }
  }, [resource])

  useEffect(() => {
    if (projectId > 0) {
        store.dispatch({ type: actions.SET_PROJECT, payload: projectId });
    } else {
        store.dispatch({ type: actions.DESELECT_PROJECT });
        console.log(store.getState());
    }
  }, [projectId])

  return (
    <div>
      <Box id="form-control-wrapper">
        <FormControl size="small" sx={{ s: 0, maxWidth: 250, minWidth: 120 }}>
          <Select
            value={projectId}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'Without label' }}
            style={{ fontSize: fontSize }}
          >
            <MenuItem style={{ fontSize: fontSize }} value={0}><em>Select Project</em></MenuItem>
            {projects.map((project) => (
              <MenuItem style={{ fontSize: fontSize }} value={project.id}>{project.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </div>
  );
}
