import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk, { ThunkMiddleware } from 'redux-thunk';

import { makeRootReducer } from './reducers';
import { AppActions, AppState } from './types';

export const history = createBrowserHistory();

export default function configureStore(initialState = {}) {
  const middleware = [
    routerMiddleware(history),
    thunk as ThunkMiddleware<AppState, AppActions>,
  ];

  const persistConfig = {
    key: DEV ? 'ilmomasiina-dev' : 'ilmomasiina',
    storage,
    blacklist: ['location', 'router'],
  };

  const persistedReducer = persistReducer(
    persistConfig,
    makeRootReducer({}, history),
  );

  const store = createStore(
    persistedReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware)),
  );
  store.asyncReducers = {};

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default;
      store.replaceReducer(reducers(store.asyncReducers));
    });
  }

  const persistor = persistStore(store);

  return { store, persistor };
}
