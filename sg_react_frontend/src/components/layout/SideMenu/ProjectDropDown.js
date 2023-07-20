import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TagIcon from '@mui/icons-material/Tag';
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
    setProjectId(event.target.value);
  };

  useEffect(() => {
    setProjectId(currentProjectId);
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
    if (projectId) {
        store.dispatch({ type: actions.SET_PROJECT, payload: projectId });
    }
  }, [projectId])

  return (
    <div>
      <Box id="form-control-wrapper">
        <TagIcon size="small" style={{ color: 'gray', marginTop: 9, marginRight: 3, fontSize: fontSize + 5 }}/>
        <FormControl size="small" sx={{ s: 0, maxWidth: 250, minWidth: 120 }}>
          <Select
            value={projectId}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'Without label' }}
            style={{ fontSize: fontSize }}
          >
            <MenuItem style={{ fontSize: fontSize }} value=""><em>Select Project</em></MenuItem>
            {projects.map((project) => (
              <MenuItem style={{ fontSize: fontSize }} value={project.id}>{project.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </div>
  );
}
