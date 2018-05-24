import request from 'then-request';

// ------------------------------------
// Constants
// ------------------------------------
export const UPDATE_EVENT = 'UPDATE_EVENT';
export const UPDATE_SIGNUP = 'UPDATE_SIGNUP';

// ------------------------------------
// Actions
// ------------------------------------

/*  Temporary payload. This is going to be loaded from the backend. */

function _getEvent(id) {
  return request('GET', `/api/events/${id}`);
}

function _attachPosition(quotaId) {
  return request('POST', '/api/signups', { json: { quotaId } });
}

/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk! */

export const updateEventAsync = eventId => (dispatch) => {
  _getEvent(eventId)
    .then(res => JSON.parse(res.body))
    .then(res => {
      dispatch({
        type: UPDATE_EVENT,
        payload: res,
      });
    });
};

export const attachPositionAsync = quotaId => (dispatch) => {
  _attachPosition(quotaId)
    .then(res => JSON.parse(res.body))
    .then(res => {
      dispatch({
        type: UPDATE_SIGNUP,
        payload: res
      });
    });
}

export const actions = {
  updateEventAsync,
  attachPositionAsync
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [UPDATE_EVENT]: (state, action) => {
    return {
      ...state,
      event: action.payload
    }
  },
  [UPDATE_SIGNUP]: (state, action) => {
    return {
      ...state,
      signup: action.payload,
    }
  }
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  event: {},
  signup: {}
};
export default function counterReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
