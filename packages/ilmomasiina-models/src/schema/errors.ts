import { Static, Type } from '@sinclair/typebox';

import * as schema from './index';
import { signupQuestionID } from './signupQuestion';
import { signupQuotaID } from './signupQuota';

export const errorResponseSchema = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const editConflictErrorSchema = Type.Intersect([
  errorResponseSchema,
  Type.Object({
    updatedAt: Type.String({
      title: '', // TODO: ???
      format: 'date-time',
    }),
    deletedQuotas: Type.Array(signupQuotaID),
    deletedQuestions: Type.Array(signupQuestionID),
  }),
]);

export const wouldMoveSignupsToQueue = Type.Intersect([
  errorResponseSchema,
  Type.Object({
    count: Type.Integer({
      title: '',
    }),
  }),
]);

export type ErrorResponseSchema = Static<typeof errorResponseSchema>;
export type EditConflictErrorSchema = Static<typeof editConflictErrorSchema>;
export type WouldMoveSignupsToQueue = Static<typeof wouldMoveSignupsToQueue>;
