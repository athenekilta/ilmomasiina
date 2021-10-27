import { Signup } from '@tietokilta/ilmomasiina-models/src/services/signups';
import {
  resetState,
  signupDeleted,
  signupDeleteFailed,
  signupLoaded,
  signupLoadFailed,
  signupSubmitting,
  signupUpdated,
  signupUpdateFailed,
} from './actions';

interface EditSignupState {
  event: Signup.Details.Event | null;
  signup: Signup.Details.Signup | null;
  loadError: boolean;
  submitting: boolean;
  submitError: boolean;
  deleted: boolean;
}

type EditSignupActions =
  | ReturnType<typeof signupLoaded>
  | ReturnType<typeof signupLoadFailed>
  | ReturnType<typeof signupSubmitting>
  | ReturnType<typeof signupUpdateFailed>
  | ReturnType<typeof signupUpdated>
  | ReturnType<typeof signupDeleted>
  | ReturnType<typeof signupDeleteFailed>
  | ReturnType<typeof resetState>;
