import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Box, Card, List, IconButton, Modal, Paper } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DirectoryNode from '../../SideMenu/DirectoryNode';
import { FOLDER, TESTCASE, MODALSTYLE } from '../../../constants';
import ModalAddAny from './ModalAddAny';
import InputIcon from '@mui/icons-material/Input';
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ModalAdd from '../../SideMenu/ModalAdd';
import useRequestResource from '../../../../hooks/useRequestResource';
import store from '../../Redux/store';
import * as actions from "../../Redux/actionTypes";


export default function FolderView(props) {
    const object = useSelector((state) => state.object);
    const projectId = useSelector((state) => state.projects.currentProject.id);
    const [nodes, setNodes] = useState([]);
    const storeFolders = useSelector((state) => object.child_folders);
    const storeTestCases = useSelector((state) => object.test_cases);
    const [modalOpen, setModalOpen] = useState(false);
    const [direct, setDirect] = useState(false);
    const [type, setType] = useState(undefined);
    const { updateOrder: updateFolderOrder } = useRequestResource({ endpoint: '/suite/folders/update-order/', resourceLabel: 'updateFolders' });
    const { updateOrder: updateTestCaseOrder } = useRequestResource({ endpoint: '/suite/testcases/update-order/', resourceLabel: 'updateTestcases' });

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
            return <ModalAdd handleCloseModal={handleCloseModal} parent_folder={object.id} type={type} projectId={projectId} />
        }
        return <ModalAddAny handleCloseModal={handleCloseModal} parent_folder={object.id} projectId={projectId} />
    }

    const modal = (
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Paper
          sx={MODALSTYLE}
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

    useEffect(() => {
      const newNodes = [
        ...(storeFolders || []).map(folder => ({ ...folder, type: FOLDER })),
        ...(storeTestCases || []).map(testcase => ({ ...testcase, type: TESTCASE }))
      ];

      setNodes(newNodes);
    }, [storeFolders, storeTestCases])
  
    const onDragEnd = (result) => {
      if (!result.destination) return;

      const { source, destination } = result;
      const type = result.draggableId.split('-')[1];

      let updatedOrder;

      if (type === FOLDER) {
        updatedOrder = reOrderContent(storeFolders, source.index, destination.index);

        const ids = updatedOrder.map(folder => folder.id);
        const orders = updatedOrder.map(folder => folder.order);

        updateFolderOrder(ids, orders, () => {});
      } else if (type === TESTCASE) {
        updatedOrder = reOrderContent(storeTestCases, source.index-storeFolders.length, destination.index-storeFolders.length);

        const ids = updatedOrder.map(testcase => testcase.id);
        const orders = updatedOrder.map(testcase => testcase.order);

        updateTestCaseOrder(ids, orders, () => {});
      }

      store.dispatch({ type: actions.TREE_UPDATE, payload: { name: result.draggableId } });
    };
  
    function reOrderContent(array, sourceIndex, destinationIndex) {
      const reorderedContent = Array.from(array);
      const [movedContent] = reorderedContent.splice(sourceIndex, 1);
      reorderedContent.splice(destinationIndex, 0, movedContent);
  
      return reorderedContent.map((item, index) => ({
        ...item,
        order: index,
      }));
    }
    
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        {nodes.length > 0 ? (
          <Box>
            {modal}
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'end', marginRight: '10px' }}>
                <IconButton>
                    <UploadFileIcon />
                </IconButton>
                <IconButton>
                    <PlaylistAddIcon onClick={() => handleOpenModal(true, TESTCASE)}/>
                </IconButton>
                <IconButton>
                    <CreateNewFolderIcon onClick={() => handleOpenModal(true, FOLDER)}/>
                </IconButton>
            </div>
            <Card>
              <List>
                <Droppable droppableId={`${FOLDER}-${object.id}`}>
                  {(provided, snapshot) => (
                    <Box {...provided.droppableProps} ref={provided.innerRef}>
                      {nodes.map((node, index) => (
                        <Draggable draggableId={`${node.id}-${node.type}`} index={index} key={`${node.id}-${node.type}`}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <DirectoryNode key={`${node.id}-${node.type}`} item={{ ...node, type: type }} padding={20} type={node.type} display={false} />
                            </div>
                          )}
                        </Draggable>
                      ))}     
                      {provided.placeholder}
                    </Box>
                    )}
                  </Droppable>
              </List>
            </Card>
          </Box>
        ) : (
          <Box>
                {modal}
                <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }} style={{ padding: 80 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <IconButton style={{ padding: '35px', margin: '-25px' }} onClick={() => handleOpenModal(false)}>
                            <InputIcon style={{ color: 'silver', fontSize: '120px' }} />
                        </IconButton>
                        <h2>No contents</h2>
                        <p style={{ marginTop: '0px', textAlign: 'center', color: 'gray' }}>
                            This {props.type} doesn't contain any testcases or other folders.<br />
                            You can create new resources by <b>clicking the icon</b> above.
                        </p>
                    </div>
                </Card>
            </Box>
        )}
      </DragDropContext>
    );
}
