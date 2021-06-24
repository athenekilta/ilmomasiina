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
    const response = await fetch(`${PREFIX_URL}/api/admin/events`, {
      headers: { Authorization: accessToken! },
    });
    const data = await response.json();
    dispatch(eventsLoaded(data as AdminEvent.List));
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
    const response = await fetch(`${PREFIX_URL}/api/admin/events/${id}`, {
      method: 'DELETE',
      headers: { Authorization: accessToken! },
    });
    if (response.status > 299) {
      throw new Error(response.statusText);
    }
    return true;
  } catch (e) {
    return false;
  }
};

export const createUser = (data: User.Create.Body) => async (dispatch: DispatchAction, getState: GetState) => {
  dispatch(userCreating());

  const { accessToken } = getState().auth;

  try {
    const response = await fetch(`${PREFIX_URL}/api/users`, {
      method: 'POST',
      headers: {
        Authorization: accessToken!,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(data),
    });
    if (response.status > 299) {
      throw new Error(response.statusText);
    }
    dispatch(userCreated());
    return true;
  } catch (e) {
    dispatch(userCreateFailed());
    return false;
  }
};
