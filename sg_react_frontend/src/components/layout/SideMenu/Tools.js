import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { List, ListItem } from "@mui/material";
import FlakyIcon from '@mui/icons-material/Flaky';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { NavLink } from "react-router-dom";
import { IconButton } from "@mui/material";
import { DIRECTORY, SIDEMENU, TESTRUNS } from "../../constants";
import store from "../Redux/store";
import * as actions from "../Redux/actionTypes";


export default function Tools(props) {
    const projectId = useSelector(state => state.projects.currentProject.id);
    const openNodes = useSelector(state => state.tree.openNodes);
    const [isDisabled, setIsDisabled] = useState(true);
    const viewState = useSelector((state) => state.view.sideMenu);

    useEffect(() => {
        if (projectId > 0) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [projectId])

    const handleExpandCollapseAll = () => {
      const hasRootNodes = openNodes.some(node => node.root);

      if (!hasRootNodes) {
        store.dispatch({ type: actions.TREE_EXPAND_ALL });
      } else {
        store.dispatch({ type: actions.TREE_COLLAPSE_ALL });
      }
    }

    const handleSwitchView = () => {
      const view = viewState === DIRECTORY ? TESTRUNS : DIRECTORY;
      store.dispatch({ type: actions.SET_VIEW, payload: { location: SIDEMENU, view: view } });
    }

    return (
        <NavLink
          className={(props) => {
            return `${
              props.isActive ? "sidebar-nav-item-active" : "sidebar-nav-item"
            }`;
          }}
        >
          <List
            sx={{ display: "flex", flexDirection: "row", alignItems: "flex-end" }}
            style={{ paddingRight: 8, cursor: 'default' }}
          >
            <ListItem style={{ padding: 1, cursor: isDisabled ? 'default' : '' }}>
              <IconButton onClick={handleSwitchView} disabled={isDisabled}>
                {viewState === DIRECTORY ?
                  <FlakyIcon style={{ color: isDisabled ? 'gray' : '' }} />
                :
                <LocationSearchingIcon style={{ color: isDisabled ? 'gray' : '' }} /> 
                }
              </IconButton>
            </ListItem>

            <ListItem style={{ marginRight: -10, padding: 1, cursor: isDisabled ? 'default' : '' }}>
              <IconButton disabled={isDisabled} onClick={handleExpandCollapseAll}>
                <UnfoldMoreIcon style={{ color: isDisabled ? 'gray' : '' }} />
              </IconButton>
            </ListItem>
          </List>
        </NavLink>
    )
}