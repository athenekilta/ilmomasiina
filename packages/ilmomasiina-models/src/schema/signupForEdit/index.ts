import { Static, Type } from '@sinclair/typebox';

import { userEventForSignupSchema } from '../event';
import { userSignupSchema } from '../signup';

/** Describes response body for GET signup for edit (contains all required information to edit an existing signup) */
export const userSignupForEditSchema = Type.Object({
  signup: userSignupSchema,
  event: userEventForSignupSchema,
});

export type UserSignupForEditSchema = Static<typeof userSignupForEditSchema>;
