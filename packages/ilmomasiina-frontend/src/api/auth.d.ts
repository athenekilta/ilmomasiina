import { AuthResponse as _AuthResponse } from '../../server/services/authentication';
import { StringifyApi } from './utils';

export namespace Auth {
  export type Response = StringifyApi<_AuthResponse>;
}
