import { Event, Quota } from '../../api/events';
import { Signup } from '../../api/signups';
import { DispatchAction } from '../../store/types';
import {
  EVENT_LOAD_FAILED,
  EVENT_LOADED,
  RESET,
  SIGNUP_CANCELLED,
  SIGNUP_COMPLETE,
  SIGNUP_CREATED,
  SIGNUP_SUBMIT_FAILED,
  SIGNUP_SUBMITTING,
} from './actionTypes';

export const resetState = () => <const>{
  type: RESET,
};

export const eventLoaded = (event: Event.Details) => <const>{
  type: EVENT_LOADED,
  payload: event,
};

export const eventLoadFailed = () => <const>{
  type: EVENT_LOAD_FAILED,
};

export const pendingSignupCreated = (signup: Signup.Create.Response) => <const>{
  type: SIGNUP_CREATED,
  payload: signup,
};

export const signupSubmitting = () => <const>{
  type: SIGNUP_SUBMITTING,
};

export const signupComplete = () => <const>{
  type: SIGNUP_COMPLETE,
};

export const signupSubmitFailed = () => <const>{
  type: SIGNUP_SUBMIT_FAILED,
};

export const signupCancelled = () => <const>{
  type: SIGNUP_CANCELLED,
};

export const getEvent = (eventId: Event.Id | string) => async (
  dispatch: DispatchAction,
) => {
  try {
    const response = await fetch(`${PREFIX_URL}/api/events/${eventId}`);
    const event = await response.json();
    dispatch(eventLoaded(event));
  } catch (e) {
    dispatch(eventLoadFailed());
  }
};

export const createPendingSignup = (quotaId: Quota.Id) => async (dispatch: DispatchAction) => {
  dispatch(signupSubmitting());
  try {
    const response = await fetch(`${PREFIX_URL}/api/signups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ quotaId }),
    });
    const signup = await response.json();
    dispatch(pendingSignupCreated(signup as Signup.Create.Response));
    return true;
  } catch (e) {
    dispatch(signupSubmitFailed());
    return false;
  }
};

export const completeSignup = (
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
    dispatch(signupComplete());
    return true;
  } catch (e) {
    dispatch(signupSubmitFailed());
    return false;
  }
};

export const cancelPendingSignup = (signupId: Signup.Id, editToken: string) => async (dispatch: DispatchAction) => {
  dispatch(signupSubmitting());
  try {
    const response = await fetch(`${PREFIX_URL}/api/signups/${signupId}?editToken=${editToken}`, {
      method: 'DELETE',
    });
    if (response.status > 299) {
      throw new Error(response.statusText);
    }
    dispatch(signupCancelled());
    return true;
  } catch (e) {
    // TODO: Own state variable for this? We don't want signupSubmitFailed() as that would show up as
    //  a form error in the UI.
    dispatch(signupCancelled());
    return false;
  }
};
