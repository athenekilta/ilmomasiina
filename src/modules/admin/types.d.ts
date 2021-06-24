import { AdminEvent } from '../../api/adminEvents';
import {
  eventsLoaded,
  eventsLoadFailed,
  resetState,
  userCreated,
  userCreateFailed,
  userCreating,
} from './actions';

interface AdminState {
  events: AdminEvent.List | null;
  eventsLoadError: boolean;
  userCreating: boolean;
}

type AdminActions =
  | ReturnType<typeof eventsLoaded>
  | ReturnType<typeof eventsLoadFailed>
  | ReturnType<typeof userCreateFailed>
  | ReturnType<typeof userCreating>
  | ReturnType<typeof userCreated>
  | ReturnType<typeof resetState>;
