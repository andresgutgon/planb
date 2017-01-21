import React, { Component } from "react";
import {
  BrowserRouter,
  Match,
  Link,
  Miss
} from 'react-router';

import HomeContainer from './containers/Home';
import HelloWordContainer from './containers/HelloWorld';
import NoMatch from './components/NoMatch';

const App = (props) => (
  <BrowserRouter>
    <div className="App container-fluid">
      <div className="App-reddit-selector">
        <Link to="/">Home</Link> - <Link to="/hello-world">Hello World</Link> |
      </div>
      <Match exactly pattern="/" component={HomeContainer}/>
      <Match exactly pattern="/hello-world" component={HelloWordContainer}/>
      <Miss component={NoMatch}/>
    </div>
  </BrowserRouter>
);

export default App;
