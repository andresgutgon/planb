import { render } from 'react-dom';
import React from 'react';
import { StyleSheet } from 'aphrodite/no-important';
import nprogress from 'nprogress';

import preserver from './routes/Preserver';
import App from './containers/App';

// Configure nprogress spinner
nprogress.configure({ showSpinner: false });

// Re-hydrate Aphrodite from server-generated class names
const rehydrateFrom = document.getElementById('aphro-hydrate');
if ( rehydrateFrom ) {
  StyleSheet.rehydrate(JSON.parse(rehydrateFrom.innerHTML));
}

// Re-hydrate routes HTML
const routesRootEl = document.getElementById('app-routes');
if ( routesRootEl && process.env.NODE_ENV === 'production' ) {
  preserver.store(routesRootEl.innerHTML);
}

const containerEl = document
      .getElementById('container');

if ( process.env.NODE_ENV === 'production' ) {
  render(<App />, containerEl);
} else {
  const AppContainer = require('react-hot-loader').AppContainer;
  const Redbox = require('redbox-react').Redbox;
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
}
