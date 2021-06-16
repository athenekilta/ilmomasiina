import { push } from 'connected-react-router';

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
  SET_LOGIN_STATUS,
} from './actionTypes';

export const setEvents = (events: Event[]) => <const>{
  type: SET_EVENTS,
  payload: events,
};

export const setEventsLoading = () => <const>{
  type: SET_EVENTS_LOADING,
};

export const setEventsError = () => <const>{
  type: SET_EVENTS_ERROR,
};

export const setAccessToken = (token: string) => <const>{
  type: SET_ACCESS_TOKEN,
  payload: token,
};

export const clearState = () => <const>{
  type: CLEAR_STATE,
};

export const setLoginStatus = () => <const>{
  type: SET_LOGIN_STATUS,
  payload: true,
};

export const setLoginLoading = () => <const>{
  type: SET_LOGIN_LOADING,
};

export const setLoginError = () => <const>{
  type: SET_LOGIN_ERROR,
};

export function getAdminEvents() {
  return function (dispatch: DispatchAction, getState: GetState) {
    dispatch(setEventsLoading());

    const { accessToken } = getState().admin;

    fetch(`${PREFIX_URL}/api/admin/events`, {
      headers: { Authorization: accessToken },
    })
      .then((res) => res.json())
      .then((res) => {
        dispatch(setEvents(res));
      })
      .catch((error) => {
        dispatch(setEventsError());
      });
  };
}

export const createUser = (data: { email: string }) => (
  _dispatch: DispatchAction,
  getState: GetState,
) => {
  const { accessToken } = getState().admin;

  return fetch(`${PREFIX_URL}/api/users`, {
    method: 'POST',
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then(() => true)
    .catch((error) => false);
};

export function login(email: string, password: string) {
  return function (dispatch: DispatchAction) {
    dispatch(setLoginLoading());

    fetch(`${PREFIX_URL}/api/authentication`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `strategy=local&email=${email}&password=${password}`,
    })
      .then((res) => {
        if (res.status >= 300) {
          dispatch(setLoginError());
          return false;
        }
        return res.json();
      })
      .then((res) => {
        if (!res) {
          return false;
        }
        dispatch(setAccessToken(res.accessToken));
        dispatch(setLoginStatus());
        dispatch(push(`${PREFIX_URL}/admin`));
      })
      .catch((error) => {
        dispatch(setLoginError());
      });
  };
}

export function redirectToLogin() {
  return function (dispatch: DispatchAction) {
    dispatch(clearState());
    dispatch(push(`${PREFIX_URL}/login`));
  };
}

export function deleteEvent(id: string) {
  return function (_dispatch, getState) {
    const { accessToken } = getState().admin;

    return fetch(`${PREFIX_URL}/api/admin/events/${id}`, {
      method: 'DELETE',
      headers: { Authorization: accessToken },
    })
      .then(() => true)
      .catch((error) => false);
  };
}

export function deleteSignupAsync(id: string, eventId: string) {
  return function (dispatch, getState) {
    const { accessToken } = getState().admin;
    return fetch(`${PREFIX_URL}/api/admin/signups/${id}`, {
      method: 'DELETE',
      headers: { Authorization: accessToken },
    })
      .then((res) => res.json())
      .then((res) => {
        dispatch(getEvent(eventId, accessToken)); // TODO UPDATE THE ROWS, THIS DOESNT WORK
        return true;
      })
      .catch((error) => {
        dispatch(setError());
        return false;
      });
  };
}
