import {
  SET_EVENT,
  SET_EVENT_ERROR,
  SET_EVENT_LOADING,
  SET_SIGNUP,
  SET_SIGNUP_ERROR,
  SET_SIGNUP_LOADING
} from './actionTypes';
import { SingleEventActions, SingleEventState } from './types';

const initialState: SingleEventState = {
  event: {},
  eventLoading: false,
  eventError: false,
  signup: {},
  signupLoading: false,
  signupError: false
};

export default function reducer(
  state = initialState,
  action: SingleEventActions
): SingleEventState {
  switch (action.type) {
    case SET_EVENT:
      return {
        ...state,
        event: action.payload,
        eventLoading: false
      };
    case SET_EVENT_LOADING:
      return {
        ...state,
        eventLoading: true,
        eventError: false
      };
    case SET_EVENT_ERROR:
      return {
        ...state,
        eventError: true,
        eventLoading: false
      };
    case SET_SIGNUP:
      return {
        ...state,
        signup: action.payload,
        signupLoading: false
      };
    case SET_SIGNUP_LOADING:
      return {
        ...state,
        signupLoading: true,
        signupError: false
      };
    case SET_SIGNUP_ERROR:
      return {
        ...state,
        signupLoading: false,
        signupError: true
      };
    default:
      return state;
  }
}
