import { IconButton, Menu, MenuItem } from "@mui/material";
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { PROJECT } from "../../constants";


export default function NodeMenu(props) {
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
        <MenuItem onClick={props.handleCloseOptions}>
          {props.item.type !== PROJECT ? (
            <IconButton onClick={props.handleOpenModalMove}>
              <DriveFileMoveIcon />
            </IconButton>
          ):''}
          <IconButton onClick={props.handleOpenModalDelete}>
            <DeleteForeverIcon/>
          </IconButton>
        </MenuItem>
      </Menu>
    )
}