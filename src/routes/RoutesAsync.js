import React from 'react';
import nprogress from 'nprogress';

/**
 * Hight Order Component to make code splitting with React Router 4
 * Taken from here: https://medium.com/@apostolos/server-side-rendering-code-splitting-and-hot-reloading-with-react-router-v4-87239cfc172c#.epngc9khn
 */
let firstRoute = true;
function asyncRoute(getComponent) {
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

/**
 * NOTE: to make Hot Module Reloading work we load
 * all the javascript on an unique webpack bundle.
 * In production we use async loaded routs. Take a look into
 * './RoutesAsync.js'
 * This implies route declarations duplications.
 * But I think is a trade off we can accept to have:
 * 1. Async routes on production
 * 2. Hot Reloading on development
 *
 * IMPORTANT:
 * remember to add the route also in './RoutesAsync.js'
 */
export const Home = asyncRoute(() => import('./Home'));
export const HelloWorld = asyncRoute(() => import('./HelloWorld'));
export const Bye = asyncRoute(() => import('./Bye'));
