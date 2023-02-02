import { Type } from '@sinclair/typebox';

import { AuditEvent } from '../../enum';
import { Nullable } from '../utils';

/* eslint-disable import/prefer-default-export */

/** Schema for an audit log item. */
export const auditLogItemAttributes = Type.Object({
  id: Type.Integer({
    title: 'audit log event ID',
  }),
  user: Nullable(
    Type.String(),
    { description: 'Email of the user causing the log event.' },
  ),
  ipAddress: Type.String({
    description: 'IP address causing the log event.',
  }),
  action: Type.Enum(
    AuditEvent,
    {
      title: 'AuditEvent',
      description: 'The type of action logged.',
    },
  ),
  eventId: Nullable(
    Type.String(),
    { description: 'ID of the event related to this log event.' },
  ),
  eventName: Nullable(
    Type.String(),
    { description: 'Title of the event related to this log event.' },
  ),
  signupId: Nullable(
    Type.String(),
    { description: 'ID of the signup related to this log event.' },
  ),
  signupName: Nullable(
    Type.String(),
    { description: 'Name of the signup related to this log event.' },
  ),
  extra: Nullable(
    Type.String(),
    { description: 'Additional information related to this log event as JSON.' },
  ),
  createdAt: Type.String({
    format: 'date-time',
    description: 'Timestamp for the log event.',
  }),
});
