import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

import { makeRootReducer } from './reducers';

export const history = createBrowserHistory();

export default function configureStore(initialState = {}) {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [routerMiddleware(history), thunk];

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = [];

  let composeEnhancers = compose;

  if (DEV) {
    const composeWithDevToolsExtension =      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__; // eslint-disable-line
    if (typeof composeWithDevToolsExtension === 'function') {
      composeEnhancers = composeWithDevToolsExtension;
    }
  }

  // ======================================================
  // Redux Persist setup
  // ======================================================
  const persistConfig = {
    key: DEV ? 'ilmomasiina-dev' : 'ilmomasiina',
    storage,
    blacklist: ['location', 'router'],
  };

  const persistedReducer = persistReducer(
    persistConfig,
    makeRootReducer({}, history)
  );

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    persistedReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware), ...enhancers)
  );
  store.asyncReducers = {};

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require("./reducers").default; // eslint-disable-line
      store.replaceReducer(reducers(store.asyncReducers));
    });
  }

  const persistor = persistStore(store);

  return { store, persistor };
}
