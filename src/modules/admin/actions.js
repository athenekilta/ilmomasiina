import request from 'then-request';
import { push } from 'react-router-redux';
import * as ActionTypes from './actionTypes';
import * as EditorActions from './../editor/actions.js'
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

export const setUsers = users => dispatch => {
  dispatch({
    type: ActionTypes.SET_USERS,
    payload: users,
  });
};

export const setUsersLoading = () => dispatch => {
  dispatch({
    type: ActionTypes.SET_USERS_LOADING,
  });
};

export const setUsersError = () => dispatch => {
  dispatch({
    type: ActionTypes.SET_USERS_ERROR,
  });
};


export const getEventsAsync = () => (dispatch, getState) => {
  dispatch(setEventsLoading());

  const accessToken = getState().admin.accessToken;

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

export const getUsersAsync = () => (dispatch, getState) => {
  dispatch(setUsersLoading());

  const accessToken = getState().admin.accessToken;

  request('GET', `${PREFIX_URL}/api/users`, {
    headers: { Authorization: accessToken },
  })
    .then(res => JSON.parse(res.body))
    .then(res => {
      dispatch(setUsers(res));
    })
    .catch(error => {
      console.error('Error in getUsersAsync', error);
      dispatch(setUsersError());
    });
};

export const createUserAsync = (data) => (dispatch, getState) => {
  const accessToken = getState().admin.accessToken;
  return request('POST', `${PREFIX_URL}/api/users`, {
    headers: { Authorization: accessToken },
    json: { email: data.email }
  })
    .then(res => JSON.parse(res.body))
    .then(res => {
      if (res.code == 400) {
        return false
      }
      return true
    })
    .catch(error => {
      console.error('Error in createUserAsync', error);
      return false

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
        return false
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
  const accessToken = getState().admin.accessToken;

  return request('DELETE', `${PREFIX_URL}/api/admin/events/${id}`, {
    headers: { Authorization: accessToken },
  })
    .then(res => {
      return true;
    })
    .catch(error => {
      console.error('Error in deleteEventAsync', error);
      return false;
    });
};

export const deleteUserAsync = id => (dispatch, getState) => {
  const accessToken = getState().admin.accessToken;

  return request('DELETE', `${PREFIX_URL}/api/users/${id}`, {
    headers: { Authorization: accessToken },
  })
    .then(res => {
      return true;
    })
    .catch(error => {
      console.error('Error in deleteUserAsync', error);
      return false;
    });
};

export const deleteSignupAsync = (id, eventId) => (dispatch, getState) => {
  const accessToken = getState().admin.accessToken;
  return request('DELETE', `${PREFIX_URL}/api/admin/signups/${id}`, {
    headers: { Authorization: accessToken },
  })
    .then(res => JSON.parse(res.body))
    .then((res) => {
      dispatch(EditorActions.getEventAsync(eventId, accessToken)) // TODO UPDATE THE ROWS, THIS DOESNT WORK
      return true;
    })
    .catch((error) => {
      console.error('Error in deleteSignupAsync', error);
      dispatch(setError());
      return false;
    });
};