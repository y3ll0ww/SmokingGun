import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Card, List, IconButton, Modal, Paper } from '@mui/material';
import DirectoryNode from '../SideMenu/DirectoryNode';
import { FOLDER, TESTCASE, modalStyle } from '../../constants';
import ModalAddAny from './ModalAddAny';
import InputIcon from '@mui/icons-material/Input';
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import ModalAdd from '../SideMenu/ModalAdd';


export default function FolderView(props) {
    const object = useSelector((state) => state.object);
    const [modalOpen, setModalOpen] = useState(false);
    const [direct, setDirect] = useState(false);
    const [type, setType] = useState(undefined);

    const handleOpenModal = (set, type=undefined) => {
        setDirect(set);
        setType(type);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const modalDetail = () => {
        if (direct) {
            return <ModalAdd handleCloseModal={handleCloseModal} parent_folder={object.id} type={type} />
        }
        return <ModalAddAny handleCloseModal={handleCloseModal} parent_folder={object.id} />
    }

    const modal = (
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Paper
          sx={modalStyle}
          disableEqualOverflow
          style={{ borderRadius: 10, overflowY: "auto", maxHeight: "500px" }}
        >
          <style>{`::-webkit-scrollbar {
            display: none;
          }`}</style>
          {modalDetail()}
        </Paper>
      </Modal>
    );

    if (!(object?.child_folders ?? []).length && !(object?.test_cases ?? []).length) {
        return (
            <Box>
                {modal}
                <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }} style={{ padding: 80 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <IconButton style={{ padding: '35px', margin: '-25px' }} onClick={() => handleOpenModal(false)}>
                            <InputIcon style={{ color: 'silver', fontSize: '120px' }} />
                        </IconButton>
                        <h2>No contents</h2>
                        <p style={{ marginTop: '0px', textAlign: 'center', color: 'gray' }}>
                            This folder doesn't contain any testcases or other folders.<br />
                            You can create new resources by <b>clicking the icon</b> above.
                        </p>
                    </div>
                </Card>
            </Box>
        );
    }
     
    return (
        <Box>
            {modal}
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'end', marginRight: '10px' }}>
                <IconButton>
                    <CreateNewFolderIcon onClick={() => handleOpenModal(true, FOLDER)}/>
                </IconButton>
                <IconButton>
                    <PlaylistAddIcon onClick={() => handleOpenModal(true, TESTCASE)}/>
                </IconButton>
            </div>
            <Card>
              <List>
                {object?.child_folders?.map((folder) => (
                  <DirectoryNode key={folder.id} item={{ ...folder, type: FOLDER }} padding={20} type={FOLDER} display={false} />
                ))}
                {object?.test_cases?.map((testcase) => (
                  <DirectoryNode key={testcase.id} item={{ ...testcase, type: TESTCASE }} padding={20} type={TESTCASE} display={false} />
                ))}
              </List>
            </Card>
        </Box>
    );
  }