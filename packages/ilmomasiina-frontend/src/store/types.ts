import { Action, AnyAction, Store } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { AdminActions } from '../modules/admin/types';
import { EditorActions } from '../modules/editor/types';
import { EditSignupActions } from '../modules/editSignup/types';
import { makeRootReducer } from './reducers';

export type AppReducer = ReturnType<typeof makeRootReducer>;
export type AppState = ReturnType<AppReducer>;

export type AppActions =
  | AdminActions
  | EditorActions
  | EditSignupActions;

export type AsyncAction<R = void> = ThunkAction<
Promise<R>,
AppState,
undefined,
AnyAction
>;

export type DispatchAction<T extends AnyAction = Action> = ThunkDispatch<
AppState,
undefined,
T
>;

export type GetState = () => AppState;

export type AppStore = Store<AppState, AppActions>;
