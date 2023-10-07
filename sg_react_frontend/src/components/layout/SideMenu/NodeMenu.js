import { Menu, ListItem, ListItemIcon, ListItemText, Divider, Modal, Paper } from "@mui/material";
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { FOLDER, TESTCASE, PRIMARY_COLOR, PROJECT, MODALSTYLE } from "../../constants";
import ModalAdd from "../DetailView/Modal/ModalAdd";
import { useState } from "react";
import store from "../Redux/store";


export default function NodeMenu(props) {
    const MOVE = 'move';
    const DELETE = 'delete';

    const [modalAdd, setModalAdd] = useState(false);
    const [addType, setAddType] = useState('');

    const handleOpenModalAdd = (type) => {
      setAddType(type);
      setModalAdd(true);      
    };

    const handleCloseModalAdd = () => {
      props.handleCloseOptions();
      setModalAdd(false);
    };

    const addModal = (
      <Modal open={modalAdd} onClose={handleCloseModalAdd}>
        <Paper
          sx={MODALSTYLE}
          style={{ borderRadius: 10, overflowY: "auto", maxHeight: "500px" }}
        >
          <style>{`::-webkit-scrollbar {
            display: none;
          }`}</style>
          {props.item.type === PROJECT ? 
          <ModalAdd handleCloseModal={handleCloseModalAdd} type={addType} projectId={store.getState().projects.currentProject.id} /> 
          : 
          <ModalAdd handleCloseModal={handleCloseModalAdd} parent_folder={props.item.id} type={addType} projectId={store.getState().projects.currentProject.id} />
          }
        </Paper>
      </Modal>
    );  

    const handleOptionClick = (action) => {
      props.handleCloseOptions();
      
      switch (action) {
        case MOVE: {
          props.handleOpenModalMove();
          break;
        }
        case DELETE: {
          props.handleOpenModalDelete();
          break;
        }
      }
    };

    return (
        <Menu
        anchorEl={props.anchorEl}
        open={Boolean(props.anchorEl)}
        onClose={props.handleCloseOptions}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      > 
        {addModal}
        {props.item.type !== PROJECT ? (
        <div>
        <Divider><b>{props.item.key}</b></Divider>
        <ListItem button onClick={() => handleOptionClick(MOVE)}>
            <ListItemIcon><DriveFileMoveIcon style={{ color: PRIMARY_COLOR }}/></ListItemIcon>
            <ListItemText>Move {props.item.type}</ListItemText>
        </ListItem>
        </div>
        ):''}
        <ListItem button onClick={(event) => { event.stopPropagation(); handleOptionClick(DELETE); }}>
          <ListItemIcon><DeleteForeverIcon style={{ color: PRIMARY_COLOR }}/></ListItemIcon>
          <ListItemText>Delete {props.item.type}</ListItemText>
        </ListItem>
        {props.item.type === FOLDER ? (
        <div>
        <Divider></Divider>
        <ListItem button onClick={() => handleOpenModalAdd(FOLDER)}>
            <ListItemIcon><CreateNewFolderIcon style={{ color: PRIMARY_COLOR }}/></ListItemIcon>
            <ListItemText>Create folder</ListItemText>
        </ListItem>
        <ListItem button onClick={() => handleOpenModalAdd(TESTCASE)}>
            <ListItemIcon><PlaylistAddIcon style={{ color: PRIMARY_COLOR }}/></ListItemIcon>
            <ListItemText>Create testcase</ListItemText>
        </ListItem>
        </div>
        ):''}
      </Menu>
    )
}