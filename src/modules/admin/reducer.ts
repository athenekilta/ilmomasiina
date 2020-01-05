import moment from "moment";
import {
  SET_EVENTS,
  SET_EVENTS_LOADING,
  SET_EVENTS_ERROR,
  SET_ACCESS_TOKEN,
  CLEAR_STATE,
  SET_LOGIN_LOADING,
  SET_LOGIN_ERROR,
  SET_LOGIN_STATUS
} from "./actionTypes";
import { AdminState, AdminActions } from "./types";

const initialState: AdminState = {
  events: [],
  eventsLoading: false,
  eventsError: false,
  accessToken: undefined,
  accessTokenExpires: undefined,
  loginLoading: false,
  loginError: false,
  loggedIn: false
};

export default function reducer(
  state = initialState,
  action: AdminActions
): AdminState {
  switch (action.type) {
    case SET_EVENTS:
      return {
        ...state,
        events: action.payload,
        eventsLoading: false
      };
    case SET_EVENTS_LOADING:
      return {
        ...state,
        eventsLoading: true,
        eventsError: false
      };
    case SET_EVENTS_ERROR:
      return {
        ...state,
        eventsLoading: false,
        eventsError: true
      };
    case SET_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: action.payload,
        accessTokenExpires: moment(new Date())
          .add(60, "m")
          .toDate()
          .toISOString(),
        loginLoading: false
      };
    case SET_LOGIN_LOADING:
      return {
        ...state,
        loginLoading: true,
        loginError: false
      };
    case SET_LOGIN_ERROR:
      return {
        ...state,
        loginLoading: false,
        loginError: true
      };
    case SET_LOGIN_STATUS:
      return {
        ...state,
        loggedIn: action.payload
      };
    case CLEAR_STATE:
      return initialState;
    default:
      return state;
  }
}
