import React from 'react';
import { Card } from '@mui/material';
import FolderView from './FolderView';
import TestCaseView from './TestCaseView';
import { Provider, useSelector } from 'react-redux';
import store from '../Redux/store';
import { FOLDER, TESTCASE, ROOT, KEY_FOLDER, KEY_TESTCASE } from '../../constants';
import BreadcrumbsTrail from './BreadcrumbsTrail';
import Directory from '../SideMenu/Directory';

function DetailView() {
  const type = useSelector(state => state.type);
  const object = useSelector(state => state.object);

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

  const padX = '30px';
  const padY = '25px';

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