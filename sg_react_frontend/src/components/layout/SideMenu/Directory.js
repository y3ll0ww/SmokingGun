import React, { useEffect, useState } from "react";
import { List } from "@mui/material";
import DirectoryNode from "./DirectoryNode";

export default function Directory() {
  const [treeItems, setTreeItems] = useState([]);

  useEffect(() => {
    fetch("/api/suite/root/tree/")
      .then(response => response.json())
      .then(data => {
        setTreeItems(data);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }, []);

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