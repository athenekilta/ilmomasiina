import { Static, Type } from '@sinclair/typebox';

import { userEventForSignup } from '../event';
import { quota } from '../quota';
import { editableSignupAttributes, signupDynamicAttributes, signupIdentity } from '../signup/attributes';

// This is here because it depends on quota, causing an import cycle.
/** Schema for fetching a signup for editing. */
export const signupForEdit = Type.Intersect([
  signupIdentity,
  editableSignupAttributes,
  Type.Object({
    quota,
  }),
  signupDynamicAttributes,
]);

/** Response schema for fetching a signup for editing. */
export const signupForEditResponse = Type.Object({
  signup: signupForEdit,
  event: userEventForSignup,
});

/** Schema for fetching a signup for editing. */
export type SignupForEdit = Static<typeof signupForEdit>;

/** Response schema for fetching a signup for editing. */
export type SignupForEditResponse = Static<typeof signupForEditResponse>;
