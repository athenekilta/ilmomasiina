import {
  setSignupAndEvent,
  setSignup,
  setEvent,
  setLoading,
  setError,
  setDeleted,
  resetEventState
} from "./actions";
import { Event, Signup } from "../types";

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
