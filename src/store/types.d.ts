import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { Action, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { AdminActions } from '../modules/admin/types';
import { EditorActions } from '../modules/editor/types';
import { EditSignupActions } from '../modules/editSignup/types';
import { EventsActions } from '../modules/events/types';
import { SingleEventActions } from '../modules/singleEvent/types';
import { makeRootReducer } from './reducers';

type AppState = ReturnType<typeof makeRootReducer>;

type AppActions =
  | AdminActions
  | EditorActions
  | EditSignupActions
  | EventsActions
  | SingleEventActions;

type AsyncAction<R = void> = ThunkAction<
  Promise<R>,
  AppState,
  undefined,
  AnyAction
>;

type DispatchAction<T extends AnyAction = Action> = ThunkDispatch<
  AppState,
  undefined,
  T
>;

type GetState = () => AppState;

export const useTypedSelector: TypedUseSelectorHook<AppState> = useSelector;
export const useTypedDispatch: () => DispatchAction = useDispatch;
