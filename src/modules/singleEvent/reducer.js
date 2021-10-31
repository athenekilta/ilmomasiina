import * as ActionTypes from './actionTypes';

const initialState = {
  event: {},
  eventLoading: false,
  eventError: false,
  signup: {},
  signupLoading: false,
  signupError: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ActionTypes.SET_EVENT:
      return {
        ...state,
        event: action.payload,
        eventLoading: false,
      };
    case ActionTypes.SET_EVENTS_LOADING:
      return {
        ...state,
        eventLoading: true,
        eventError: false,
      };
    case ActionTypes.SET_EVENTS_ERROR:
      return {
        ...state,
        eventError: true,
        eventLoading: false,
      };
    case ActionTypes.SET_SIGNUP:
      return {
        ...state,
        signup: action.payload,
        signupLoading: false,
      };
    case ActionTypes.SET_SIGNUP_LOADING:
      return {
        ...state,
        signupLoading: true,
        signupError: false,
      };
    case ActionTypes.SET_SIGNUP_ERROR:
      return {
        ...state,
        signupLoading: false,
        signupError: true,
      };
    case ActionTypes.CLEAR_SIGNUP_ERROR:
      return {
        ...state,
        signupLoading: false,
        signupError: false,
      };
    default:
      return state;
  }
}
