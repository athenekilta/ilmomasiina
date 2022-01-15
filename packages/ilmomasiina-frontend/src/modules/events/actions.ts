import { Event } from '@tietokilta/ilmomasiina-models/src/services/events';
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

export const getEvents = (category?: string) => async (dispatch: DispatchAction) => {
  try {
    const query = category === undefined ? '' : `?${new URLSearchParams({ category })}`;
    const response = await apiFetch(`events${query}`) as Event.List;
    dispatch(eventsLoaded(response));
  } catch (e) {
    dispatch(eventsLoadFailed());
  }
};
