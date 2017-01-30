import React, { PropTypes } from 'react';
import Link from 'react-router/Link';
import Match from 'react-router/Match';
import Miss from 'react-router/Miss';

import * as Routes from '../routes/Routes';
import Miss404 from '../routes/miss404';
import Header from '../components/Header';

class Layout extends React.PureComponent {
  render() {
    // TODO: Add Header component here
    return (
      <div>
        <Header />
        <div className="App-reddit-selector">
          <Link to="/">Home</Link> -
          <Link to="/hello-world">Hello World</Link> -
          <Link to="/bye">Bye Bye</Link> -
        </div>
        <div id="planb-routes">
          <Match exactly={true} pattern="/" component={Routes.Home} />
          <Match exactly={true} pattern="/hello-world" component={Routes.HelloWorld} />
          <Match exactly={true} pattern="/bye" component={Routes.Bye} />

          <Miss component={Miss404} />
        </div>
      </div>
    );
  }
}

export default Layout;
