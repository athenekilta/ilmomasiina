import { EventGetResponse } from '../../api/events';
import { SignupCreateResponse } from '../../api/signups';
import {
  setEvent,
  setEventError,
  setEventLoading,
  setSignup,
  setSignupError,
  setSignupLoading,
} from './actions';

interface SingleEventState {
  event: EventGetResponse | null;
  eventLoading: boolean;
  eventError: boolean;
  signup: SignupCreateResponse | null;
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
