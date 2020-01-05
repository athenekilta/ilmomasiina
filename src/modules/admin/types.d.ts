import {
  setEvents,
  setEventsLoading,
  setEventsError,
  setAccessToken,
  clearState,
  setLoginStatus,
  setLoginLoading,
  setLoginError
} from "./actions";
import { Event } from "../types";

interface AdminState {
  events: Event[];
  eventsLoading: boolean;
  eventsError: boolean;
  accessToken?: string;
  accessTokenExpires?: string;
  loginLoading: boolean;
  loginError: boolean;
  loggedIn: boolean;
}

type AdminActions =
  | ReturnType<typeof setEvents>
  | ReturnType<typeof setEventsLoading>
  | ReturnType<typeof setEventsError>
  | ReturnType<typeof setAccessToken>
  | ReturnType<typeof clearState>
  | ReturnType<typeof setLoginStatus>
  | ReturnType<typeof setLoginLoading>
  | ReturnType<typeof setLoginError>;
