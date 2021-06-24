import { push } from 'connected-react-router';

import { Auth } from '../../api/auth';
import { DispatchAction } from '../../store/types';
import {
  LOGGING_IN,
  LOGIN_FAILED,
  LOGIN_SUCCEEDED,
  RESET,
} from './actionTypes';

export const loggingIn = () => <const>{
  type: LOGGING_IN,
};

export const loginSucceeded = (token: string) => <const>{
  type: LOGIN_SUCCEEDED,
  payload: token,
};

export const loginFailed = () => <const>{
  type: LOGIN_FAILED,
};

export const resetState = () => <const>{
  type: RESET,
};

export const login = (email: string, password: string) => async (dispatch: DispatchAction) => {
  dispatch(loggingIn());

  try {
    const response = await fetch(`${PREFIX_URL}/api/authentication`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `strategy=local&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    });
    if (response.status > 299) {
      throw new Error(response.statusText);
    }
    const user = await response.json() as Auth.Response;
    dispatch(loginSucceeded(user.accessToken));
    dispatch(push(`${PREFIX_URL}/admin`));
    return true;
  } catch (e) {
    dispatch(loginFailed());
    return false;
  }
};

export const redirectToLogin = () => (dispatch: DispatchAction) => {
  dispatch(resetState());
  dispatch(push(`${PREFIX_URL}/login`));
};
