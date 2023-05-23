import React, { useEffect, useState } from "react";
import { List } from "@mui/material";
import DirectoryNode from "./DirectoryNode";
import { Provider, useSelector } from "react-redux";
import store from "../Redux/store";

function Directory() {
  const [treeItems, setTreeItems] = useState([]);
  const treeUpdate = useSelector((state) => state.tree.treeUpdate);

  useEffect(() => {
    fetch("/api/suite/root/tree/")
      .then(response => response.json())
      .then(data => {
        setTreeItems(data);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }, [treeUpdate]);

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