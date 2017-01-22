import { render } from 'react-dom';
import React from 'react';
import nprogress from 'nprogress';

import App from './containers/App';

// Configure spinner
nprogress.configure({ showSpinner: false });

const containerEl = document.getElementById('container');

render(<App/>, containerEl
);
