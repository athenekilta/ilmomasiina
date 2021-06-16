import { DispatchAction } from '../../store/types';
import { Answer, Event, Signup } from '../types';
import {
  SET_EVENT,
  SET_EVENT_ERROR,
  SET_EVENT_LOADING,
  SET_SIGNUP,
  SET_SIGNUP_ERROR,
  SET_SIGNUP_LOADING
} from './actionTypes';

export const setEvent = (event: Event) => {
  return <const>{ type: SET_EVENT, payload: event };
};

export const setEventLoading = () => {
  return <const>{ type: SET_EVENT_LOADING };
};

export const setEventError = () => {
  return <const>{ type: SET_EVENT_ERROR };
};

export const setSignup = (signup: Signup) => {
  return <const>{ type: SET_SIGNUP, payload: signup };
};

export const setSignupLoading = () => {
  return <const>{ type: SET_SIGNUP_LOADING };
};

export const setSignupError = () => {
  return <const>{ type: SET_SIGNUP_ERROR };
};

export const updateEventAsync = (eventId: string) => (
  dispatch: DispatchAction
) => {
  dispatch(setEventLoading());
  return fetch(`${PREFIX_URL}/api/events/${eventId}`)
    .then(res => res.json())
    .then(res => {
      dispatch(setEvent(res));
    })
    .catch(error => {
      dispatch(setEventError());
    });
};

export const attachPositionAsync = (quotaId: string) => (
  dispatch: DispatchAction
) => {
  dispatch(setSignupLoading());
  return fetch(`${PREFIX_URL}/api/signups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ quotaId })
  })
    .then(res => res.json())
    .then(res => {
      dispatch(setSignup(res));
    })
    .catch(error => {
      dispatch(setSignupError());
    });
};

export interface SignupData {
  editToken: string;
  firstName: string;
  lastName: string;
  email: string;
  answers: Answer[];
}

export function completeSignup(signupId: string, data: SignupData) {
  return function(dispatch: DispatchAction) {
    dispatch(setSignupLoading());

    return fetch(`${PREFIX_URL}/api/signups/${signupId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(res => {
        if (res.code && res.code !== 200) {
          throw new Error(res.message);
        }
        dispatch(setSignup(res));
        return true;
      })
      .catch(error => {
        dispatch(setSignupError());
        return false;
      });
  };
}

export function cancelSignupAsync(signupId: string, editToken: string) {
  return function(dispatch: DispatchAction) {
    dispatch(setSignupLoading());
    return fetch(
      `${PREFIX_URL}/api/signups/${signupId}?editToken=${editToken}`,
      {
        method: 'DELETE'
      }
    )
      .then(res => res.json())
      .then(() => {
        dispatch(setSignup({}));
      })
      .catch(error => {
        dispatch(setSignupError());
      });
  };
}
