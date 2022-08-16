import { Static, Type } from '@sinclair/typebox';

import { quotaID, singleSignupQuota } from '../quota';
import * as attributes from './attributes';

const signupBooleanConfirmed = Type.Object({
  confirmed: Type.Boolean({ title: 'is the signup confirmed' }),
});

export const signupCreateSchema = Type.Object({
  quotaId: quotaID,
});

export const createdSignupSchema = Type.Intersect([
  attributes.signupIdentity,
  attributes.tokenForEdit,
]);

export const signupUpdateSchema = Type.Intersect([
  Type.Partial(attributes.editableSignupAttributes),
  Type.Partial(attributes.signupAnswers),
]);

export const updatedSignupSchema = Type.Intersect([
  attributes.signupIdentity,
  attributes.confirmationTimestamp,
]);

export const publicSignupSchema = Type.Intersect(
  [
    attributes.userNonEditableSignupAttributes,
    attributes.reducedEditableSignupAttributes,
    attributes.reducedSignupAnswers,
    signupBooleanConfirmed,
  ],
);

export const userSignupSchema = Type.Intersect(
  [
    attributes.signupIdentity,
    attributes.userNonEditableSignupAttributes,
    Type.Partial(attributes.editableSignupAttributes),
    attributes.signupAnswers,
    singleSignupQuota,
    signupBooleanConfirmed,
  ],
);

export const adminSignupSchema = Type.Intersect([
  attributes.signupIdentity,
  attributes.adminNonEditableSignupAttributes,
  Type.Partial(attributes.editableSignupAttributes),
  attributes.signupAnswers,
]);

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
