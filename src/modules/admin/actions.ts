import { push } from 'connected-react-router';
import request from 'then-request';

import { DispatchAction, GetState } from '../../store/types';
import { getEvent } from '../editor/actions';
import { setError } from '../editSignup/actions';
import { Event } from '../types';
import {
  CLEAR_STATE,
  SET_ACCESS_TOKEN,
  SET_EVENTS,
  SET_EVENTS_ERROR,
  SET_EVENTS_LOADING,
  SET_LOGIN_ERROR,
  SET_LOGIN_LOADING,
  SET_LOGIN_STATUS
} from './actionTypes';

export const setEvents = (events: Event[]) => {
  return <const>{
    type: SET_EVENTS,
    payload: events
  };
};

export const setEventsLoading = () => {
  return <const>{
    type: SET_EVENTS_LOADING
  };
};

export const setEventsError = () => {
  return <const>{
    type: SET_EVENTS_ERROR
  };
};

export const setAccessToken = (token: string) => {
  return <const>{
    type: SET_ACCESS_TOKEN,
    payload: token
  };
};

export const clearState = () => {
  return <const>{
    type: CLEAR_STATE
  };
};

export const setLoginStatus = () => {
  return <const>{
    type: SET_LOGIN_STATUS,
    payload: true
  };
};

export const setLoginLoading = () => {
  return <const>{
    type: SET_LOGIN_LOADING
  };
};

export const setLoginError = () => {
  return <const>{
    type: SET_LOGIN_ERROR
  };
};

export function getAdminEvents() {
  return function(dispatch: DispatchAction, getState: GetState) {
    dispatch(setEventsLoading());

    const { accessToken } = getState().admin;

    request('GET', `${PREFIX_URL}/api/admin/events`, {
      headers: { Authorization: accessToken }
    })
      .then(res => JSON.parse(res.body.toString()))
      .then(res => {
        dispatch(setEvents(res));
      })
      .catch(error => {
        dispatch(setEventsError());
      });
  };
}

export const createUser = (data: { email: string }) => (
  _dispatch: DispatchAction,
  getState: GetState
) => {
  const { accessToken } = getState().admin;

  return request('POST', `${PREFIX_URL}/api/users`, {
    headers: { Authorization: accessToken },
    json: data
  })
    .then(res => JSON.parse(res.body.toString()))
    .then(() => true)
    .catch(error => {
      return false;
    });
};

export function login(email: string, password: string) {
  return function(dispatch: DispatchAction) {
    dispatch(setLoginLoading());

    request('POST', `${PREFIX_URL}/api/authentication`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `strategy=local&email=${email}&password=${password}`
    })
      .then(res => {
        if (res.statusCode >= 300) {
          dispatch(setLoginError());
          return false;
        }
        return JSON.parse(res.body.toString());
      })
      .then(res => {
        if (!res) {
          return false;
        }
        dispatch(setAccessToken(res.accessToken));
        dispatch(setLoginStatus());
        dispatch(push(`${PREFIX_URL}/admin`));
      })
      .catch(error => {
        dispatch(setLoginError());
      });
  };
}

export function redirectToLogin() {
  return function(dispatch: DispatchAction) {
    dispatch(clearState());
    dispatch(push(`${PREFIX_URL}/login`));
  };
}

export function deleteEvent(id: string) {
  return function(_dispatch, getState) {
    const { accessToken } = getState().admin;

    return request('DELETE', `${PREFIX_URL}/api/admin/events/${id}`, {
      headers: { Authorization: accessToken }
    })
      .then(() => true)
      .catch(error => {
        return false;
      });
  };
}

export function deleteSignupAsync(id: string, eventId: string) {
  return function(dispatch, getState) {
    const { accessToken } = getState().admin;
    return request('DELETE', `${PREFIX_URL}/api/admin/signups/${id}`, {
      headers: { Authorization: accessToken }
    })
      .then(res => JSON.parse(res.body.toString()))
      .then(res => {
        dispatch(getEvent(eventId, accessToken)); // TODO UPDATE THE ROWS, THIS DOESNT WORK
        return true;
      })
      .catch(error => {
        dispatch(setError());
        return false;
      });
  };
}
