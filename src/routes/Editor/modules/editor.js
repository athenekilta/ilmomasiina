import request from 'then-request';

// // ------------------------------------
// // Constants
// // ------------------------------------
export const UPDATE_EVENT = 'UPDATE_EVENT';
export const UPDATE_EVENT_FIELD = 'UPDATE_EVENT_FIELD';
export const PUBLISH_EVENT = 'PUBLISH_EVENT';

// ------------------------------------
// Actions
// ------------------------------------

export const updateEvent = event => (dispatch) => {
  dispatch({
    type: UPDATE_EVENT,
    payload: event,
  });
};

export const updateEventField = (field, value) => (dispatch) => {
  dispatch({
    type: UPDATE_EVENT_FIELD,
    payload: {
      field,
      value,
    },
  });
};

export const publishEventAsync = data => async (dispatch) => {
  await request('POST', '/api/events', { json: data })
    .then(res => JSON.parse(res.body))
    .then((res) => {
      console.log('CREATED', res);
    });
};

export const updateEventAsync = data => async (dispatch) => {
  await request('PATCH', '/api/events', { json: data })
    .then(res => JSON.parse(res.body))
    .then((res) => {
      console.log('PATCHED', res);
    })
};

export const getEventAsync = eventId => async (dispatch) => {
  await request('GET', `/api/events/${eventId}`)
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
  updateEventField,
  getEventAsync,
  publishEventAsync,
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
  [UPDATE_EVENT_FIELD]: (state, action) => {
    return {
      ...state,
      event: {
        ...state.event,
        [action.payload.field]: action.payload.value,
      },
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
