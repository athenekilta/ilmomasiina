import { Event } from '@tietokilta/ilmomasiina-api/src/services/events';
import apiFetch from '../../api';
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
    const response = await apiFetch('events') as Event.List;
    dispatch(eventsLoaded(response));
  } catch (e) {
    dispatch(eventsLoadFailed());
  }
};
