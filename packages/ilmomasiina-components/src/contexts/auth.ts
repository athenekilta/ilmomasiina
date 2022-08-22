import { createContext } from 'react';

export interface AuthState {
  accessToken?: string;
  loggedIn: boolean;
}

const AuthContext = createContext<AuthState>({
  loggedIn: false,
});

export default AuthContext;
