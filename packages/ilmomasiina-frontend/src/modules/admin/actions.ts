import { AdminEvent } from '@tietokilta/ilmomasiina-api/src/services/admin/events';
import { User } from '@tietokilta/ilmomasiina-api/src/services/users';
import apiFetch from '../../api';
import { DispatchAction, GetState } from '../../store/types';
import {
  EVENTS_LOAD_FAILED,
  EVENTS_LOADED,
  RESET,
  USER_CREATE_FAILED,
  USER_CREATED,
  USER_CREATING,
  USERS_LOAD_FAILED,
  USERS_LOADED,
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

export const usersLoaded = (users: User.List) => <const>{
  type: USERS_LOADED,
  payload: users,
};

export const usersLoadFailed = () => <const>{
  type: USERS_LOAD_FAILED,
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

export const getUsers = () => async (dispatch: DispatchAction, getState: GetState) => {
  const { accessToken } = getState().auth;

  try {
    const response = await apiFetch('users', { accessToken });
    dispatch(usersLoaded(response as User.List));
  } catch (e) {
    dispatch(usersLoadFailed());
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

export const deleteUser = (id: User.Id) => async (_dispatch: DispatchAction, getState: GetState) => {
  const { accessToken } = getState().auth;

  try {
    await apiFetch(`users/${id}`, {
      accessToken,
      method: 'DELETE',
    });
    return true;
  } catch (e) {
    return false;
  }
};
