import request from 'then-request';
import { push } from 'react-router-redux';
import * as ActionTypes from './actionTypes';

export const setEvents = events => (dispatch) => {
  dispatch({
    type: ActionTypes.SET_EVENTS,
    payload: events,
  });
};

export const setEventsLoading = () => (dispatch) => {
  dispatch({
    type: ActionTypes.SET_EVENTS_LOADING,
  });
};

export const setEventsError = () => (dispatch) => {
  dispatch({
    type: ActionTypes.SET_EVENTS_ERROR,
  });
};

export const getEventsAsync = () => (dispatch, getState) => {
  dispatch(setEventsLoading());

  const accessToken = getState().admin.accessToken;

  request('GET', '/api/admin/events', {
    headers: { Authorization: accessToken },
  })
    .then(res => JSON.parse(res.body))
    .then((res) => {
      dispatch(setEvents(res));
    })
    .catch((error) => {
      console.error('Error in getEventsAsync', error);
      dispatch(setEventsError());
    });
};

export const setAccessToken = token => (dispatch) => {
  dispatch({
    type: ActionTypes.SET_ACCESS_TOKEN,
    payload: token,
  });
};

export const clearState = () => (dispatch) => {
  dispatch({
    type: ActionTypes.CLEAR_STATE,
  });
};

export const setLoginLoading = () => (dispatch) => {
  dispatch({
    type: ActionTypes.SET_LOGIN_LOADING,
  });
};

export const setLoginError = () => (dispatch) => {
  dispatch({
    type: ActionTypes.SET_LOGIN_ERROR,
  });
};

export const login = (email, password) => (dispatch) => {
  dispatch(setLoginLoading());

  request('POST', '/api/authentication', {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `strategy=local&email=${email}&password=${password}`,
  })
    .then((res) => {
      if (res.statusCode >= 300) {
        dispatch(setLoginError());
        return res;
      }
      return JSON.parse(res.body);
    })
    .then((res) => {
      dispatch(setAccessToken(res.accessToken));
      dispatch(push('/admin'));
    })
    .catch((error) => {
      console.error('Error in login', error);
      dispatch(setLoginError());
    });
};

export const redirectToLogin = () => (dispatch) => {
  dispatch(clearState());
  dispatch(push('/login'));
};

export const logout = () => (dispatch) => {
  dispatch(clearState());
  dispatch(push('/'));
};
