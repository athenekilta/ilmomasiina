import {
  setEvent,
  setEventLoading,
  setEventError,
  setSignup,
  setSignupLoading,
  setSignupError
} from "./actions";
import { Event, Signup } from "../types";

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
