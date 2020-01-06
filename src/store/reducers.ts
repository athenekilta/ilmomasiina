import { connectRouter } from "connected-react-router";
import { combineReducers, Store, Reducer } from "redux";
import { History } from "history";

import admin from "../modules/admin/reducer";
import editor from "../modules/editor/reducer";
import editSignup from "../modules/editSignup/reducer";
import events from "../modules/events/reducer";
import singleEvent from "../modules/singleEvent/reducer";
import { AppState, AppActions } from "./types";

type AsyncReducers = {
  [key: string]: Reducer;
};

export const makeRootReducer = (
  asyncReducers: AsyncReducers,
  history: History
) =>
  combineReducers({
    router: connectRouter(history),
    admin,
    editor,
    events,
    singleEvent,
    editSignup,
    ...asyncReducers
  });

export const injectReducer = (
  store: Store<AppState, AppActions>,
  { key, reducer }: { key: string; reducer: Reducer }
) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return;

  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};
