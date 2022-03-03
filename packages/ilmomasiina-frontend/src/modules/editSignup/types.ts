import { Signup } from '@tietokilta/ilmomasiina-models/src/services/signups';

export interface EditSignupState {
  event: Signup.Details.Event | null;
  signup: Signup.Details.Signup | null;
  loadError: boolean;
  submitting: boolean;
  submitError: boolean;
  deleted: boolean;
}

export type { EditSignupActions } from './actions';
