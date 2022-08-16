import { Type } from '@sinclair/typebox';

import { QuestionType } from '../../enum';

/** Unique identifier for question */
export const questionID = Type.String({
  title: 'question ID',
});

/** Non-editable identity attributes of question */
export const questionIdentity = Type.Object({
  id: questionID,
});

/** Editable attributes of question */
export const questionAttributes = Type.Object({
  question: Type.String({
    title: 'question to ask',
  }),
  type: Type.Enum(QuestionType, {
    title: 'question type',
    description: 'describes the type of the question',
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
