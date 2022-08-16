import { Static, Type } from '@sinclair/typebox';

import * as attributes from './attributes';

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
  limit: Type.Integer({
    title: 'maximum amount of log entries to return',
    minimum: 0,
    default: Number.MAX_SAFE_INTEGER, // TODO: Better limits?
  }),
  offset: Type.Integer({
    title: 'how many (matched) log entries to exclude at the beginning',
    minimum: 0,
    default: 0,
  }),
});

export const auditLogItem = attributes.auditLogItemAttributes;

export const auditLogQueryResponse = Type.Object({
  rows: Type.Array(
    auditLogItem,
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
export type AuditLogItem = Static<typeof auditLogItem>;
export type AuditLogQueryResponse = Static<typeof auditLogQueryResponse>;
