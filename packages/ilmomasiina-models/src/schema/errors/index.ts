import { Static, Type } from '@sinclair/typebox';

import { questionID } from '../question';
import { quotaID } from '../quota';

/** Response schema for a generic error. */
export const errorResponse = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

/** Response schema for an edit conflicting with another edit on the server. */
export const editConflictError = Type.Intersect([
  errorResponse,
  Type.Object({
    updatedAt: Type.String({
      format: 'date-time',
      description: 'Last update time of the event on the server.',
    }),
    deletedQuotas: Type.Array(
      quotaID,
      { description: 'IDs of quotas that are already deleted on the server.' },
    ),
    deletedQuestions: Type.Array(
      questionID,
      { description: 'IDs of questions that are already deleted on the server.' },
    ),
  }),
]);

/** Response schema for an edit that would move some signups back to the queue. */
export const wouldMoveSignupsToQueueError = Type.Intersect([
  errorResponse,
  Type.Object({
    count: Type.Integer({
      description: 'Number of signups that would end up back in the queue if the action is executed.',
    }),
  }),
]);

/** Response schema for a generic error. */
export type ErrorResponse = Static<typeof errorResponse>;
/** Response schema for an edit conflicting with another edit on the server. */
export type EditConflictError = Static<typeof editConflictError>;
/** Response schema for an edit that would move some signups back to the queue. */
export type WouldMoveSignupsToQueueError = Static<typeof wouldMoveSignupsToQueueError>;
