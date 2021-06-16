import {
  SET_EVENTS,
  SET_EVENTS_ERROR,
  SET_EVENTS_LOADING,
} from './actionTypes';
import { EventsActions, EventsState } from './types';

const initialState: EventsState = {
  events: {},
  eventsLoading: false,
  eventsError: false,
};

export default function reducer(state = initialState, action: EventsActions) {
  switch (action.type) {
    case SET_EVENTS: {
      return {
        ...state,
        events: action.payload,
        eventsLoading: false,
        eventsError: false,
      };
    }
    case SET_EVENTS_LOADING:
      return {
        ...state,
        eventsLoading: true,
        eventsError: false,
      };
    case SET_EVENTS_ERROR:
      return {
        ...state,
        eventsLoading: false,
        eventsError: true,
      };
    default:
      return state;
  }
}
