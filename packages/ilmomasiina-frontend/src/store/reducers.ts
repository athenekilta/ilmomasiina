import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { combineReducers } from 'redux';

import adminEvents from '../modules/adminEvents/reducer';
import adminUsers from '../modules/adminUsers/reducer';
import auditLog from '../modules/auditLog/reducer';
import auth from '../modules/auth/reducer';
import editor from '../modules/editor/reducer';
import { AppState, DispatchAction } from './types';

export const makeRootReducer = (
  history: History,
) => combineReducers({
  router: connectRouter(history),
  auth,
  adminEvents,
  adminUsers,
  auditLog,
  editor,
});

export const useTypedSelector: TypedUseSelectorHook<AppState> = useSelector;
export const useTypedDispatch: () => DispatchAction = useDispatch;
