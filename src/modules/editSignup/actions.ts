import apiFetch from '../../api';
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
    const response = await apiFetch(`signups/${id}?editToken=${editToken}`);
    dispatch(signupLoaded(response as Signup.Details));
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
    await apiFetch(`signups/${signupId}`, {
      method: 'PATCH',
      body: {
        ...data,
        editToken,
      },
    });
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
    await apiFetch(`signups/${id}?editToken=${editToken}`, {
      method: 'DELETE',
    });
    dispatch(signupDeleted());
    return true;
  } catch (e) {
    dispatch(signupDeleteFailed());
    return false;
  }
};
