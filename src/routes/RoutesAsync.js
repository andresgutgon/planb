import React from 'react';

/**
 * Hight Order Component to make code splitting with React Router 4
 * Taken from here: https://medium.com/@apostolos/server-side-rendering-code-splitting-and-hot-reloading-with-react-router-v4-87239cfc172c#.epngc9khn
 */
export default function asyncRoute(getComponent) {
  return class AsyncComponent extends React.Component {
    static Component = null;
    mounted = false;

    state = {
      Component: AsyncComponent.Component
    };

    componentWillMount() {
      if ( this.state.Component === null ) {
        getComponent().then(m => m.default).then(Component => {
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
