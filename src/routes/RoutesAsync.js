import React from 'react';
import nprogress from 'nprogress';

/**
 * Hight Order Component to make code splitting with React Router 4
 * Taken from here: https://medium.com/@apostolos/server-side-rendering-code-splitting-and-hot-reloading-with-react-router-v4-87239cfc172c#.epngc9khn
 */
let firstRoute = true;
export default function asyncRoute(getComponent) {
  return class AsyncComponent extends React.Component {
    static Component = null;
    mounted = false;

    state = {
      Component: AsyncComponent.Component
    };

    componentWillMount() {
      if ( this.state.Component === null ) {
        if (!firstRoute) {
          nprogress.start();
        }

        getComponent()
          .then(m => m.default)
          .then(Component => {
            if (firstRoute) {
              firstRoute = false;
            } else {
              nprogress.done();
            }
            AsyncComponent.Component = Component;
            if ( this.mounted ) {
              this.setState({Component});
            }
          })
      }
    }

    componentDidMount() {
      this.mounted = true;
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    render() {
      const {Component} = this.state;

      if ( Component !== null ) {
        return <Component {...this.props} />
      }
      return null; // or <div /> with a loading spinner, etc..
    }
  }
}
