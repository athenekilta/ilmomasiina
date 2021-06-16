import { Event, Signup } from '../types';
import {
  setEvent,
  setEventError,
  setEventLoading,
  setSignup,
  setSignupError,
  setSignupLoading
} from './actions';

interface SingleEventState {
  event: { [key: string]: Event } | {};

  eventLoading: boolean;
  eventError: boolean;
  signup: { [key: string]: Signup } | {};
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
