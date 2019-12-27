import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';

import admin from '../modules/admin/reducer';
import editor from '../modules/editor/reducer';
import editSignup from '../modules/editSignup/reducer';
import events from '../modules/events/reducer';
import singleEvent from '../modules/singleEvent/reducer';

export const makeRootReducer = (asyncReducers, history) =>
  combineReducers({
    router: connectRouter(history),
    admin,
    editor,
    events,
    singleEvent,
    editSignup,
    ...asyncReducers,
  });

export const injectReducer = (store, { key, reducer }) => {
  const s = store;

  if (Object.hasOwnProperty.call(s.asyncReducers, key)) return;

  s.asyncReducers[key] = reducer;
  s.replaceReducer(makeRootReducer(s.asyncReducers));
};

export default makeRootReducer;
