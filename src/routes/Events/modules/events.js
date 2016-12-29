import request from 'then-request';

// ------------------------------------
// Constants
// ------------------------------------
export const GET_EVENTLIST_ASYNC = 'GET_EVENTLIST_ASYNC';

// ------------------------------------
// Actions
// ------------------------------------

/*  Temporary payload. This is going to be loaded from the backend. */

function getApi() {
  return request('GET', '/api/events');
}

/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk! */

export const getEventList = () => (dispatch) => {
  getApi()
    .then(res => JSON.parse(res.body))
    .then((res) => {
      dispatch({
        type: GET_EVENTLIST_ASYNC,
        payload: res,
      });
    });
};

export const actions = {
  getEventList,
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
