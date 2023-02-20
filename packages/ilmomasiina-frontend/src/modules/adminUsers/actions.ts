import type {
  UserChangePasswordSchema, UserID, UserInviteSchema, UserListResponse,
} from '@tietokilta/ilmomasiina-models';
import adminApiFetch from '../../api';
import type { DispatchAction, GetState } from '../../store/types';
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

export const usersLoaded = (users: UserListResponse) => <const>{
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
    const response = await adminApiFetch('admin/users', { accessToken }, dispatch);
    dispatch(usersLoaded(response as UserListResponse));
  } catch (e) {
    dispatch(usersLoadFailed());
  }
};

export const createUser = (data: UserInviteSchema) => async (dispatch: DispatchAction, getState: GetState) => {
  dispatch(userCreating());

  const { accessToken } = getState().auth;

  try {
    await adminApiFetch('admin/users', {
      accessToken,
      method: 'POST',
      body: data,
    }, dispatch);
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
    await adminApiFetch(`admin/users/${id}`, {
      accessToken,
      method: 'DELETE',
    }, dispatch);
    return true;
  } catch (e) {
    return false;
  }
};

export const resetUserPassword = (id: UserID) => async (dispatch: DispatchAction, getState: GetState) => {
  const { accessToken } = getState().auth;

  try {
    await adminApiFetch(`admin/users/${id}/resetpassword`, {
      accessToken,
      method: 'POST',
    }, dispatch);
    return true;
  } catch (e) {
    return false;
  }
};

export const changePassword = (data: UserChangePasswordSchema) => async (
  dispatch: DispatchAction,
  getState: GetState,
) => {
  const { accessToken } = getState().auth;

  try {
    await adminApiFetch('admin/users/self/changepassword', {
      accessToken,
      method: 'POST',
      body: data,
    }, dispatch);
    return true;
  } catch (e) {
    return false;
  }
};
