import { apiFetch } from '@tietokilta/ilmomasiina-components';
import type { AdminEventList, EventID } from '@tietokilta/ilmomasiina-models';
import { DispatchAction, GetState } from '../../store/types';
import { loginExpired } from '../auth/actions';
import {
  EVENTS_LOAD_FAILED,
  EVENTS_LOADED,
  RESET,
} from './actionTypes';

export const resetState = () => <const>{
  type: RESET,
};

export const eventsLoaded = (events: AdminEventList) => <const>{
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

export const getAdminEvents = () => async (dispatch: DispatchAction, getState: GetState) => {
  const { accessToken } = getState().auth;
  try {
    const response = await apiFetch('admin/events', { accessToken }, () => dispatch(loginExpired()));
    dispatch(eventsLoaded(response as AdminEventList));
  } catch (e) {
    dispatch(eventsLoadFailed());
  }
};

export const deleteEvent = (id: EventID) => async (dispatch: DispatchAction, getState: GetState) => {
  const { accessToken } = getState().auth;
  try {
    await apiFetch(`admin/events/${id}`, {
      accessToken,
      method: 'DELETE',
    }, () => dispatch(loginExpired()));
    return true;
  } catch (e) {
    return false;
  }
};
