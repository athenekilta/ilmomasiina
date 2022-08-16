import { Static, Type } from '@sinclair/typebox';

import { questionID } from '../question';
import { quotaID } from '../quota';

/** Describes the response body for generic error response */
export const errorResponseSchema = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

/** Describes the response body for conflicting event edit action (conflicting updatedAt, quotas or questions) */
export const editConflictError = Type.Intersect([
  errorResponseSchema,
  Type.Object({
    updatedAt: Type.String({
      title: 'last update timestamp',
      description: 'time when the event was last (successfully) modified',
      format: 'date-time',
    }),
    deletedQuotas: Type.Array(quotaID),
    deletedQuestions: Type.Array(questionID),
  }),
]);

/** Describes the response body for conflicting event edit action (would move signups back to queue) */
export const wouldMoveSignupsToQueueError = Type.Intersect([
  errorResponseSchema,
  Type.Object({
    count: Type.Integer({
      title: 'affected signups',
      description: 'the quantity of signups that would be moved back to queue if the edit action is completed',
    }),
  }),
]);

export type ErrorResponseSchema = Static<typeof errorResponseSchema>;
export type EditConflictError = Static<typeof editConflictError>;
export type WouldMoveSignupsToQueueError = Static<typeof wouldMoveSignupsToQueueError>;
