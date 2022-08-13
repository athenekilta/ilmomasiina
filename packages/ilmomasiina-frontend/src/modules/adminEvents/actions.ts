import { apiFetch } from '@tietokilta/ilmomasiina-components';
import { AdminEvent } from '@tietokilta/ilmomasiina-models/src/services/admin/events';
import { DispatchAction } from '../../store/types';
import { loginExpired } from '../auth/actions';
import {
  EVENTS_LOAD_FAILED,
  EVENTS_LOADED,
  RESET,
} from './actionTypes';

export const resetState = () => <const>{
  type: RESET,
};

export const eventsLoaded = (events: AdminEvent.List) => <const>{
  type: EVENTS_LOADED,
  payload: events,
};

export const eventsLoadFailed = () => <const>{
  type: EVENTS_LOAD_FAILED,
};

export type AdminEventsActions =
  | ReturnType<typeof eventsLoaded>
  | ReturnType<typeof eventsLoadFailed>
  | ReturnType<typeof resetState>;

export const getAdminEvents = () => async (dispatch: DispatchAction) => {
  try {
    const response = await apiFetch('admin/events', {}, () => dispatch(loginExpired()));
    dispatch(eventsLoaded(response as AdminEvent.List));
  } catch (e) {
    dispatch(eventsLoadFailed());
  }
};

export const deleteEvent = (id: AdminEvent.Id) => async (dispatch: DispatchAction) => {
  try {
    await apiFetch(`admin/events/${id}`, {
      method: 'DELETE',
    }, () => dispatch(loginExpired()));
    return true;
  } catch (e) {
    return false;
  }
};
