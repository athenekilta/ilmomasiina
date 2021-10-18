import {
  EVENT_LOAD_FAILED,
  EVENT_LOADED,
  RESET,
  SIGNUP_CANCELLED,
  SIGNUP_COMPLETE,
  SIGNUP_CREATED,
  SIGNUP_SUBMIT_FAILED,
  SIGNUP_SUBMITTING,
} from './actionTypes';
import { SingleEventActions, SingleEventState } from './types';

const initialState: SingleEventState = {
  event: null,
  eventLoadError: false,
  signup: null,
  signupSubmitting: false,
  signupSubmitError: false,
};

export default function reducer(
  state = initialState,
  action: SingleEventActions,
): SingleEventState {
  switch (action.type) {
    case RESET:
      return initialState;
    case EVENT_LOADED:
      return {
        ...state,
        event: action.payload,
        eventLoadError: false,
      };
    case EVENT_LOAD_FAILED:
      return {
        ...state,
        eventLoadError: true,
      };
    case SIGNUP_CREATED:
      return {
        ...state,
        signup: action.payload,
        signupSubmitting: false,
      };
    case SIGNUP_SUBMITTING:
      return {
        ...state,
        signupSubmitting: true,
      };
    case SIGNUP_SUBMIT_FAILED:
      return {
        ...state,
        signupSubmitting: false,
        signupSubmitError: true,
      };
    case SIGNUP_COMPLETE:
      return {
        ...state,
        signupSubmitting: false,
        signupSubmitError: false,
      };
    case SIGNUP_CANCELLED:
      return {
        ...state,
        signup: null,
        signupSubmitting: false,
        signupSubmitError: false,
      };
    default:
      return state;
  }
}
