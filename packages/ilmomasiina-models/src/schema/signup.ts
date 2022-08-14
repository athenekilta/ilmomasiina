import { Static, Type } from '@sinclair/typebox';

import { signupQuestionID } from './question';
import { signupQuotaID, singleSignupQuota } from './quota';

export enum SignupStatus {
  IN_QUOTA = 'in-quota',
  IN_OPEN_QUOTA = 'in-open',
  IN_QUEUE = 'in-queue',
}

export const signupID = Type.String({
  title: 'signup id',
  // TODO: Validation?
});

const signupIdentity = Type.Object({
  id: signupID,
});

export const signupAnswer = Type.Object({
  questionId: signupQuestionID,
  answer: Type.String({
    title: 'answer for the question',
  }),
});

export const signupAnswers = Type.Object({
  answers: Type.Array(
    signupAnswer,
    {
      title: 'Answers to all questions of the event',
    },
  ),
});

export const reducedSignupAnswers = Type.Object({
  answers: Type.Array(
    signupAnswer,
    {
      title: 'Answers to public questions questions of the event',
    },
  ),
});

const firstName = Type.String({
  title: 'First name of the attendee',
});

const lastName = Type.String({
  title: 'Last name of the attendee',
});

const email = Type.String({
  title: 'email of the attendee',
});

const namePublic = Type.Boolean({
  title: 'is the name public',
  description: 'is allowed to show `firstName` and `lastName` publicly',
});

const confirmedAt = Type.Union([
  Type.String({
    title: 'confimation time',
    format: 'date-time',
    description: 'time when the signup details were added (i.e. first update after signup creation)',
  }),
  Type.Null({
    title: 'not confirmed yet',
  }),
], {
  title: 'time when the signup was confirmed',
});

export const editToken = Type.String({
  title: 'edit token',
  description: 'use to make changes to this signup',
});

export const editableSignupAttributes = Type.Object({
  firstName,
  lastName,
  email,
  namePublic,
});

export const reducedEditableSignupAttributes = Type.Object({
  firstName: Type.Union([
    firstName,
    Type.Null({ title: 'not public' }),
  ], {
    title: 'reduced first name of the attendee',
  }),
  lastName: Type.Union([
    firstName,
    Type.Null({ title: 'not public' }),
  ], {
    title: 'reduced last name of the attendee',
  }),
  namePublic,
});

export const userNonEditableSignupAttributes = Type.Object({
  status: Type.Union([
    Type.Enum(SignupStatus, {
      title: 'signup status',
    // TODO: Add description
    }),
    Type.Null({ title: 'signup status not available' }), // TODO: Is it even possible?
  ]),
  position: Type.Union([
    Type.Integer({
      title: 'current position',
    }),
    Type.Null({ title: 'not yet calculated' }), // TODO: Is it even possible?
  ]),
  // Add createdAt manually to support milliseconds
  createdAt: Type.String({
    title: 'signup time',
  }),
});

export const adminNonEditableSignupAttributes = Type.Intersect([
  userNonEditableSignupAttributes,
  Type.Object({
    confirmedAt,
  }),
]);

const signupBooleanConfirmed = Type.Object({
  confirmed: Type.Boolean({ title: 'is the signup confirmed' }),
});

export const signupCreateSchema = Type.Object({
  quotaId: signupQuotaID,
});

export const createdSignupSchema = Type.Object({
  id: signupID,
  editToken,
});

export const signupUpdateSchema = Type.Intersect([
  Type.Partial(editableSignupAttributes),
  Type.Partial(signupAnswers),
]);

export const updatedSignupSchema = Type.Object({
  id: signupID, // TODO: Exclude for users?
  confirmedAt,
});

export const publicSignupSchema = Type.Intersect(
  [
    userNonEditableSignupAttributes,
    reducedEditableSignupAttributes,
    reducedSignupAnswers,
    signupBooleanConfirmed,
  ],
);

export const userSignupSchema = Type.Intersect(
  [
    signupIdentity, // TODO: Exclude for users?
    userNonEditableSignupAttributes,
    Type.Partial(editableSignupAttributes),
    signupAnswers,
    singleSignupQuota,
    signupBooleanConfirmed,
  ],
);

export const adminSignupSchema = Type.Intersect([
  signupIdentity,
  adminNonEditableSignupAttributes,
  Type.Partial(editableSignupAttributes),
  signupAnswers,
]);

export const signupPathParams = Type.Object({
  id: signupID,
});

export type SignupCreateSchema = Static<typeof signupCreateSchema>;
export type CreatedSignupSchema = Static<typeof createdSignupSchema>;
export type SignupUpdateSchema = Static<typeof signupUpdateSchema>;
export type UpdatedSignupSchema = Static<typeof updatedSignupSchema>;
export type PublicSignupSchema = Static<typeof publicSignupSchema>;
export type UserSignupSchema = Static<typeof userSignupSchema>;
export type AdminSignupSchema = Static<typeof adminSignupSchema>;
export type SignupPathParams = Static<typeof signupPathParams>;
