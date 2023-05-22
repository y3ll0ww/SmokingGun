import React from 'react';
import { Card } from '@mui/material';
import FolderView from './FolderView';
import TestCaseView from './TestCaseView';
import { Provider, useSelector } from 'react-redux';
import store from '../Redux/store';

function DetailView() {
  const type = useSelector(state => state.type);
  const object = useSelector(state => state.object);

  const viewType = () => {
    if (type === 'folder') {
      return <FolderView type={type} object={object} />;
    } else if (type === 'testcase') {
      return <TestCaseView type={type} object={object} />;
    } else {
      return <div>404 Not Found...</div>;
    }
  };

  const padX = '30px';
  const padY = '25px';

  return (
    <Card sx={{ paddingTop: padY, paddingLeft: padX, paddingRight: padX, paddingBottom: padY }}>
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