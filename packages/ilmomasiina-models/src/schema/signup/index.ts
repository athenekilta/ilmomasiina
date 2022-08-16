import { Static, Type } from '@sinclair/typebox';

import { quotaID, singleQuota } from '../quota';
import * as attributes from './attributes';

/** Defines boolean field `confirmed` */
const signupBooleanConfirmed = Type.Object({
  confirmed: Type.Boolean({ title: 'is the signup confirmed' }),
});

/** Describes request body for creating a signup */
export const signupCreateSchema = Type.Object({
  quotaId: quotaID,
});

/** Describes response body for a successful creation of signup */
export const createdSignupSchema = Type.Intersect([
  attributes.signupIdentity,
  attributes.tokenForEdit,
]);

/** Describes request body for editing an existing signup */
export const signupUpdateSchema = Type.Intersect([
  Type.Partial(attributes.editableSignupAttributes),
  Type.Partial(attributes.signupAnswers),
]);

/** Describes a request body for a successful edit of a signup */
export const updatedSignupSchema = Type.Intersect([
  attributes.signupIdentity,
  attributes.confirmationTimestamp,
]);

/** Defines a schema for signup that can be shown publicly */
export const publicSignupSchema = Type.Intersect(
  [
    attributes.userNonEditableSignupAttributes,
    attributes.reducedEditableSignupAttributes,
    attributes.reducedSignupAnswers,
    signupBooleanConfirmed,
  ],
);

/** Defines a schema for signup for the one who created the signup */
export const userSignupSchema = Type.Intersect(
  [
    attributes.signupIdentity,
    attributes.userNonEditableSignupAttributes,
    Type.Partial(attributes.editableSignupAttributes),
    attributes.signupAnswers,
    singleQuota,
    signupBooleanConfirmed,
  ],
);

/** Defines a schema for signup for admins */
export const adminSignupSchema = Type.Intersect([
  attributes.signupIdentity,
  attributes.adminNonEditableSignupAttributes,
  Type.Partial(attributes.editableSignupAttributes),
  attributes.signupAnswers,
]);

/** Defines path parameters for signup endpoints */
export const signupPathParams = Type.Object({
  id: attributes.signupID,
});

export type SignupCreateSchema = Static<typeof signupCreateSchema>;
export type CreatedSignupSchema = Static<typeof createdSignupSchema>;
export type SignupUpdateSchema = Static<typeof signupUpdateSchema>;
export type UpdatedSignupSchema = Static<typeof updatedSignupSchema>;
export type PublicSignupSchema = Static<typeof publicSignupSchema>;
export type UserSignupSchema = Static<typeof userSignupSchema>;
export type AdminSignupSchema = Static<typeof adminSignupSchema>;
export type SignupPathParams = Static<typeof signupPathParams>;
