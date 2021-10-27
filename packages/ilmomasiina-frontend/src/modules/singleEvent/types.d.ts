import { Event } from '@tietokilta/ilmomasiina-models/src/services/events';
import {
  creatingSignup,
  eventLoaded,
  eventLoadFailed,
  pendingSignupCreated,
  resetState,
  signupCreationFailed,
} from './actions';

interface SingleEventState {
  event: Event.Details | null;
  eventLoadError: boolean;
  creatingSignup: boolean;
}

type SingleEventActions =
  | ReturnType<typeof resetState>
  | ReturnType<typeof eventLoaded>
  | ReturnType<typeof eventLoadFailed>
  | ReturnType<typeof pendingSignupCreated>
  | ReturnType<typeof creatingSignup>
  | ReturnType<typeof signupCreationFailed>;
