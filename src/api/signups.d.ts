import {
  SignupCreateBody as _SignupCreateBody,
  SignupCreateResponse as _SignupCreateResponse,
} from '../../server/services/signup/createNewSignup';
import {
  SignupGetResponse as _SignupGetResponse,
} from '../../server/services/signup/getSignupForEdit';
import {
  SignupUpdateBody as _SignupUpdateBody,
  SignupUpdateBodyAnswer as _SignupUpdateBodyAnswer,
  SignupUpdateResponse as _SignupUpdateResponse,
} from '../../server/services/signup/updateSignup';
import { StringifyApi } from './utils';

export type SignupCreateBody = StringifyApi<_SignupCreateBody>;
export type SignupCreateResponse = StringifyApi<_SignupCreateResponse>;
export type SignupGetResponse = StringifyApi<_SignupGetResponse>;
export type SignupUpdateBody = StringifyApi<_SignupUpdateBody>;
export type SignupUpdateBodyAnswer = StringifyApi<_SignupUpdateBodyAnswer>;
export type SignupUpdateResponse = StringifyApi<_SignupUpdateResponse>;
