import {
  EVENTS_LOAD_FAILED,
  EVENTS_LOADED,
  RESET,
} from './actionTypes';
import { EventsActions, EventsState } from './types';

const initialState: EventsState = {
  events: null,
  eventsLoadError: false,
};

export default function reducer(state = initialState, action: EventsActions): EventsState {
  switch (action.type) {
    case EVENTS_LOADED: {
      return {
        ...state,
        events: action.payload,
        eventsLoadError: false,
      };
    }
    case EVENTS_LOAD_FAILED:
      return {
        ...state,
        eventsLoadError: true,
      };
    case RESET:
      return initialState;
    default:
      return state;
  }
}
