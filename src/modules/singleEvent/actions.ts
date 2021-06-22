import { Event, Quota } from '../../api/events';
import { Signup } from '../../api/signups';
import { DispatchAction } from '../../store/types';
import {
  SET_EVENT,
  SET_EVENT_ERROR,
  SET_EVENT_LOADING,
  SET_SIGNUP,
  SET_SIGNUP_ERROR,
  SET_SIGNUP_LOADING,
} from './actionTypes';

export const setEvent = (event: Event.Details | null) => <const>{
  type: SET_EVENT,
  payload: event,
};

export const setEventLoading = () => <const>{
  type: SET_EVENT_LOADING,
};

export const setEventError = () => <const>{
  type: SET_EVENT_ERROR,
};

export const setSignup = (signup: Signup.Create.Response | null) => <const>{
  type: SET_SIGNUP,
  payload: signup,
};

export const setSignupLoading = () => <const>{
  type: SET_SIGNUP_LOADING,
};

export const setSignupError = () => <const>{
  type: SET_SIGNUP_ERROR,
};

export const getEvent = (eventId: number | string) => async (
  dispatch: DispatchAction,
) => {
  dispatch(setEventLoading());
  try {
    const response = await fetch(`${PREFIX_URL}/api/events/${eventId}`);
    const event = await response.json();
    dispatch(setEvent(event));
  } catch (e) {
    dispatch(setEventError());
  }
};

export const clearEvent = () => setEvent(null);

export const createPendingSignup = (quotaId: Quota.Id) => async (dispatch: DispatchAction) => {
  dispatch(setSignupLoading());
  try {
    const response = await fetch(`${PREFIX_URL}/api/signups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ quotaId }),
    });
    const signup = await response.json();
    dispatch(setSignup(signup as Signup.Create.Response));
  } catch (e) {
    dispatch(setSignupError());
  }
};

export const completeSignup = (
  signupId: Signup.Id, data: Signup.Update.Body, editToken: string,
) => async (dispatch: DispatchAction) => {
  dispatch(setSignupLoading());
  try {
    const response = await fetch(`${PREFIX_URL}/api/signups/${signupId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        data,
        editToken,
      }),
    });
    if (response.status > 299) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return true;
  } catch (e) {
    dispatch(setSignupError());
    return false;
  }
};

export const cancelPendingSignup = (signupId: Signup.Id, editToken: string) => async (dispatch: DispatchAction) => {
  dispatch(setSignupLoading());
  try {
    const response = await fetch(`${PREFIX_URL}/api/signups/${signupId}?editToken=${editToken}`, {
      method: 'DELETE',
    });
    if (response.status > 299) {
      throw new Error(response.statusText);
    }
    dispatch(setSignup(null));
  } catch (e) {
    dispatch(setSignupError());
  }
};
