import React, { useEffect } from 'react';
import { Box, Card } from '@mui/material';
import ProjectView from './Project/ProjectView';
import FolderView from './Folder/FolderView';
import TestCaseView from './TestCase/TestCaseView';
import { useSelector } from 'react-redux';
import store from '../Redux/store';
import { FOLDER, TESTCASE, PROJECT, DIRECTORY } from '../../constants';
import BreadcrumbsTrail from './BreadcrumbsTrail';
import useRequestResource from '../../../hooks/useRequestResource';
import * as actions from "../Redux/actionTypes";
import Title from './Title';
import Description from './Description';
import TestRunView from './TestRuns/TestRunsView';


export default function DetailView() {
  const type = useSelector(state => state.type);
  const object = useSelector(state => state.object);
  const project = useSelector(state => state.projects.currentProject);
  const viewState = useSelector(state => state.view.detailView);
  const padX = '30px';
  const padY = '25px';

  const viewType = () => {
    if (type === FOLDER) {
      return viewState === DIRECTORY ? <FolderView type={type} object={object} /> : <TestRunView />
    } else if (type === TESTCASE) {
      return viewState === DIRECTORY ? <TestCaseView type={type} object={object} /> : <TestRunView />
    } else if (type === PROJECT) {
      if (project.id) {
        return viewState === DIRECTORY ? <FolderView type={type} /> : <TestRunView />
      }
      return <ProjectView />;
    } else {
      return <div>404 Not Found...</div>;
    }
  };

  const treeUpdate = useSelector((state) => state.tree.treeUpdate);
  const stepUpdate = useSelector((state) => state.steps.stepUpdate);
  const { getResource, resource } = useRequestResource({ endpoint: `/suite/${type}` });

  useEffect(() => {
    if (type != PROJECT) {
        getResource(object.id);
    } else {
        if(project.id) {
          getResource(project.id);
        }
    }
  }, [treeUpdate, stepUpdate, project.id]);

  useEffect(() => {
    if (resource) {
        if (type === FOLDER) {
          store.dispatch({ type: actions.GET_FOLDER, payload: resource })
        } else if (type === TESTCASE) {
          store.dispatch({ type: actions.GET_TESTCASE, payload: resource })
        } else if (type === PROJECT) {
          store.dispatch({ type: actions.GET_PROJECT, payload: resource })
        }   
    }
  }, [resource])
  
  return (
    <Card sx={{ paddingTop: padY, paddingLeft: padX, paddingRight: padX, paddingBottom: padY }}>
      {project.id ?
        <Box>
          <BreadcrumbsTrail type={type} object={object} />
          <Title />
          <Description />
        </Box>
        :
        <span/>
      }
      {viewType()}
    </Card>
  );
}
