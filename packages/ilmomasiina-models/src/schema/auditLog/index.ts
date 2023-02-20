import { Static, Type } from '@sinclair/typebox';

import { AuditEvent } from '../../enum';
import { auditLogItemAttributes } from './attributes';

/** Query parameters applicable to the audit log API. */
export const auditLoqQuery = Type.Object({
  user: Type.Optional(Type.String({
    description: 'Filter events by username.',
  })),
  ip: Type.Optional(Type.String({
    description: 'Filter events by IP address.',
  })),
  action: Type.Optional(
    Type.Array( // TODO: Requires Ajv to be in coerce array mode
      Type.Enum(
        AuditEvent,
        { description: 'Filter events by actions.' },
      ),
    ),
  ),
  event: Type.Optional(Type.String({
    description: 'Filter events by event name or ID.',
  })),
  signup: Type.Optional(Type.String({
    description: 'Filter events by signup name or ID.',
  })),
  limit: Type.Optional(Type.Integer({
    minimum: 0,
    default: Number.MAX_SAFE_INTEGER, // TODO: Better limits?
    description: 'Maximum number of log events to return.',
  })),
  offset: Type.Optional(Type.Integer({
    minimum: 0,
    default: 0,
    description: 'Number of log events to skip at the start of results.',
  })),
});

/** Response schema for fetching audit logs. */
export const auditLogResponse = Type.Object({
  rows: Type.Array(auditLogItemAttributes),
  count: Type.Integer({
    description: 'Total number of log events found, including those omitted due to the offset/limit parameters.',
  }),
});

/** Query parameters applicable to the audit log API. */
export type AuditLoqQuery = Static<typeof auditLoqQuery>;
/** Schema for an audit log event. */
export type AuditLogItemSchema = Static<typeof auditLogItemAttributes>;
/** Response schema for fetching a audit logs. */
export type AuditLogResponse = Static<typeof auditLogResponse>;
