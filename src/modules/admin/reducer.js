import * as ActionTypes from './actionTypes';

const initialState = {
  events: [],
  eventsLoading: false,
  eventsError: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ActionTypes.SET_EVENTS:
      return {
        ...state,
        events: action.payload,
        eventsLoading: false,
      };
    case ActionTypes.SET_EVENTS_LOADING:
      return {
        ...state,
        eventsLoading: true,
        eventsError: false,
      };
    case ActionTypes.SET_EVENTS_ERROR:
      return {
        ...state,
        eventsLoading: false,
        eventsError: true,
      };
    default:
      return state;
  }
}
