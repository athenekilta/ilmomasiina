export interface AuthState {
  loggedIn: boolean;
  loggingIn: boolean;
  loginError: boolean;
}

export type { AuthActions } from './actions';
