import { IconButton, Menu, ListItem } from "@mui/material";
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { PRIMARY_COLOR, PROJECT } from "../../constants";


export default function NodeMenu(props) {
    const MOVE = 'move';
    const DELETE = 'delete';

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
        <ListItem>
          {props.item.type !== PROJECT ? (
            <IconButton onClick={() => handleOptionClick(MOVE)}>
              <DriveFileMoveIcon style={{ color: PRIMARY_COLOR }}/>
            </IconButton>
          ):''}
          <IconButton onClick={(event) => { event.stopPropagation(); handleOptionClick(DELETE); }}>
            <DeleteForeverIcon style={{ color: PRIMARY_COLOR }}/>
          </IconButton>
        </ListItem>
      </Menu>
    )
}