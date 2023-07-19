import React, { useEffect, useState } from "react";
import { List, Alert, AlertTitle } from "@mui/material";
import DirectoryNode from "./DirectoryNode";
import { Provider, useSelector } from "react-redux";
import store from "../Redux/store";
import useRequestResource from '../../../hooks/useRequestResource';

function Directory() {
  const [treeItems, setTreeItems] = useState([]);
  const treeUpdate = useSelector((state) => state.tree.treeUpdate);
  const projectId = useSelector((state) => state.projects.currentProject.id);
  const { getResource, resource } = useRequestResource({ endpoint: `/suite/root/tree/${projectId}` });

  useEffect(() => {
    if (projectId) {
      getResource();
    }
  }, [projectId, treeUpdate]);

  useEffect(() => {
    if (resource) {
      setTreeItems(resource);
    }    
  }, [resource]);
  
  if (treeItems.length > 0) {
    return (
      <List style={{ fontSize: "8px" }}>
        {treeItems.map((item) => (
          <div key={item.key}>
            <DirectoryNode key={item.id} item={item} padding={10} />
          </div>
        ))}
      </List>
    );
  } else if (!projectId) {
    return (
      <Alert severity="warning" style={{ margin: 50, marginTop: 10 }}>
        <AlertTitle>No project selected</AlertTitle>
        You can select or create a project with the <b>dropdown</b> in the toolbar, or in the <b>list</b> on the right.
      </Alert>
    );
  } else {
    return (
      <Alert severity="info" style={{ margin: 50, marginTop: 10 }}>
        <AlertTitle>Empty project</AlertTitle>
        It looks like this project is empty. You might want to add some <b>folders</b> and <b>testcases</b> to it. You can do this via the icons in the toolbar.
      </Alert>
    )
  }
  
}

function View() {
  return (
    <Provider store={store}>
      <Directory />
    </Provider>
  );
}

export default View;