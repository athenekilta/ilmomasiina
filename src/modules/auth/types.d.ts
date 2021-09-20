import { loggingIn, loginFailed, loginSucceeded } from './actions';

interface AuthState {
  accessToken?: string;
  accessTokenExpires?: string;
  loggedIn: boolean;
  loggingIn: boolean;
  loginError: boolean;
}

type AuthActions =
  | ReturnType<typeof loggingIn>
  | ReturnType<typeof loginSucceeded>
  | ReturnType<typeof loginFailed>;
