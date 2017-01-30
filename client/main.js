import 'babel-polyfill';

import { render } from 'react-dom';
import React from 'react';
import { AppContainer } from 'react-hot-loader';
import Redbox from 'redbox-react';
import nprogress from 'nprogress';

import App from './containers/App';

// Configure nprogress spinner
nprogress.configure({ showSpinner: false });

const containerEl = document
      .getElementById('container');

render(
  <AppContainer errorReporter={Redbox}>
    <App/>
  </AppContainer>,
  containerEl
);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./containers/App', () => {
    const App = require('./containers/App').default;

    render(
      <AppContainer>
        <App/>
      </AppContainer>,
      containerEl
    );
  });
}
