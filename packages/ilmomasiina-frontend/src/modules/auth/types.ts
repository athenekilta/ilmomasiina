export interface AuthState {
  accessToken?: string;
  accessTokenExpires?: string;
  loggedIn: boolean;
  loggingIn: boolean;
  loginError: boolean;
}

export type { AuthActions } from './actions';
