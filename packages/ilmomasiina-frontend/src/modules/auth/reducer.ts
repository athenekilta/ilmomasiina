import {
  LOGGING_IN, LOGIN_FAILED, LOGIN_SUCCEEDED, RESET,
} from './actionTypes';
import { AuthActions, AuthState } from './types';

const initialState: AuthState = {
  loggingIn: false,
  loginError: false,
  loggedIn: false,
};

export default function reducer(
  state = initialState,
  action: AuthActions,
): AuthState {
  switch (action.type) {
    case RESET:
      return initialState;
    case LOGIN_SUCCEEDED:
      return {
        ...state,
        loggingIn: false,
        loggedIn: true,
        loginError: false,
      };
    case LOGGING_IN:
      return {
        ...state,
        loggingIn: true,
      };
    case LOGIN_FAILED:
      return {
        ...state,
        loggingIn: false,
        loginError: true,
      };
    default:
      return state;
  }
}
