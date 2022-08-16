import { Type } from '@sinclair/typebox';

import { SignupStatus } from '../../enum';
import { questionID } from '../question';
import {
  confirmedAt, editToken, email, firstName, lastName, namePublic,
  signupID,
} from './fields';

export { signupID } from './fields';

/** Unique identifier for signup */
export const signupIdentity = Type.Object({
  id: signupID,
});

/** Answer to a single signup question */
export const signupAnswer = Type.Object({
  questionId: questionID,
  answer: Type.String({
    title: 'answer for the question',
  }),
});

/** Answers to {@link questions} */
export const signupAnswers = Type.Object({
  answers: Type.Array(
    signupAnswer,
    {
      title: 'Answers to all questions of the event',
    },
  ),
});

/** Answers to {@link questions} where non-public answers are removed */
export const reducedSignupAnswers = Type.Object({
  answers: Type.Array(
    signupAnswer,
    {
      title: 'Answers to public questions questions of the event',
    },
  ),
});

/** Signup attributes that are editable via the API */
export const editableSignupAttributes = Type.Object({
  firstName,
  lastName,
  email,
  namePublic,
});

/** Signup Attributes of the {@link editableSignupAttributes} where non-public information is removed */
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

/** Signup attributes that are not directly editable by the user */
export const userNonEditableSignupAttributes = Type.Object({
  status: Type.Union([
    Type.Enum(SignupStatus, {
      title: 'signup status',
    }),
    Type.Null({ title: 'signup status not calculated yet' }),
  ]),
  position: Type.Union([
    Type.Integer({
      title: 'current position',
    }),
    Type.Null({ title: 'position not calculated yet' }),
  ]),
  createdAt: Type.String({
    title: 'signup time',
    description: 'Used to calculate the status and position',
  }),
});

/** Describes a field for confirmedAt */
export const confirmationTimestamp = Type.Object({
  confirmedAt,
});

/** Describes a field for editToken */
export const tokenForEdit = Type.Object({
  editToken,
});

/** Signup attributes that are not directly editable by admins */
export const adminNonEditableSignupAttributes = Type.Intersect([
  userNonEditableSignupAttributes,
  confirmationTimestamp,
]);
