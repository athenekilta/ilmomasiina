import { Static, Type } from '@sinclair/typebox';

import { userEventForSignup } from '../event';
import { signupForEdit } from '../signup';

/** Response schema for fetching a signup for editing. */
export const signupForEditResponse = Type.Object({
  signup: signupForEdit,
  event: userEventForSignup,
});

/** Response schema for fetching a signup for editing. */
export type SignupForEditResponse = Static<typeof signupForEditResponse>;
