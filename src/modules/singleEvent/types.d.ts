import { Event } from '../../api/events';
import { Signup } from '../../api/signups';
import {
  setEvent,
  setEventError,
  setEventLoading,
  setSignup,
  setSignupError,
  setSignupLoading,
} from './actions';

interface SingleEventState {
  event: Event.Details | null;
  eventLoading: boolean;
  eventError: boolean;
  signup: Signup.Create.Response | null;
  signupLoading: boolean;
  signupError: boolean;
}

type SingleEventActions =
  | ReturnType<typeof setEvent>
  | ReturnType<typeof setEventLoading>
  | ReturnType<typeof setEventError>
  | ReturnType<typeof setSignup>
  | ReturnType<typeof setSignupLoading>
  | ReturnType<typeof setSignupError>;
