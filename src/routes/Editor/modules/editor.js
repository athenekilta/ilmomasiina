import request from 'then-request';

// // ------------------------------------
// // Constants
// // ------------------------------------
export const UPDATE_EVENT = 'UPDATE_EVENT';
// export const UPDATE_SIGNUP = 'UPDATE_SIGNUP';
// export const SET_LOADING = 'SET_LOADING';
// export const SET_ERROR = 'SET_ERROR';

// ------------------------------------
// Actions
// ------------------------------------

export const updateEvent = event => (dispatch) => {
  dispatch({
    type: UPDATE_EVENT,
    payload: event,
  });
};

export const getEventAsync = eventId => (dispatch) => {
  request('GET', `/api/events/${eventId}`)
    .then(res => JSON.parse(res.body))
    .then((res) => {
      dispatch({
        type: UPDATE_EVENT,
        payload: res,
      });
    });
};

/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk! */

export const actions = {
  updateEvent,
  getEventAsync,
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const initialState = {
  event: {},
};

const ACTION_HANDLERS = {
  [UPDATE_EVENT]: (state, action) => {
    return {
      ...state,
      event: action.payload,
    };
  },
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function counterReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
