import React from 'react';
import ReactDOM from 'react-dom';
import createStore from './store/createStore';
import AppContainer from './containers/AppContainer';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.___INITIAL_STATE__; // eslint-disable-line no-underscore-dangle
const { store, persistor } = createStore(initialState);

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root');

let render = () => {
  ReactDOM.render(<AppContainer store={store} persistor={persistor} />, MOUNT_NODE);
};

// This code is excluded from production bundle
if (DEV) {
  if (module.hot) {
    // Development render functions
    const renderApp = render;
    const renderError = (error) => {
      const RedBox = require('redbox-react').default; // eslint-disable-line

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE);
    };

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp();
      } catch (error) {
        renderError(error);
      }
    };

    // Setup hot module replacement
    module.hot.accept(() =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE);
        render();
      }),
    );
  }
}

// ========================================================
// Go!
// ========================================================
render();
