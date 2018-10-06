import { combineReducers } from 'redux';
import locationReducer from './location';
import { routerReducer } from 'react-router-redux';

import admin from '../modules/admin/reducer';
import editor from '../modules/editor/reducer';
import events from '../modules/events/reducer';
import singleEvent from '../modules/singleEvent/reducer';

export const makeRootReducer = asyncReducers =>
  combineReducers({
    location: locationReducer,
    routing: routerReducer,
    admin,
    editor,
    events,
    singleEvent,
    ...asyncReducers,
  });

export const injectReducer = (store, { key, reducer }) => {
  const s = store;

  if (Object.hasOwnProperty.call(s.asyncReducers, key)) return;

  s.asyncReducers[key] = reducer;
  s.replaceReducer(makeRootReducer(s.asyncReducers));
};

export default makeRootReducer;
