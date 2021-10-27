import {
  EVENT_LOAD_FAILED,
  EVENT_LOADED,
  RESET,
  SIGNUP_CREATE_FAILED,
  SIGNUP_CREATED,
  SIGNUP_CREATING,
} from './actionTypes';
import { SingleEventActions, SingleEventState } from './types';

const initialState: SingleEventState = {
  event: null,
  eventLoadError: false,
  creatingSignup: false,
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
        creatingSignup: false,
      };
    case SIGNUP_CREATING:
      return {
        ...state,
        creatingSignup: true,
      };
    case SIGNUP_CREATE_FAILED:
      return {
        ...state,
        creatingSignup: false,
      };
    default:
      return state;
  }
}
