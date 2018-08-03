import { combineReducers } from 'redux';
import locationReducer from './location';
import { routerReducer } from 'react-router-redux';

export const makeRootReducer = asyncReducers =>
  combineReducers({
    location: locationReducer,
    routing: routerReducer,
    ...asyncReducers,
  });

export const injectReducer = (store, { key, reducer }) => {
  const s = store;

  if (Object.hasOwnProperty.call(s.asyncReducers, key)) return;

  s.asyncReducers[key] = reducer;
  s.replaceReducer(makeRootReducer(s.asyncReducers));
};

export default makeRootReducer;
