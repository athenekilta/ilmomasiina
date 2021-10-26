import { Event, Quota } from '@tietokilta/ilmomasiina-models/src/services/events';
import { Signup } from '@tietokilta/ilmomasiina-models/src/services/signups';
import apiFetch from '../../api';
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

export const getEvent = (slug: Event.Slug) => async (
  dispatch: DispatchAction,
) => {
  try {
    const response = await apiFetch(`events/${slug}`) as Event.Details;
    dispatch(eventLoaded(response));
  } catch (e) {
    dispatch(eventLoadFailed());
  }
};

export const createPendingSignup = (quotaId: Quota.Id) => async (dispatch: DispatchAction) => {
  dispatch(signupSubmitting());
  try {
    const response = await apiFetch('signups', {
      method: 'POST',
      body: { quotaId },
    }) as Signup.Create.Response;
    dispatch(pendingSignupCreated(response));
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
    await apiFetch(`signups/${signupId}`, {
      method: 'PATCH',
      body: {
        ...data,
        editToken,
      },
    });
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
    await apiFetch(`signups/${signupId}?editToken=${editToken}`, {
      method: 'DELETE',
    });
    dispatch(signupCancelled());
    return true;
  } catch (e) {
    // TODO: Own state variable for this? We don't want signupSubmitFailed() as that would show up as
    //  a form error in the UI.
    dispatch(signupCancelled());
    return false;
  }
};
