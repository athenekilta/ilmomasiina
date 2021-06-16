import { Event } from '../types';
import {
  clearState,
  setAccessToken,
  setEvents,
  setEventsError,
  setEventsLoading,
  setLoginError,
  setLoginLoading,
  setLoginStatus
} from './actions';

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
