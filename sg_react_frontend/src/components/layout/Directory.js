import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText, IconButton } from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
import ListIcon from '@mui/icons-material/List';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DirectoryNode from "./DirectoryNode";

export default function Directory() {
  const [treeItems, setTreeItems] = useState([]);
  const [collapsedItems, setCollapsedItems] = useState([]);

  useEffect(() => {
    fetch("/api/suite/folders/tree/")
      .then(response => response.json())
      .then(data => {
        // Process the data and update the tree items
        // to fit the desired structure
        const updatedItems = processTreeData(data);
        setTreeItems(updatedItems);
      })
      .catch(error => {
        // Handle errors
        console.error("Error:", error);
      });
  }, []);

  const processTreeData = (data) => {
    // Process the API response and transform it into the desired format
    // Modify this function based on the response structure
    // and the desired structure of listItemsPublic

    // Example transformation:
    const transformedData = data.map(item => {
      const isFolder = item.type === "folder";
      const truncatedName = item.name.length > 30 ? `${item.name.slice(0, 30)}...` : item.name;
      return {
        key: item.id,
        to: isFolder ? `/folder/${item.id}` : `/testcase/${item.id}`,
        name: item.name,
        icon: isFolder ? <FolderIcon /> : <ListIcon />,
        truncatedName: truncatedName,
        child_folders: item.child_folders || [], // Ensure child_folders property is always present
      };
    });

    // Return the transformed data
    return transformedData;
  };

  return (
    <List style={{ fontSize: "8px" }}>
      {treeItems.map((item) => (
        <div key={item.key}>
          <DirectoryNode key={item.id} item={item} root={true} />
        </div>
      ))}
    </List>
  );
}