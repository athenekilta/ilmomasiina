import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
import { makeRootReducer } from './reducers';
import { updateLocation } from './location';
import { routerMiddleware } from 'react-router-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export default (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [thunk, routerMiddleware(browserHistory)];

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = [];

  let composeEnhancers = compose;

  if (DEV) {
    const composeWithDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__; // eslint-disable-line
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
    blacklist: ['location', 'routing']
  }

  const persistedReducer = persistReducer(persistConfig, makeRootReducer());

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    persistedReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware), ...enhancers),
  );
  store.asyncReducers = {};

  // To unsubscribe, invoke `store.unsubscribeHistory()` anytime
  store.unsubscribeHistory = browserHistory.listen(updateLocation(store));

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default; // eslint-disable-line
      store.replaceReducer(reducers(store.asyncReducers));
    });
  }

  const persistor = persistStore(store);

  return { store, persistor };
};
