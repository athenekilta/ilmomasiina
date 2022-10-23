import { apiFetch } from '@tietokilta/ilmomasiina-components';
import { UserID, UserInviteSchema, UserListSchema } from '@tietokilta/ilmomasiina-models/src/schema';
import { DispatchAction, GetState } from '../../store/types';
import { loginExpired } from '../auth/actions';
import {
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

export const usersLoaded = (users: UserListSchema) => <const>{
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

export type AdminUsersActions =
  | ReturnType<typeof usersLoaded>
  | ReturnType<typeof usersLoadFailed>
  | ReturnType<typeof userCreateFailed>
  | ReturnType<typeof userCreating>
  | ReturnType<typeof userCreated>
  | ReturnType<typeof resetState>;

export const getUsers = () => async (dispatch: DispatchAction, getState: GetState) => {
  const { accessToken } = getState().auth;
  try {
    const response = await apiFetch('admin/users', { accessToken }, () => dispatch(loginExpired()));
    dispatch(usersLoaded(response as UserListSchema));
  } catch (e) {
    dispatch(usersLoadFailed());
  }
};

export const createUser = (data: UserInviteSchema) => async (dispatch: DispatchAction, getState: GetState) => {
  dispatch(userCreating());

  const { accessToken } = getState().auth;

  try {
    await apiFetch('admin/users', {
      accessToken,
      method: 'POST',
      body: data,
    }, () => dispatch(loginExpired()));
    dispatch(userCreated());
    return true;
  } catch (e) {
    dispatch(userCreateFailed());
    return false;
  }
};

export const deleteUser = (id: UserID) => async (dispatch: DispatchAction, getState: GetState) => {
  const { accessToken } = getState().auth;

  try {
    await apiFetch(`admin/users/${id}`, {
      accessToken,
      method: 'DELETE',
    }, () => dispatch(loginExpired()));
    return true;
  } catch (e) {
    return false;
  }
};
