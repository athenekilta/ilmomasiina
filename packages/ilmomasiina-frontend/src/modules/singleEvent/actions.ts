import { push } from 'connected-react-router';

import { Event, Quota } from '@tietokilta/ilmomasiina-models/src/services/events';
import { Signup } from '@tietokilta/ilmomasiina-models/src/services/signups';
import apiFetch from '../../api';
import paths from '../../paths';
import { DispatchAction } from '../../store/types';
import {
  EVENT_LOAD_FAILED,
  EVENT_LOADED,
  RESET,
  SIGNUP_CREATE_FAILED,
  SIGNUP_CREATED,
  SIGNUP_CREATING,
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

export const creatingSignup = () => <const>{
  type: SIGNUP_CREATING,
};

export const signupCreationFailed = () => <const>{
  type: SIGNUP_CREATE_FAILED,
};

export type SingleEventActions =
  | ReturnType<typeof resetState>
  | ReturnType<typeof eventLoaded>
  | ReturnType<typeof eventLoadFailed>
  | ReturnType<typeof pendingSignupCreated>
  | ReturnType<typeof creatingSignup>
  | ReturnType<typeof signupCreationFailed>;

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
  dispatch(creatingSignup());
  try {
    const response = await apiFetch('signups', {
      method: 'POST',
      body: { quotaId },
    }) as Signup.Create.Response;
    dispatch(pendingSignupCreated(response));
    dispatch(push(paths.editSignup(response.id, response.editToken)));
    return true;
  } catch (e) {
    dispatch(signupCreationFailed());
    return false;
  }
};
