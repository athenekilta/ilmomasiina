import { Static, Type } from '@sinclair/typebox';

import * as attributes from './attributes';

export { questionID } from './attributes';

/** Describes a schema for creating a single question for event */
export const questionCreate = attributes.questionAttributes;

/** Describes a schema for a single question */
const question = Type.Intersect(
  [
    attributes.questionAttributes,
    attributes.questionIdentity,
  ],
);

/** Describes schema for updating question */
const questionUpdateSchema = Type.Intersect(
  [
    attributes.questionAttributes,
    Type.Partial(attributes.questionIdentity, {
      description: 'provide question ID to edit an existing question',
    }),
  ],
);

/** Describes schema questions to be used in response bodies */
export const questions = Type.Object({
  questions: Type.Array(question, {
    title: 'additional questions',
  }),
});

/** Describes schema for creating questions for a single event */
export const questionsCreate = Type.Object({
  questions: Type.Array(questionCreate, {
    title: 'additional questions',
  }),
});

/** Describes schema for updating questions for a single event */
export const questionsUpdate = Type.Object({
  questions: Type.Array(questionUpdateSchema, {
    title: 'additional questions',
  }),
});

export type QuestionID = Static<typeof attributes.questionID>;
