import {
  RESET,
  USER_CREATE_FAILED,
  USER_CREATED,
  USER_CREATING,
  USERS_LOAD_FAILED,
  USERS_LOADED,
} from './actionTypes';
import type { AdminUsersActions, AdminUsersState } from './types';

const initialState: AdminUsersState = {
  users: null,
  usersLoadError: false,
  userCreating: false,
};

export default function reducer(
  state = initialState,
  action: AdminUsersActions,
): AdminUsersState {
  switch (action.type) {
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
