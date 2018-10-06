import React from 'react';

// This function takes a component...
function wrap(WrappedComponent, store) {
  // ...and returns another component...
  return class extends React.Component {
    render() {
      console.log('PROPS', this.props);
      console.log('STORE', store);
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return <WrappedComponent {...this.props} />;
    }
  };
}

export default wrap;
