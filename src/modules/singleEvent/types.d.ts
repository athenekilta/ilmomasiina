import { Event } from '../../api/events';
import { Signup } from '../../api/signups';
import {
  eventLoaded,
  eventLoadFailed,
  pendingSignupCreated,
  resetState,
  signupCancelled,
  signupComplete,
  signupSubmitFailed,
  signupSubmitting,
} from './actions';

interface SingleEventState {
  event: Event.Details | null;
  eventLoadError: boolean;
  signup: Signup.Create.Response | null;
  signupSubmitting: boolean;
  signupSubmitError: boolean;
}

type SingleEventActions =
  | ReturnType<typeof resetState>
  | ReturnType<typeof eventLoaded>
  | ReturnType<typeof eventLoadFailed>
  | ReturnType<typeof pendingSignupCreated>
  | ReturnType<typeof signupSubmitting>
  | ReturnType<typeof signupSubmitFailed>
  | ReturnType<typeof signupComplete>
  | ReturnType<typeof signupCancelled>;
