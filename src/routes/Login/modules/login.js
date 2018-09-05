import request from 'then-request';
import { push } from 'react-router-redux';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

function requestLogin(creds) {
  return {
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds,
  };
}

function receiveLogin(user) {
  return {
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
  };
}

function loginError(message) {
  return {
    type: LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message,
  };
}

export const loginUser = creds => (dispatch) => {
  request('POST', '/api/authentication', {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `strategy=local&email=${creds.email}&password=${creds.password}`,
  })
    .then((res) => {
      if (res.statusCode >= 300) {
        console.log('We have an error');
        dispatch(loginError(res));
        return Promise.reject(res);
      }
      return JSON.parse(res.body);
    })
    .then((res) => {
      localStorage.setItem('id_token', res.accessToken);
      dispatch(receiveLogin());
      dispatch(push('/admin'));
    })
    .catch(err => console.log('Error: ', err));
};

export const actions = {
  loginUser,
};

const ACTION_HANDLERS = {
  [LOGIN_REQUEST]: (state, action) => ({
    ...state,
    isFetching: true,
    isAuthenticated: false,
    user: action.creds,
  }),
  [LOGIN_SUCCESS]: (state, action) => ({
    ...state,
    isFetching: false,
    isAuthenticated: true,
    errorMessage: '',
  }),
  [LOGIN_FAILURE]: (state, action) => ({
    ...state,
    isFetching: false,
    isAuthenticated: false,
    errorMessage: action.message,
  }),
  [LOGOUT_SUCCESS]: (state, action) => ({
    ...state,
    isFetching: true,
    isAuthenticated: false,
  }),
};

export default function loginReducer(state = {}, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
