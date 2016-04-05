
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import PostApp from './components/PostApp';

import PostAppHomeRoute from './routes/PostAppHomeRoute';

ReactDOM.render(
  <Relay.RootContainer
    Component={PostApp}
    route={new PostAppHomeRoute()}
  />,
  document.getElementById('id_main')
);
