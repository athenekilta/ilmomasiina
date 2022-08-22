import { User } from '@tietokilta/ilmomasiina-models/src/services/users';

export interface AdminUsersState {
  users: User.List | null;
  usersLoadError: boolean;
  userCreating: boolean;
}

export type { AdminUsersActions } from './actions';
