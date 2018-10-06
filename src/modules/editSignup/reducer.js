import * as ActionTypes from './actionTypes';

const initialState = {
  event: {},
  signup: {},
  loading: false,
  error: false,
  deleted: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ActionTypes.SET_SIGNUP_AND_EVENT:
      return {
        ...state,
        signup: action.payload.signup,
        event: action.payload.event,
        loading: false,
      };
    case ActionTypes.SET_SIGNUP:
      return {
        ...state,
        signup: action.payload,
        loading: false,
      };
    case ActionTypes.SET_EVENT:
      return {
        ...state,
        event: action.payload,
        loading: false,
      };
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      };
    case ActionTypes.SET_DELETED: {
      return {
        ...state,
        deleted: true,
      };
    }

    default:
      return state;
  }
}
