import React, { useState } from "react";
import { List, ListItem, ListItemIcon, ListItemText, IconButton } from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
import ListIcon from '@mui/icons-material/List';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function DirectoryNode(props) {
  const item = props.root ? props.item : {
      key: props.item.id,
      to: `/folder/${props.item.id}`,
      name: props.item.name,
      icon: <FolderIcon />,
      truncatedName: props.item.name,
      child_folders: props.item.child_folders || [],
    };

  const [open, setOpen] = useState(false);

  const handleItemClick = () => {
    setOpen(!open);
  };

  console.log(item);

  return (
    <div>
      <ListItem button style={{ fontSize: "8px" }}>
        {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
        <ListItemText primary={item.truncatedName} />
        {item.child_folders && item.child_folders.length > 0 && (
          <IconButton>
            <ChevronRightIcon
              sx={{
                fontSize: "18px",
                transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
              }}
              onClick={handleItemClick}
            />
          </IconButton>
        )}
      </ListItem>
      {open && (
        <List>
          {item.child_folders &&
            item.child_folders.map((child) => (
              <DirectoryNode key={child.id} item={child} root={false} />
            ))}
        </List>
      )}
    </div>
  );
}