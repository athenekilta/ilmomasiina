import request from 'then-request';

// ------------------------------------
// Constants
// ------------------------------------
export const GET_EVENT_ASYNC = 'GET_EVENT_ASYNC';

// ------------------------------------
// Actions
// ------------------------------------

/*  Temporary payload. This is going to be loaded from the backend. */

function getApi(id) {
  return request('GET', `/api/events/${id}`);
}

/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk! */

export const getEventInfo = eventId => (dispatch) => {
  getApi(eventId)
    .then(res => JSON.parse(res.body))
    .then((res) => {
      dispatch({
        type: GET_EVENT_ASYNC,
        payload: res,
      });
    });
};

export const actions = {
  getEventInfo,
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_EVENT_ASYNC]: (state, action) => action.payload,
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {};
export default function counterReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
