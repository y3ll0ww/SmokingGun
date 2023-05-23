import React, { useEffect, useState } from 'react';
import { Card } from '@mui/material';
import FolderView from './FolderView';
import TestCaseView from './TestCaseView';
import { Provider, useSelector } from 'react-redux';
import store from '../Redux/store';
import { FOLDER, TESTCASE, ROOT, KEY_FOLDER, KEY_TESTCASE } from '../../constants';
import BreadcrumbsTrail from './BreadcrumbsTrail';
import useRequestResource from '../../../hooks/useRequestResource';
import * as actions from "../Redux/actionTypes";

function DetailView() {
  const type = useSelector(state => state.type);
  const object = useSelector(state => state.object);
  const padX = '30px';
  const padY = '25px';


  const viewType = () => {
    if (type === FOLDER) {
      return <FolderView type={type} object={object} />;
    } else if (type === TESTCASE) {
      return <TestCaseView type={type} object={object} />;
    } else if (type === ROOT) {
      return <FolderView type={type} object={object} />;
    } else {
      return <div>404 Not Found...</div>;
    }
  };

  const [isInitialMount, setIsInitialMount] = useState(true);
  const treeUpdate = useSelector((state) => state.tree.treeUpdate);
  const { getResource, resource } = useRequestResource({ endpoint: `/suite/${type}` });

  useEffect(() => {
    if (!isInitialMount) {
        if (type != ROOT) {
            getResource(object.id);
        } else {
            getResource();
        }
    } else {
        setIsInitialMount(false);
    }
  }, [treeUpdate]);

  useEffect(() => {
    if (resource) {
        if (type === FOLDER) {
          store.dispatch({ type: actions.GET_FOLDER, payload: resource })
        } else if (type === TESTCASE) {
          store.dispatch({ type: actions.GET_TESTCASE, payload: resource })
        } else if (type === ROOT) {
          store.dispatch({ type: actions.GET_ROOT, payload: resource })
        }
        
    }
  }, [resource])

  return (
    <Card sx={{ paddingTop: padY, paddingLeft: padX, paddingRight: padX, paddingBottom: padY }}>
        <BreadcrumbsTrail type={type} object={object} />
        <h1><span style={{ color: 'gray', fontSize: '22px' }}>
            {type === FOLDER ? KEY_FOLDER(object.id) + ' ' : 
             type === TESTCASE ? KEY_TESTCASE(object.id) + ' ' : 
             ''}
            </span>{object.name}
        </h1>
        <p>{object.description}</p>
        {viewType()}
    </Card>
  );
}

function App() {
  return (
    <Provider store={store}>
      <DetailView />
    </Provider>
  );
}

export default App;