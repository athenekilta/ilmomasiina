import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { combineReducers } from 'redux';

import admin from '../modules/admin/reducer';
import auth from '../modules/auth/reducer';
import editor from '../modules/editor/reducer';
import { AppState, DispatchAction } from './types';

export const makeRootReducer = (
  history: History,
) => combineReducers({
  router: connectRouter(history),
  auth,
  admin,
  editor,
});

export const useTypedSelector: TypedUseSelectorHook<AppState> = useSelector;
export const useTypedDispatch: () => DispatchAction = useDispatch;
