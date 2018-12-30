import * as ActionTypes from "./actionTypes";

const initialState = {
  events: [],
  eventsLoading: false,
  eventsError: false,
  accessToken: null,
  loginLoading: false,
  loginError: false,
  loggedIn: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ActionTypes.SET_EVENTS:
      return {
        ...state,
        events: action.payload,
        eventsLoading: false,
      };
    case ActionTypes.SET_EVENTS_LOADING:
      return {
        ...state,
        eventsLoading: true,
        eventsError: false,
      };
    case ActionTypes.SET_EVENTS_ERROR:
      return {
        ...state,
        eventsLoading: false,
        eventsError: true,
      };
    case ActionTypes.SET_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: action.payload,
        loginLoading: false,
      };
    case ActionTypes.SET_LOGIN_LOADING:
      return {
        ...state,
        loginLoading: true,
        loginError: false,
      };
    case ActionTypes.SET_LOGIN_ERROR:
      return {
        ...state,
        loginLoading: false,
        loginError: true,
      };
    case ActionTypes.SET_LOGIN_STATUS:
      return {
        ...state,
        loggedIn: action.payload,
      };
    case ActionTypes.CLEAR_STATE:
      return initialState;
    default:
      return state;
  }
}
