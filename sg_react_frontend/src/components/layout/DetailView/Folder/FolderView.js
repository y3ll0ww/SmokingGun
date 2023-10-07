import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Box, Card, List, IconButton, Modal, Paper, Button } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DirectoryNode from '../../SideMenu/DirectoryNode';
import { FOLDER, TESTCASE, MODALSTYLE, PROJECT, KEY_, PRIMARY_COLOR, DIRECTORY, DETAILVIEW, TESTRUNS } from '../../../constants';
import ModalAddAny from '../Modal/ModalAddAny';
import SelectionView from './SelectionView';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import LibraryAddCheckOutlinedIcon from '@mui/icons-material/LibraryAddCheckOutlined';
import FlakyIcon from '@mui/icons-material/Flaky';
import InputIcon from '@mui/icons-material/Input';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModalAdd from '../Modal/ModalAdd';
import useRequestResource from '../../../../hooks/useRequestResource';
import store from '../../Redux/store';
import * as actions from "../../Redux/actionTypes";
import ModalDeleteBulk from '../Modal/ModalDeleteBulk';
import ModalMoveBulk from '../Modal/ModalMoveBulk';


export default function FolderView(props) {
    const object = useSelector((state) => state.object);
    const projectId = useSelector((state) => state.projects.currentProject.id);
    const projectKey = useSelector((state) => state.projects.currentProject.key);
    const selection = useSelector((state) => state.selection);
    const [nodes, setNodes] = useState([]);
    const storeFolders = useSelector((state) => object.child_folders);
    const storeTestCases = useSelector((state) => object.test_cases);
    const [selectionMode, setSelectionMode] = useState(false);
    const [modalAdd, setModalAdd] = useState(false);
    const [modalDeleteBulk, setModalDeleteBulk] = useState(false);
    const [modalMoveBulk, setModalMoveBulk] = useState(false);
    const [direct, setDirect] = useState(false);
    const [type, setType] = useState(undefined);

    const { updateOrder: updateFolderOrder } = useRequestResource({ endpoint: '/suite/folders/update-order/', resourceLabel: 'updateFolders' });
    const { updateOrder: updateTestCaseOrder } = useRequestResource({ endpoint: '/suite/testcases/update-order/', resourceLabel: 'updateTestcases' });

    const handleOpenModalAdd = (set, type=undefined) => {
        setDirect(set);
        setType(type);
        setModalAdd(true);
    };

    const handleCloseModalAdd = () => {
        setModalAdd(false);
    };

    const handleOpenModalDeleteBulk = () => {
      setModalDeleteBulk(true);
    }

    const handleCloseModalDeleteBulk = () => {
      setModalDeleteBulk(false);
    }

    const handleOpenModalMoveBulk = () => {
      setModalMoveBulk(true);
    }

    const handleCloseModalMoveBulk = () => {
      setModalMoveBulk(false);
    }

    const handleSelectionMode = () => {
      setSelectionMode(selectionMode ? false : true);
      if (selection.length > 0) {
        store.dispatch({ type: actions.SELECTION, payload: [] })
      }
    }

    function handleSelection() {
      const payload = [];
      if (selection.length === 0) {
        for (const node of nodes) {
          payload.push(`${node.type}_${node.id}_${KEY_(projectKey, node.item_number)}`);
        }
      }
      store.dispatch({ type: actions.SELECTION, payload: payload });
    }

    const modalDetail = () => {
        if (direct) {
            return <ModalAdd handleCloseModal={handleCloseModalAdd} parent_folder={object.type === PROJECT ? null : object.id} type={type} projectId={projectId} />
        }
        return <ModalAddAny handleCloseModal={handleCloseModalAdd} parent_folder={object.type === PROJECT ? null : object.id} projectId={projectId} />
    }

    const decideModal = () => {
      const parent = object.type === PROJECT ? null : object.id;
      if (modalAdd) {
        if (direct) {
          return <ModalAdd handleCloseModal={handleCloseModalAdd} parent_folder={parent} type={type} projectId={projectId} />
        }
        return <ModalAddAny handleCloseModal={handleCloseModalAdd} parent_folder={parent} projectId={projectId} />
      } else if (modalDeleteBulk) {
        return <ModalDeleteBulk handleCloseModal={handleCloseModalDeleteBulk} setSelectionMode={handleSelectionMode} items={selection} />
      } else if (modalMoveBulk) {
        return <ModalMoveBulk handleCloseModal={handleCloseModalMoveBulk} setSelectionMode={handleSelectionMode} items={selection} parent_folder={parent} />
      }
    }

    const modal = (
      <Modal open={modalAdd || modalDeleteBulk || modalMoveBulk} onClose={modalAdd ? handleCloseModalAdd : modalDeleteBulk ? handleCloseModalDeleteBulk : handleCloseModalMoveBulk}>
        <Paper
          sx={MODALSTYLE}
          style={{ borderRadius: 10, overflowY: "auto", maxHeight: "500px", width: modalMoveBulk ? 500 : '' }}
        >
          <style>{`::-webkit-scrollbar {
            display: none;
          }`}</style>
          {decideModal()}
        </Paper>
      </Modal>
    );    

    useEffect(() => {
      handleNewNodes(storeFolders, storeTestCases);      
    }, [storeFolders, storeTestCases])

    function handleNewNodes(folders, testcases) {
      const newNodes = [
        ...(folders || []).map(folder => ({ ...folder, type: FOLDER })),
        ...(testcases || []).map(testcase => ({ ...testcase, type: TESTCASE }))
      ];

      setNodes(newNodes);
    }
  
    const onDragEnd = (result) => {
      if (!result.destination) return;

      const { source, destination } = result;
      const type = result.draggableId.split('_')[1];

      let updatedOrder;

      if (type === FOLDER) {
        updatedOrder = reOrderContent(storeFolders, source.index, destination.index);

        handleNewNodes(updatedOrder, storeTestCases);

        const ids = updatedOrder.map(folder => folder.id);
        const orders = updatedOrder.map(folder => folder.order);

        updateFolderOrder(ids, orders, () => {});
      } else if (type === TESTCASE) {
        updatedOrder = reOrderContent(storeTestCases, source.index-storeFolders.length, destination.index-storeFolders.length);

        handleNewNodes(storeFolders, updatedOrder);

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

    const handleSwitchView = () => {
      store.dispatch({ type: actions.SET_VIEW, payload: { location: DETAILVIEW, view: TESTRUNS } });
    }

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        {nodes.length > 0 ? (
          <Box>
            {modal}
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', marginLeft: '3px' }}>
                <IconButton onClick={handleSelectionMode}>
                  {selectionMode ? (<LibraryAddCheckIcon style={{ color: PRIMARY_COLOR }}/>) : (<LibraryAddCheckOutlinedIcon style={{ color: PRIMARY_COLOR }}/>)}
                </IconButton>
                {selectionMode ? (
                  <Button style={{ textTransform: 'none', color: 'gray', marginLeft: 9, color: PRIMARY_COLOR }} onClick={handleSelection}>
                    {selection.length > 0 ? "Deselect all" : "Select all"}
                  </Button>) : (
                  <IconButton onClick={handleSwitchView}>
                    <FlakyIcon style={{ color: PRIMARY_COLOR }}/>
                  </IconButton>
                  )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', marginRight: '10px' }}>
                {selectionMode ? (
                  <div>
                    <IconButton onClick={handleOpenModalMoveBulk}>
                      <DriveFileMoveIcon style={{ color: PRIMARY_COLOR }}/>
                    </IconButton>
                    <IconButton onClick={handleOpenModalDeleteBulk} >
                      <DeleteForeverIcon style={{ color: PRIMARY_COLOR }}/>
                    </IconButton>                    
                  </div>
                ) : (
                  <div>
                    <IconButton>
                      <UploadFileIcon style={{ color: PRIMARY_COLOR }}/>
                    </IconButton>
                    <IconButton onClick={() => handleOpenModalAdd(true, TESTCASE)}>
                      <PlaylistAddIcon style={{ color: PRIMARY_COLOR }}/>
                    </IconButton>
                    <IconButton onClick={() => handleOpenModalAdd(true, FOLDER)}>
                      <CreateNewFolderOutlinedIcon style={{ color: PRIMARY_COLOR }}/>
                    </IconButton>
                  </div>
                )}
              </div>
            </div>
            <Card>
              {selectionMode ? (
                <SelectionView nodes={nodes} />
              ) : (
              <List>
                <Droppable droppableId={`${FOLDER}-${object.id}`}>
                  {(provided, snapshot) => (
                    <Box {...provided.droppableProps} ref={provided.innerRef}>
                      {nodes.map((node, index) => (
                        <Draggable draggableId={`${node.id}_${node.type}`} index={index} key={`${node.id}_${node.type}`}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <DirectoryNode key={`${node.id}_${node.type}`} item={{ ...node }} padding={20} type={node.type} display={false} />
                            </div>
                          )}
                        </Draggable>
                      ))}     
                      {provided.placeholder}
                    </Box>
                    )}
                  </Droppable>
              </List>
              )}
            </Card>
          </Box>
        ) : (
          <Box>
                {modal}
                <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }} style={{ padding: 80 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <IconButton style={{ padding: '35px', margin: '-25px' }} onClick={() => handleOpenModalAdd(false)}>
                            <InputIcon style={{ color: 'silver', fontSize: '120px', color: PRIMARY_COLOR }} />
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
