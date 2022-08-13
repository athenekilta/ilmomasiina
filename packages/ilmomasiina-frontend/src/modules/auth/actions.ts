import { push } from 'connected-react-router';
import { toast } from 'react-toastify';

import { apiFetch } from '@tietokilta/ilmomasiina-components';
import { Auth } from '@tietokilta/ilmomasiina-models';
import appPaths from '../../paths';
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

export const loginSucceeded = (payload: Auth.Response) => <const>{
  type: LOGIN_SUCCEEDED,
  payload,
};

export const loginFailed = () => <const>{
  type: LOGIN_FAILED,
};

export const resetState = () => <const>{
  type: RESET,
};

export type AuthActions =
  | ReturnType<typeof loggingIn>
  | ReturnType<typeof loginSucceeded>
  | ReturnType<typeof loginFailed>
  | ReturnType<typeof resetState>;

export const login = (email: string, password: string) => async (dispatch: DispatchAction) => {
  dispatch(loggingIn());

  try {
    const response = await apiFetch('authentication', {
      method: 'POST',
      body: {
        email,
        password,
      },
    }) as Auth.Response;
    dispatch(loginSucceeded(response));
    dispatch(push(appPaths.adminEventsList));
    return true;
  } catch (e) {
    dispatch(loginFailed());
    return false;
  }
};

export const redirectToLogin = () => (dispatch: DispatchAction) => {
  dispatch(resetState());
  dispatch(push(appPaths.adminLogin));
};

export const logout = () => async (dispatch: DispatchAction) => {
  try {
    await apiFetch('authentication', {
      method: 'DELETE',
    });
    dispatch(redirectToLogin());
    toast.success('Uloskirjautuminen onnistui.', {
      autoClose: 10000,
    });
  } catch (e) {
    toast.error('Uloskirjautuminen epäonnistui.', {
      autoClose: 10000,
    });
  }
};

export const loginExpired = () => (dispatch: DispatchAction) => {
  toast.error('Sisäänkirjautumisesi on vanhentunut. Kirjaudu sisään uudelleen.', {
    autoClose: 10000,
  });
  dispatch(redirectToLogin());
};
