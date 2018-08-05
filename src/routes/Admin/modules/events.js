import request from 'then-request';

// ------------------------------------
// Constants
// ------------------------------------
export const GET_EVENTLIST_ASYNC = 'GET_EVENTLIST_ASYNC';

// ------------------------------------
// Actions
// ------------------------------------

/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk! */

export const getAdminEventList = () => dispatch =>
  request('GET', 'http://localhost:3000/api/admin/events', {
    headers: { Authorization: localStorage.getItem('id_token') },
  }).then((res) => {
    console.log(JSON.parse(res.body));

    dispatch({
      type: GET_EVENTLIST_ASYNC,
      payload: JSON.parse(res.body),
    });
  });

export const actions = {
  getAdminEventList,
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_EVENTLIST_ASYNC]: (state, action) => action.payload,
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = [];
export default function counterReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
