import { Type } from '@sinclair/typebox';

import { SignupStatus } from '../../enum';
import { questionID } from '../question';
import { Nullable } from '../utils';

export const signupID = Type.String({
  title: 'SignupID',
  description: 'Signup ID. Randomly generated alphanumeric string.',
  // TODO: Validation? max-length?
});

export const signupIdentity = Type.Object({
  id: signupID,
});

const namePublic = Type.Boolean({
  description: 'Whether to show `firstName` and `lastName` publicly.',
});

export const editToken = Type.String({
  description: 'Token required for editing or deleting the signup.',
});

/** Answer to a single signup question */
export const signupAnswer = Type.Object({
  questionId: questionID,
  answer: Type.String({
    description: 'Answer to the question.',
  }),
});

/** Editable attributes of a signup. */
export const editableSignupAttributes = Type.Object({
  firstName: Nullable(
    Type.String(),
    { description: 'First name of the attendee. Null if not set yet.' },
  ),
  lastName: Nullable(
    Type.String(),
    { description: 'Last name of the attendee. Null if not set yet.' },
  ),
  email: Nullable(
    Type.String({ format: 'email' }),
    { description: 'Email of the attendee. Null if not set yet.' },
  ),
  namePublic,
  answers: Type.Array(
    signupAnswer,
    { description: 'Answers to the questions of the event.' },
  ),
});

/** Editable attributes of a signup with non-public information removed. */
export const publicEditableSignupAttributes = Type.Object({
  firstName: Nullable(
    Type.String(),
    { description: 'First name of the attendee. Null if not set yet or not public.' },
  ),
  lastName: Nullable(
    Type.String(),
    { description: 'Fast name of the attendee. Null if not set yet or not public.' },
  ),
  namePublic,
  answers: Type.Array(
    signupAnswer,
    { description: 'Answers to the public questions in the event.' },
  ),
});

/** Non-editable, automatically updated signup attributes. */
export const signupDynamicAttributes = Type.Object({
  status: Nullable(
    Type.Enum(SignupStatus, { title: 'SignupStatus' }),
    { description: 'Status of the signup. If null, the status has not been computed yet.' },
  ),
  position: Nullable(
    Type.Integer(),
    { description: 'Position of the signup in its current quota. If null, the status has not been computed yet.' },
  ),
  createdAt: Type.String({
    format: 'date-time',
    description: 'The creation date of the signup.',
  }),
  confirmed: Type.Boolean({
    description: 'Whether the signup has been confirmed (saved).',
  }),
});
