import moment from 'moment';

import { LOGGING_IN, LOGIN_FAILED, LOGIN_SUCCEEDED } from './actionTypes';
import { AuthActions, AuthState } from './types';

const initialState: AuthState = {
  accessToken: undefined,
  accessTokenExpires: undefined,
  loggingIn: false,
  loginError: false,
  loggedIn: false,
};

export default function reducer(
  state = initialState,
  action: AuthActions,
): AuthState {
  switch (action.type) {
    case LOGIN_SUCCEEDED:
      return {
        ...state,
        accessToken: action.payload,
        // TODO: use actual expiration
        accessTokenExpires: moment(new Date())
          .add(60, 'm')
          .toDate()
          .toISOString(),
        loggingIn: false,
        loggedIn: true,
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
