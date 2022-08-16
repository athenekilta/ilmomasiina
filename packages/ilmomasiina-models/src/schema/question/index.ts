import { Static, Type } from '@sinclair/typebox';

import * as attributes from './attributes';

export const signupQuestionCreate = attributes.questionAttributes;

export const signupQuestionID = Type.String({
  title: 'question ID',
  description: 'provide question ID to edit an existing question',
});

const question = Type.Intersect(
  [
    attributes.questionAttributes,
    attributes.questionIdentity,
  ],
);

const signupQuestionUpdate = Type.Intersect(
  [
    attributes.questionAttributes,
    Type.Partial(attributes.questionIdentity),
  ],
);

export const signupQuestions = Type.Object({
  questions: Type.Array(question, {
    title: 'additional questions',
  }),
});

export const signupQuestionsCreate = Type.Object({
  questions: Type.Array(signupQuestionCreate, {
    title: 'additional questions',
  }),
});

export const signupQuestionsUpdate = Type.Object({
  questions: Type.Array(signupQuestionUpdate, {
    title: 'additional questions',
  }),
});

export type SignupQuestionID = Static<typeof signupQuestionID>;
