import {
  EVENTS_LOAD_FAILED,
  EVENTS_LOADED,
  RESET,
  USER_CREATE_FAILED,
  USER_CREATED,
  USER_CREATING,
  USERS_LOAD_FAILED,
  USERS_LOADED,
} from './actionTypes';
import { AdminActions, AdminState } from './types';

const initialState: AdminState = {
  events: null,
  eventsLoadError: false,
  users: null,
  usersLoadError: false,
  userCreating: false,
};

export default function reducer(
  state = initialState,
  action: AdminActions,
): AdminState {
  switch (action.type) {
    case EVENTS_LOADED:
      return {
        ...state,
        events: action.payload,
        eventsLoadError: false,
      };
    case EVENTS_LOAD_FAILED:
      return {
        ...state,
        eventsLoadError: true,
      };
    case USERS_LOADED:
      return {
        ...state,
        users: action.payload,
        usersLoadError: false,
      };
    case USERS_LOAD_FAILED:
      return {
        ...state,
        usersLoadError: true,
      };
    case USER_CREATING:
      return {
        ...state,
        userCreating: true,
      };
    case USER_CREATE_FAILED:
    case USER_CREATED:
      return {
        ...state,
        userCreating: false,
      };
    case RESET:
      return initialState;
    default:
      return state;
  }
}
