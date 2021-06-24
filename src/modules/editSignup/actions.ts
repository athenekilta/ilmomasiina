import { Signup } from '../../api/signups';
import { DispatchAction } from '../../store/types';
import {
  RESET,
  SIGNUP_DELETE_FAILED,
  SIGNUP_DELETED,
  SIGNUP_LOAD_FAILED,
  SIGNUP_LOADED,
  SIGNUP_SUBMITTING,
  SIGNUP_UPDATE_FAILED,
  SIGNUP_UPDATED,
} from './actionTypes';

export const signupLoaded = (response: Signup.Details) => <const>{
  type: SIGNUP_LOADED,
  payload: {
    signup: response.signup,
    event: response.event,
  },
};

export const signupLoadFailed = () => <const>{ type: SIGNUP_LOAD_FAILED };

export const signupSubmitting = () => <const>{ type: SIGNUP_SUBMITTING };

export const signupUpdateFailed = () => <const>{ type: SIGNUP_UPDATE_FAILED };

export const signupUpdated = () => <const>{ type: SIGNUP_UPDATED };

export const signupDeleteFailed = () => <const>{ type: SIGNUP_DELETE_FAILED };

export const signupDeleted = () => <const>{ type: SIGNUP_DELETED };

export const resetState = () => <const>{ type: RESET };

export const getSignupAndEvent = (id: Signup.Id | string, editToken: string) => async (dispatch: DispatchAction) => {
  try {
    const response = await fetch(`${PREFIX_URL}/api/signups/${id}?editToken=${editToken}`);
    const data = await response.json();
    dispatch(signupLoaded(data as Signup.Details));
    return true;
  } catch (e) {
    dispatch(signupLoadFailed());
    return false;
  }
};

export const updateSignup = (
  signupId: Signup.Id, data: Signup.Update.Body, editToken: string,
) => async (dispatch: DispatchAction) => {
  dispatch(signupSubmitting());
  try {
    const response = await fetch(`${PREFIX_URL}/api/signups/${signupId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        ...data,
        editToken,
      }),
    });
    if (response.status > 299) {
      const error = await response.json();
      throw new Error(error.message);
    }
    dispatch(signupUpdated());
    return true;
  } catch (e) {
    dispatch(signupUpdateFailed());
    return false;
  }
};

export const deleteSignup = (id: Signup.Id, editToken: string) => async (dispatch: DispatchAction) => {
  dispatch(signupSubmitting());
  try {
    const response = await fetch(`${PREFIX_URL}/api/signups/${id}?editToken=${editToken}`, {
      method: 'DELETE',
    });
    if (response.status > 299) {
      throw new Error(response.statusText);
    }
    dispatch(signupDeleted());
    return true;
  } catch (e) {
    dispatch(signupDeleteFailed());
    return false;
  }
};
