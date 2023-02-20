import { Static, Type } from '@sinclair/typebox';

import { quotaID } from '../quota/attributes';
import {
  editableSignupAttributes, editToken, publicEditableSignupAttributes, signupDynamicAttributes,
  signupID, signupIdentity,
} from './attributes';

/** Request body for creating a signup. */
export const signupCreateBody = Type.Object({
  quotaId: quotaID,
});

/** Response schema for successfully creating a signup. */
export const signupCreateResponse = Type.Object({
  id: signupID,
  editToken,
});

/** Request body for editing an existing signup. */
export const signupUpdateBody = Type.Partial(editableSignupAttributes);

/** Response schema for successfully editing a signup. */
export const signupUpdateResponse = signupIdentity;

/** Schema for signups in event details from the public API. */
export const publicSignupSchema = Type.Intersect([
  publicEditableSignupAttributes,
  signupDynamicAttributes,
]);

/** Schema for signups in event details from the admin API. */
export const adminSignupSchema = Type.Intersect([
  signupIdentity,
  editableSignupAttributes,
  signupDynamicAttributes,
]);

/** Path parameters necessary to fetch and manipulate signups. */
export const signupPathParams = Type.Object({
  id: signupID,
});

/** Signup ID type. Randomly generated alphanumeric string. */
export type SignupID = Static<typeof signupID>;
/** Signup edit token type. */
export type SignupEditToken = Static<typeof editToken>;

/** Path parameters necessary to fetch and manipulate signups. */
export type SignupPathParams = Static<typeof signupPathParams>;

/** Request body for creating a signup. */
export type SignupCreateBody = Static<typeof signupCreateBody>;
/** Response schema for successfully creating a signup. */
export type SignupCreateResponse = Static<typeof signupCreateResponse>;

/** Request body for editing an existing signup. */
export type SignupUpdateBody = Static<typeof signupUpdateBody>;
/** Response schema for successfully editing a signup. */
export type SignupUpdateResponse = Static<typeof signupUpdateResponse>;

/** Schema for signups in event details from the public API. */
export type PublicSignupSchema = Static<typeof publicSignupSchema>;
/** Schema for signups in event details from the admin API. */
export type AdminSignupSchema = Static<typeof adminSignupSchema>;
