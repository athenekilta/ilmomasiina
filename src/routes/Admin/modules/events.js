import request from 'then-request';
import { push } from 'react-router-redux';

// ------------------------------------
// Constants
// ------------------------------------
export const GET_EVENTLIST_ASYNC = 'GET_EVENTLIST_ASYNC';
export const CREATE_USER = 'CREATE_USER';

// ------------------------------------
// Actions
// ------------------------------------

/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk! */

export const getAdminEventList = () => dispatch =>
  request('GET', '/api/admin/events', {
    headers: { Authorization: localStorage.getItem('id_token') },
  }).then((res) => {
    if (res.statusCode == 500) {
      dispatch(push('/login'));
    } else {
      dispatch({
        type: GET_EVENTLIST_ASYNC,
        payload: JSON.parse(res.body),
      });
    }
  });


export const createUserAsync = data => async (dispatch) => {
  const event = await request('POST', '/api/users', {
    json: data,
    headers: { Authorization: localStorage.getItem('id_token') },
  }).then(res => JSON.parse(res.body))
    .then((res) => {
      dispatch({
        type: CREATE_USER,
        payload: JSON.parse(res.body),
      });

      return res;
    });

  return event;
};

export const actions = {
  getAdminEventList,
  createUserAsync,
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_EVENTLIST_ASYNC]: (state, action) => action.payload,
  [CREATE_USER]: (state, action) => action.payload,
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = [];
export default function counterReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
