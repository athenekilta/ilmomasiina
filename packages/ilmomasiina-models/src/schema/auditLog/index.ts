import { Static, Type } from '@sinclair/typebox';

import * as attributes from './attributes';

/** Describes query params used with audit log query endpoint */
export const auditLoqQuery = Type.Object({
  user: Type.Optional(Type.String({
    title: 'filter events by username',
  })),
  ip: Type.Optional(Type.String({
    title: 'filter events by IP address',
  })),
  action: Type.Optional(
    Type.Array( // TODO: Requires Ajv to be in coerce array mode
      attributes.auditEventAction,
      {
        title: 'filter events by actions',
      },
    ),
  ),
  event: Type.Optional(Type.String({
    title: 'filter events by event name or ID',
  })),
  signup: Type.Optional(Type.String({
    title: 'filter events by signup name or ID',
  })),
  limit: Type.Optional(Type.Integer({
    title: 'maximum amount of log entries to return',
    minimum: 0,
    default: Number.MAX_SAFE_INTEGER, // TODO: Better limits?
  })),
  offset: Type.Optional(Type.Integer({
    title: 'how many (matched) log entries to exclude at the beginning',
    minimum: 0,
    default: 0,
  })),
});

export const auditLogItemSchema = Type.Intersect([
  attributes.auditLogItemAttributes,
  Type.Object({
    createdAt: Type.String({
      format: 'date-time',
      title: 'timestamp for audit event',
    }),
  }),
]);

/** Describes the response body for audit log GET endpoint */
export const auditLogResponse = Type.Object({
  rows: Type.Array(
    auditLogItemSchema,
    {
      title: 'found audit log items',
    },
  ),
  count: Type.Integer({
    title: 'amount of all found rows',
    description: 'also counts those not included in this response due to offset & limit parameters',
  }),
});

export type AuditLoqQuery = Static<typeof auditLoqQuery>;
export type AuditLogItemSchema = Static<typeof auditLogItemSchema>;
export type AuditLogResponse = Static<typeof auditLogResponse>;
