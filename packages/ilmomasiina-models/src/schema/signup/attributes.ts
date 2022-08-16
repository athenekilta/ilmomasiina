import { Type } from '@sinclair/typebox';

import { SignupStatus } from '../../enum';
import { signupQuestionID } from '../question';
import {
  confirmedAt, editToken, email, firstName, lastName, namePublic,
  signupID,
} from './fields';

export { signupID } from './fields';

export const signupIdentity = Type.Object({
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

export const confirmationTimestamp = Type.Object({
  confirmedAt,
});

export const tokenForEdit = Type.Object({
  editToken,
});

export const adminNonEditableSignupAttributes = Type.Intersect([
  userNonEditableSignupAttributes,
  confirmationTimestamp,
]);
