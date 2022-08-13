import { Static, Type } from '@sinclair/typebox';

import { userEventForSignupSchema } from './event';
import { userSignupSchema } from './signup';

export const userSignupForEditSchema = Type.Object({
  signup: userSignupSchema,
  event: userEventForSignupSchema,
});

export type UserSignupForEditSchema = Static<typeof userSignupForEditSchema>;
