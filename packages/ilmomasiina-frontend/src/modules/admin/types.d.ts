import { AdminEvent } from '../../api/adminEvents';
import { User } from '../../api/users';
import {
  eventsLoaded,
  eventsLoadFailed,
  resetState,
  userCreated,
  userCreateFailed,
  userCreating,
  usersLoaded,
  usersLoadFailed,
} from './actions';

interface AdminState {
  events: AdminEvent.List | null;
  eventsLoadError: boolean;
  users: User.List | null;
  usersLoadError: boolean;
  userCreating: boolean;
}

type AdminActions =
  | ReturnType<typeof eventsLoaded>
  | ReturnType<typeof eventsLoadFailed>
  | ReturnType<typeof usersLoaded>
  | ReturnType<typeof usersLoadFailed>
  | ReturnType<typeof userCreateFailed>
  | ReturnType<typeof userCreating>
  | ReturnType<typeof userCreated>
  | ReturnType<typeof resetState>;
