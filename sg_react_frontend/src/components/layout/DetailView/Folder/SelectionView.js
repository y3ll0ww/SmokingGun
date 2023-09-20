import * as React from 'react';
import { DataGrid} from '@mui/x-data-grid';
import { FOLDER, KEY_ } from '../../../constants';
import FolderIcon from '@mui/icons-material/Folder';
import ListIcon from '@mui/icons-material/List';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import store from '../../Redux/store';
import * as actions from "../../Redux/actionTypes";

const columns = [
  {
    field: 'type',
    headerName: '',
    renderCell: (params) => {
        if (params.row.type === FOLDER) {
          return <FolderIcon style={{ color: 'gray' }}/>;
        } else {
          return <ListIcon style={{ color: 'gray' }}/>;
        }
      },
    flex: 0.1,
    minWidth: 10,
  },
  { 
    field: 'key', 
    headerName: '',
    flex: 0.15,
    minWidth: 100,
  },
  {
    field: 'name',
    headerName: '',
    flex: 2,
    minWidth: 150,
  },
];

function getRows(projectKey, data) {
    let rows = [];

    for (const node of data) {
        const key = KEY_(projectKey, node.item_number);
        
        rows.push({
            id: `${node.type}_${node.id}_${key}`,
            key: key,
            type: node.type,
            name: node.name,
        })
    }

    return rows;
}

export default function SelectionView(props) {
    const [selectedRows, setSelectedRows] = useState([]);
    const selection = useSelector((state) => state.selection);
    const projectKey = useSelector((state) => state.projects.currentProject.key)

    useEffect(() => {
        setSelectedRows(selection);
    }, [selection])

    return (
      <div sx={{ height: '100%', width: '100%' }}>
        <style>
          {`.no-pagination .MuiDataGrid-footerContainer {
              display: none;
          }
          .css-5wly58-MuiDataGrid-root.MuiDataGrid-withBorderColor {
              border-color: transparent !important;
              border-width: 0 !important;
          }
          .MuiDataGrid-cell:focus {
              outline: none !important;
          }`}
        </style>
        <DataGrid
          rows={getRows(projectKey, props.nodes)}
          columns={columns}
          checkboxSelection
          columnHeaderHeight={0}
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={(newSelection) => {
            store.dispatch({ type: actions.SELECTION, payload: newSelection });
          }}
          className="no-pagination"
        />
      </div>
    );
}