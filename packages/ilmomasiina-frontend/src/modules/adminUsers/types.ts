import type { UserListSchema } from '@tietokilta/ilmomasiina-models';

export interface AdminUsersState {
  users: UserListSchema | null;
  usersLoadError: boolean;
  userCreating: boolean;
}

export type { AdminUsersActions } from './actions';
