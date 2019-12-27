import { push } from 'connected-react-router';
import request from 'then-request';

import * as EditorActions from '../editor/actions.js';
import * as ActionTypes from './actionTypes';

export const setEvents = events => dispatch => {
  dispatch({
    type: ActionTypes.SET_EVENTS,
    payload: events,
  });
};

export const setEventsLoading = () => dispatch => {
  dispatch({
    type: ActionTypes.SET_EVENTS_LOADING,
  });
};

export const setEventsError = () => dispatch => {
  dispatch({
    type: ActionTypes.SET_EVENTS_ERROR,
  });
};

export const getEventsAsync = () => (dispatch, getState) => {
  dispatch(setEventsLoading());

  const { accessToken } = getState().admin;

  request('GET', `${PREFIX_URL}/api/admin/events`, {
    headers: { Authorization: accessToken },
  })
    .then(res => JSON.parse(res.body))
    .then(res => {
      dispatch(setEvents(res));
    })
    .catch(error => {
      console.error('Error in getEventsAsync', error);
      dispatch(setEventsError());
    });
};

export const createUserAsync = data => (dispatch, getState) => {
  const { accessToken } = getState().admin;
  console.log(email);
  return request('POST', `${PREFIX_URL}/api/users`, {
    headers: { Authorization: accessToken },
    json: { email: data.email },
  })
    .then(res => JSON.parse(res.body))
    .then(res => true)
    .catch(error => {
      console.error('Error in createUserAsync', error);
      return false;
    });
};

export const setAccessToken = token => dispatch => {
  dispatch({
    type: ActionTypes.SET_ACCESS_TOKEN,
    payload: token,
  });
};

export const clearState = () => dispatch => {
  dispatch({
    type: ActionTypes.CLEAR_STATE,
  });
};

export const setLoginLoading = () => dispatch => {
  dispatch({
    type: ActionTypes.SET_LOGIN_LOADING,
  });
};

export const setLoginError = () => dispatch => {
  dispatch({
    type: ActionTypes.SET_LOGIN_ERROR,
  });
};

export const login = (email, password) => dispatch => {
  dispatch(setLoginLoading());

  request('POST', `${PREFIX_URL}/api/authentication`, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `strategy=local&email=${email}&password=${password}`,
  })
    .then(res => {
      if (res.statusCode >= 300) {
        dispatch(setLoginError());
        return false;
      }
      return JSON.parse(res.body);
    })
    .then(res => {
      if (!res) {
        return false;
      }
      dispatch(setAccessToken(res.accessToken));
      dispatch({ type: ActionTypes.SET_LOGIN_STATUS, payload: true });
      dispatch(push(`${PREFIX_URL}/admin`));
    })
    .catch(error => {
      console.error('Error in login', error);
      dispatch(setLoginError());
    });
};

export const redirectToLogin = () => dispatch => {
  dispatch(clearState());
  dispatch(push(`${PREFIX_URL}/login`));
};

export const deleteEventAsync = id => (dispatch, getState) => {
  const { accessToken } = getState().admin;

  return request('DELETE', `${PREFIX_URL}/api/admin/events/${id}`, {
    headers: { Authorization: accessToken },
  })
    .then(res => true)
    .catch(error => {
      console.error('Error in deleteEventAsync', error);
      return false;
    });
};

export const deleteSignupAsync = (id, eventId) => (dispatch, getState) => {
  const { accessToken } = getState().admin;
  return request('DELETE', `${PREFIX_URL}/api/admin/signups/${id}`, {
    headers: { Authorization: accessToken },
  })
    .then(res => JSON.parse(res.body))
    .then(res => {
      dispatch(EditorActions.getEventAsync(eventId, accessToken)); // TODO UPDATE THE ROWS, THIS DOESNT WORK
      return true;
    })
    .catch(error => {
      console.error('Error in deleteSignupAsync', error);
      dispatch(setError());
      return false;
    });
};
