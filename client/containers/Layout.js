import React, { PropTypes } from 'react';
import Link from 'react-router-dom/Link';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';

import * as Routes from '../routes/Routes';
import Miss404 from '../routes/miss404';
import Header from '../components/Header';

class Layout extends React.PureComponent {
  render() {
    return (
      <div>
        <Header />
        <div className="App-reddit-selector">
          <Link to="/">Home</Link> -
          <Link to="/hello-world">Hello World</Link> -
          <Link to="/bye">Bye Bye</Link> -
        </div>
        <div id="app-routes">
          <Switch>
            <Route exact path="/" component={Routes.Home} />
            <Route exact path="/hello-world" component={Routes.HelloWorld} />
            <Route exact path="/bye" component={Routes.Bye} />

            <Route component={Miss404} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default Layout;
