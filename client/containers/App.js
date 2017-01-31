import React from 'react';
import BrowserRouter from 'react-router-dom/BrowserRouter';

import Layout from './Layout';

const App = ({ store }) => {
  return (
    <BrowserRouter>
      <Layout/>
    </BrowserRouter>
  )
};

export default App;
