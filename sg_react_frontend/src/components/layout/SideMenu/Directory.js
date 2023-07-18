import React, { useEffect, useState } from "react";
import { List } from "@mui/material";
import DirectoryNode from "./DirectoryNode";
import { Provider, useSelector } from "react-redux";
import store from "../Redux/store";
import useRequestResource from '../../../hooks/useRequestResource';

function Directory() {
  const [treeItems, setTreeItems] = useState([]);
  const treeUpdate = useSelector((state) => state.tree.treeUpdate);
  const projectId = useSelector((state) => state.project.id);
  const { getResource, resource } = useRequestResource({ endpoint: `/suite/root/tree/${projectId}` });

  useEffect(() => {
    getResource();
  }, [projectId, treeUpdate]);

  useEffect(() => {
    if (resource) {
      setTreeItems(resource);
    }    
  }, [resource]);

  return (
    <List style={{ fontSize: "8px" }}>
      {treeItems.map((item) => (
        <div key={item.key}>
          <DirectoryNode key={item.id} item={item} padding={10} />
        </div>
      ))}
    </List>
  );
}

function View() {
  return (
    <Provider store={store}>
      <Directory />
    </Provider>
  );
}

export default View;