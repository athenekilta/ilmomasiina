import request from 'then-request';
import moment from 'moment-timezone';
import _ from 'lodash';

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
  const event = await request('POST', '/api/events', { json: data })
    .then(res => JSON.parse(res.body))
    .then((res) => {
      dispatch({
        type: UPDATE_EVENT,
        payload: res,
      });

      return res;
    });

  return event;
};

export const updateEventAsync = data => async (dispatch) => {
  const event = await request('PATCH', `/api/events/${data.id}`, { json: data })
    .then(res => JSON.parse(res.body))
    .then((res) => {
      dispatch({
        type: UPDATE_EVENT,
        payload: res,
      });

      return res;
    });

  return event;
};

export const getEventAsync = eventId => async (dispatch) => {
  const res = await request('GET', `/api/events/${eventId}`)
    .then(res => JSON.parse(res.body))
    .then((res) => {
      dispatch({
        type: UPDATE_EVENT,
        payload: res,
      });
    });

  return res;
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
  [UPDATE_EVENT]: (state, action) => ({
    ...state,
    event: action.payload,
  }),
  [UPDATE_EVENT_FIELD]: (state, action) => ({
    ...state,
    event: {
      ...state.event,
      [action.payload.field]: action.payload.value,
    },
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function counterReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
