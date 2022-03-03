import { AdminEvent } from '@tietokilta/ilmomasiina-models/src/services/admin/events';
import { User } from '@tietokilta/ilmomasiina-models/src/services/users';

export interface AdminState {
  events: AdminEvent.List | null;
  eventsLoadError: boolean;
  users: User.List | null;
  usersLoadError: boolean;
  userCreating: boolean;
}

export type { AdminActions } from './actions';
