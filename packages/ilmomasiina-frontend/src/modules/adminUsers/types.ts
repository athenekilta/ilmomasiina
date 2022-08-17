import { UserListSchema } from '@tietokilta/ilmomasiina-models/src/schema';

export interface AdminUsersState {
  users: UserListSchema | null;
  usersLoadError: boolean;
  userCreating: boolean;
}

export type { AdminUsersActions } from './actions';
