import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemIcon, ListItemText, IconButton, Menu, MenuItem, Modal, Paper } from "@mui/material";

import FolderIcon from '@mui/icons-material/Folder';
import ListIcon from '@mui/icons-material/List';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BuildIcon from '@mui/icons-material/Build';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModalDelete from "./ModalDelete";

import store from "../Redux/store";
import useRequestResource from "../../../hooks/useRequestResource";
import * as actions from "../Redux/actionTypes";


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function DirectoryNode(props) {
  const padding = props.padding + 'px';

  const item = {
      key: props.item.type === "folder" ? 'F' + props.item.id : 'T' + props.item.id,
      to: `/folder/${props.item.id}`,
      name: props.item.type === "folder"? 'F' + props.item.id + ': ' + props.item.name : 'T' + props.item.id + ' ' + props.item.name,
      type: props.item.type,
      icon: props.item.type === "folder" ? <FolderIcon /> : <ListIcon />,
      child_folders: props.item.child_folders || [],
      testcases: props.item.testcases
    };

  // Handling the opening and closing of the folders
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleExpandCollapse = (event) => {
    event.stopPropagation();
    setOpen(!open);
  };

  const handleOpenOptions = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseOptions = () => {
    setAnchorEl(null);
  };

  // Handling modal options
  const [modal, setModal] = React.useState(false);

  const handleOpenModal = () => {
    setModal(true);
  }

  const handleCloseModal = () => {
    setModal(false);
  }

  const deleteModal = (
    <Modal open={modal} onClose={handleCloseModal}>
        <Paper sx={modalStyle} disableEqualOverflow 
             style={{ borderRadius: 10, overflowY:'auto', maxHeight:"500px", width: "500px" }}>      
            <style>
                {`::-webkit-scrollbar {
                    display: none;
                }`}
            </style>
            <ModalDelete handleCloseModal={handleCloseModal} name={item.name} type={props.item.type} id={item.key} />
        </Paper>
    </Modal>
  )

  // Opening items and dispatching to store
  const [state, setState] = useState({
    type: item.type,
    object: []
  })

  store.subscribe(() => {
    const update = store.getState()
    setState({update})
  });

  const { getResource, resource } = useRequestResource({ endpoint: `/suite/${item.type}` });

  const handleClick = () => {
    if (item.type === 'folder') {
        const id = item.key.replace('F', '');
        getResource(id);
    } else if (item.type === 'testcase') {
        const id = item.key.replace('T', '');
        getResource(id); 
    }
  }

  useEffect(() => {
      if (resource) {
          if (item.type === 'folder') {
            store.dispatch({ type: actions.GET_FOLDER, payload: resource })
          } else if (item.type === 'testcase') {
            store.dispatch({ type: actions.GET_TESTCASE, payload: resource })
          }
          
      }
  }, [resource])

  return (
    <div>
      <ListItem button onClick={handleClick} style={{ paddingLeft: padding, fontSize: "8px" }}>
        {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
        <ListItemText primary={item.name} />
        {((item.child_folders && item.child_folders.length > 0) || (item.testcases && item.testcases.length > 0)) && (
            <IconButton onClick={handleExpandCollapse} sx={{ padding: "3px", margin: "-2px" }}>
              <ChevronRightIcon
                sx={{
                  fontSize: "18px",
                  transform: open ? 'rotate(90deg)' : 'rotate(0deg)'
                }}
              />
            </IconButton>
        )}
        <IconButton onClick={handleOpenOptions} sx={{ padding: "3px", margin: "-2px" }}>
          <MoreVertIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </ListItem>
      {open && (
        <List>
          {item.child_folders &&
            item.child_folders.map((child) => (
              <DirectoryNode key={child.id} item={child} padding={props.padding + 30} />
            ))}
          {item.testcases &&
            item.testcases.map((testcase) => (
              <DirectoryNode key={testcase.id} item={testcase} padding={props.padding + 30} />
            ))}
        </List>
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseOptions}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleCloseOptions}>
          <IconButton>
            <BuildIcon />
          </IconButton>
          <IconButton onClick={handleOpenModal}>
            <DeleteForeverIcon/>
          </IconButton>
        </MenuItem>
      </Menu>
      {deleteModal}
    </div>
  );
}