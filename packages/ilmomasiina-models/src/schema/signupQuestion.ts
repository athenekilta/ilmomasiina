import { Static, Type } from '@sinclair/typebox';

import { QuestionType } from '../models/question';

export const signupQuestionCreate = Type.Object({
  question: Type.String({
    title: 'question to ask',
  }),
  type: Type.Enum(QuestionType, {
    title: 'question type',
    description: '', // TODO: describe question types here
  }),
  options: Type.Union([
    Type.Array(
      Type.String({
        title: 'selectable option',
      }),
      {
        title: 'selectable options',
        description: 'use this for question `select` questions',
      },
    ),
    Type.Null({
      title: 'no selections',
      description: 'use this for question types other than `select`',
    }),
  ], {
    title: 'question options',
    description: 'when the type is `select`, options defines the selectable items',
  }),
  required: Type.Boolean({
    title: 'require answer to this question',
  }),
  public: Type.Boolean({
    title: 'are the answers for this question public',
  }),
});

export const signupQuestionID = Type.String({
  title: 'question ID',
  description: 'provide question ID to edit an existing question',
});

const signupQuestion = Type.Intersect(
  [
    signupQuestionCreate,
    Type.Object({
      id: signupQuestionID,
    }),
  ],
);

const signupQuestionUpdate = Type.Intersect(
  [
    signupQuestionCreate,
    Type.Object({
      id: Type.Optional(signupQuestionID),
    }),
  ],
);

export const signupQuestions = Type.Object({
  questions: Type.Array(signupQuestion, {
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
