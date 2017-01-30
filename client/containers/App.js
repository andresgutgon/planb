import React from 'react';
import BrowserRouter from 'react-router/BrowserRouter';

import Layout from './Layout';

const App = (props) => (
  <BrowserRouter>
    {
      ({ action, location, router }) =>
        <Layout router={router} action={action} location={location} store={props.store} />
    }
  </BrowserRouter>
);

export default App;
