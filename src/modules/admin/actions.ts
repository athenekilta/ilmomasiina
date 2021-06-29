import apiFetch from '../../api';
import { AdminEvent } from '../../api/adminEvents';
import { Event } from '../../api/events';
import { User } from '../../api/users';
import { DispatchAction, GetState } from '../../store/types';
import {
  EVENTS_LOAD_FAILED,
  EVENTS_LOADED,
  RESET,
  USER_CREATE_FAILED,
  USER_CREATED,
  USER_CREATING,
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

export const userCreating = () => <const>{
  type: USER_CREATING,
};

export const userCreateFailed = () => <const>{
  type: USER_CREATE_FAILED,
};

export const userCreated = () => <const>{
  type: USER_CREATED,
};

export const getAdminEvents = () => async (dispatch: DispatchAction, getState: GetState) => {
  const { accessToken } = getState().auth;

  try {
    const response = await apiFetch('admin/events', { accessToken });
    dispatch(eventsLoaded(response as AdminEvent.List));
  } catch (e) {
    dispatch(eventsLoadFailed());
  }
};

export const deleteEvent = (id: Event.Id) => async (
  _dispatch: DispatchAction,
  getState: GetState,
) => {
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

export const createUser = (data: User.Create.Body) => async (dispatch: DispatchAction, getState: GetState) => {
  dispatch(userCreating());

  const { accessToken } = getState().auth;

  try {
    await apiFetch('users', {
      accessToken,
      method: 'POST',
      body: data,
    });
    dispatch(userCreated());
    return true;
  } catch (e) {
    dispatch(userCreateFailed());
    return false;
  }
};
