import { StringifyApi } from '../../utils';
import { UserDetails } from '../users/details';

// Response schema.
export interface AuthResponse {
  accessToken: string;
  user: UserDetails;
  authentication: {
    strategy: string;
    accessToken: string;
    payload: {
      iat: number;
      exp: number;
    };
  };
}

export namespace Auth {
  export type Response = StringifyApi<AuthResponse>;
}
