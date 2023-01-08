import type { UserListResponse } from '@tietokilta/ilmomasiina-models';

export interface AdminUsersState {
  users: UserListResponse | null;
  usersLoadError: boolean;
  userCreating: boolean;
}

export type { AdminUsersActions } from './actions';
