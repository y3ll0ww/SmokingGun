import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemIcon, ListItemText, IconButton, Menu, MenuItem, Modal, Paper } from "@mui/material";

import FolderIcon from '@mui/icons-material/Folder';
import ListIcon from '@mui/icons-material/List';
import TagIcon from '@mui/icons-material/Tag';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PestControlIcon from '@mui/icons-material/PestControl';

import ModalDelete from "./ModalDelete";
import ModalMove from "./ModalMove";
import store from "../Redux/store";
import useRequestResource from "../../../hooks/useRequestResource";
import * as actions from "../Redux/actionTypes";
import { FOLDER, KEY_, TESTCASE, PROJECT } from "../../constants";
import { useSelector } from "react-redux";


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
  const projectKey = useSelector((state) => state.projects.currentProject.key);
  const padding = props.padding + 'px';
  const type = props.item.type != null ? props.item.type : props.type != null ? props.type : 'typeless';
  const display = props.display != null ? props.display : true; // Prevents weird padding in FolderView

  const item = {
      id: props.item.id,
      key: type === PROJECT ? props.item.key :
           KEY_(projectKey, props.item.item_number),
      name: props.item.name,
      type: type,
      icon: type === FOLDER ? <FolderIcon /> : 
            type === TESTCASE ? <ListIcon /> :
            type === PROJECT ? <TagIcon /> :
            <PestControlIcon />,
      item_number: props.item.item_number,
      child_folders: props.item.child_folders,
      testcases: props.item.testcases
    };

  // Handling the opening and closing of the folders
  const openNodes = useSelector((state) => state.tree.openNodes);
  const [open, setOpen] = useState(openNodes.includes(props.item.id));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleExpandCollapse = (event) => {
    event.stopPropagation();
    if (open) {
      store.dispatch({ type: actions.TREE_COLLAPSE_NODE, payload: { nodeId: props.item.id } })
    } else {
      store.dispatch({ type: actions.TREE_EXPAND_NODE, payload: { nodeId: props.item.id } })
    }
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
  const [modalDelete, setModalDelete] = React.useState(false);
  const [modalMove, setModalMove] = React.useState(false);

  const handleOpenModalDelete = () => {
    setModalDelete(true);
  }

  const handleOpenModalMove = () => {
    setModalMove(true);
  }

  const handleCloseModalDelete = () => {
    setModalDelete(false);
  }

  const handleCloseModalMove = () => {
    setModalMove(false);
  }

  const deleteModal = (
    <Modal open={modalDelete} onClose={handleCloseModalDelete}>
        <Paper sx={modalStyle} disableEqualOverflow 
             style={{ borderRadius: 10, overflowY:'auto', maxHeight:"500px", width: "500px" }}>      
            <style>
                {`::-webkit-scrollbar {
                    display: none;
                }`}
            </style>
            <ModalDelete handleCloseModal={handleCloseModalDelete} name={item.name} type={type} id={item.id} item_number={item.item_number} />
        </Paper>
    </Modal>
  )

  const moveModal = (
    <Modal open={modalMove} onClose={handleCloseModalMove}>
      <Paper sx={modalStyle} disableEqualOverflow
        	  style={{ borderRadius: 10, overflowY:'auto', maxHeight:"500px", width: "500px" }}>
            <style>
                {`::-webkit-scrollbar {
                    display: none;
                }`}
            </style>
            <ModalMove handleCloseModal={handleCloseModalMove} name={item.name} type={type} id={item.id} item_number={item.item_number} />
      </Paper>
    </Modal>
  )

  // Opening items in the detail viewand dispatching to store
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
    store.dispatch({ type: actions.SELECTION, payload: [] })
    getResource(item.id);
  }

  useEffect(() => {
      if (resource) {
          if (item.type === FOLDER) {
            store.dispatch({ type: actions.GET_FOLDER, payload: resource })
          } else if (item.type === TESTCASE) {
            store.dispatch({ type: actions.GET_TESTCASE, payload: resource })
          } else {
            store.dispatch({ type: actions.GET_PROJECT, payload: resource })
          }
          
      }
  }, [resource])

  return (
    <div>
      <ListItem button onClick={handleClick} style={{ paddingLeft: padding, fontSize: "8px" }}>
        {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
        <ListItemText primary={<span><span style={{ color: 'gray', fontSize: '12px' }}>{item.key} </span>{item.name}</span>} />
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
      {open && display && (
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
          {item.type !== PROJECT ? (
            <IconButton onClick={handleOpenModalMove}>
              <DriveFileMoveIcon />
            </IconButton>
          ):''}
          <IconButton onClick={handleOpenModalDelete}>
            <DeleteForeverIcon/>
          </IconButton>
        </MenuItem>
      </Menu>
      {moveModal}
      {deleteModal}
    </div>
  );
}