import { Event, Signup } from '../types';
import {
  resetEventState,
  setDeleted,
  setError,
  setEvent,
  setLoading,
  setSignup,
  setSignupAndEvent,
} from './actions';

interface EditSignupState {
  event: Event | {};
  signup: Signup | {};
  loading: boolean;
  error: boolean;
  deleted: boolean;
}

type EditSignupActions =
  | ReturnType<typeof setSignupAndEvent>
  | ReturnType<typeof setSignup>
  | ReturnType<typeof setEvent>
  | ReturnType<typeof setLoading>
  | ReturnType<typeof setError>
  | ReturnType<typeof setDeleted>
  | ReturnType<typeof resetEventState>;
