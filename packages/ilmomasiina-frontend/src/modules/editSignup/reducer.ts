import {
  RESET,
  SIGNUP_DELETE_FAILED,
  SIGNUP_DELETED,
  SIGNUP_LOAD_FAILED,
  SIGNUP_LOADED,
  SIGNUP_SUBMITTING,
  SIGNUP_UPDATE_FAILED,
  SIGNUP_UPDATED,
} from './actionTypes';
import { EditSignupActions, EditSignupState } from './types';

const initialState: EditSignupState = {
  event: null,
  signup: null,
  loadError: false,
  submitting: false,
  submitError: false,
  deleted: false,
};

export default function reducer(
  state = initialState,
  action: EditSignupActions,
): EditSignupState {
  switch (action.type) {
    case RESET:
      return initialState;
    case SIGNUP_LOADED:
      return {
        ...state,
        event: action.payload.event,
        signup: action.payload.signup,
      };
    case SIGNUP_LOAD_FAILED:
      return {
        ...state,
        loadError: true,
      };
    case SIGNUP_SUBMITTING:
      return {
        ...state,
        submitting: true,
      };
    case SIGNUP_UPDATE_FAILED:
      return {
        ...state,
        submitting: false,
        submitError: true,
      };
    case SIGNUP_UPDATED:
      return {
        ...state,
        submitting: false,
        submitError: false,
      };
    case SIGNUP_DELETE_FAILED:
      return {
        ...state,
        submitting: false,
      };
    case SIGNUP_DELETED:
      return {
        ...state,
        deleted: true,
        submitting: false,
      };
    default:
      return state;
  }
}
