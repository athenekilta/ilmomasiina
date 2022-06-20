import _ from 'lodash';

import { AdminEvent } from '@tietokilta/ilmomasiina-models/src/services/admin/events';
import apiFetch from '../../api';
import { DispatchAction, GetState } from '../../store/types';
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

export const getAdminEvents = () => async (dispatch: DispatchAction, getState: GetState) => {
  const { accessToken } = getState().auth;

  try {
    const response = await apiFetch('admin/events', { accessToken });
    dispatch(eventsLoaded(response as AdminEvent.List));
  } catch (e) {
    dispatch(eventsLoadFailed());
  }
};

export const deleteEvent = (id: AdminEvent.Id) => async (_dispatch: DispatchAction, getState: GetState) => {
  const { accessToken } = getState().auth;

  try {
    await apiFetch(`admin/events/${id}`, {
      accessToken,
      method: 'DELETE',
    });
    return true;
  } catch (e) {
    return false;
  }
};
