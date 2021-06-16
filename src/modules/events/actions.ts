import { DispatchAction } from '../../store/types';
import { Event } from '../types';
import {
  SET_EVENTS,
  SET_EVENTS_ERROR,
  SET_EVENTS_LOADING
} from './actionTypes';

export const setEvents = (events: Event[]) => {
  return <const>{
    type: SET_EVENTS,
    payload: events
  };
};

export const setEventsLoading = () => {
  return <const>{
    type: SET_EVENTS_LOADING
  };
};

export const setEventsError = () => {
  return <const>{
    type: SET_EVENTS_ERROR
  };
};

export function getEvents() {
  return function(dispatch: DispatchAction) {
    dispatch(setEventsLoading());

    fetch(`${PREFIX_URL}/api/events`)
      .then(res => res.json())
      .then(res => {
        dispatch(setEvents(res));
      })
      .catch(error => {
        dispatch(setEventsError());
      });
  };
}
