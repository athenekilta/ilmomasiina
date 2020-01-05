import {
  SET_SIGNUP_AND_EVENT,
  SET_SIGNUP,
  SET_EVENT,
  SET_LOADING,
  SET_ERROR,
  SET_DELETED,
  RESET
} from "./actionTypes";
import { EditSignupState, EditSignupActions } from "./types";

const initialState: EditSignupState = {
  event: {},
  signup: {},
  loading: false,
  error: false,
  deleted: false
};

export default function reducer(
  state = initialState,
  action: EditSignupActions
) {
  switch (action.type) {
    case RESET:
      return initialState;
    case SET_SIGNUP_AND_EVENT:
      return {
        ...state,
        signup: action.payload.signup,
        event: action.payload.event,
        loading: false
      };
    case SET_SIGNUP:
      return {
        ...state,
        signup: action.payload,
        loading: false
      };
    case SET_EVENT:
      return {
        ...state,
        event: action.payload,
        loading: false
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true,
        error: false
      };
    case SET_ERROR:
      return {
        ...state,
        loading: false,
        error: true
      };
    case SET_DELETED: {
      return {
        ...state,
        deleted: true,
        loading: false
      };
    }

    default:
      return state;
  }
}
