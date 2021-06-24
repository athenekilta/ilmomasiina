import { Event } from '../../api/events';
import { DispatchAction } from '../../store/types';
import {
  EVENTS_LOAD_FAILED,
  EVENTS_LOADED,
  RESET,
} from './actionTypes';

export const eventsLoaded = (events: Event.List) => <const>{
  type: EVENTS_LOADED,
  payload: events,
};

export const eventsLoadFailed = () => <const>{
  type: EVENTS_LOAD_FAILED,
};

export const resetState = () => <const>{
  type: RESET,
};

export const getEvents = () => async (dispatch: DispatchAction) => {
  try {
    const response = await fetch(`${PREFIX_URL}/api/events`);
    const events = await response.json() as Event.List;
    dispatch(eventsLoaded(events));
  } catch (e) {
    dispatch(eventsLoadFailed());
  }
};
