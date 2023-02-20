import { Type } from '@sinclair/typebox';

import { QuestionType } from '../../enum';
import { Nullable } from '../utils';

export const questionID = Type.String({
  title: 'QuestionID',
  description: 'Question ID. Randomly generated alphanumeric string.',
});

/** Non-editable identity attributes of a question. */
export const questionIdentity = Type.Object({
  id: questionID,
});

/** Editable attributes of a question. */
export const questionAttributes = Type.Object({
  question: Type.String({
    description: 'The question shown to attendees.',
  }),
  type: Type.Enum(QuestionType, {
    title: 'QuestionType',
    description: 'The type of answer expected.',
  }),
  options: Nullable(
    Type.Array(Type.String()),
    { description: 'For select or checkbox questions, the options available.' },
  ),
  required: Type.Boolean({
    description: 'Whether to require an answer to this question from all attendees.',
  }),
  public: Type.Boolean({
    description: 'Whether to show the answers to this question publicly.',
  }),
});
