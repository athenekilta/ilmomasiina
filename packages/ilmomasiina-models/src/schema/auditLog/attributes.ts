import { Type } from '@sinclair/typebox';

import { AuditEvent } from '../../enum';

export const auditEventAction = Type.Enum(
  AuditEvent,
  {
    title: 'logged action type',
  },
);

export const auditLogItemAttributes = Type.Object({
  id: Type.Integer({
    title: 'audit log event ID',
  }),
  user: Type.Union([
    Type.String({
      title: 'username',
    }),
    Type.Null({
      title: 'no users related to this log item',
    }),
  ], {
    title: 'user related to this log event',
  }),
  ipAddress: Type.String({
    title: 'IP address of where the request came from',
  }),
  action: auditEventAction,
  eventId: Type.Union([
    Type.String({
      title: 'event ID',
    }),
    Type.Null({
      title: 'no events related to this log item',
    }),
  ], {
    title: 'ID of the event related to this log item',
  }),
  eventName: Type.Union([
    Type.String({
      title: 'event name',
    }),
    Type.Null({
      title: 'no events related to this log item',
    }),
  ], {
    title: 'name of the event related to this log item',
  }),
  signupId: Type.Union([
    Type.String({
      title: 'signup ID',
    }),
    Type.Null({
      title: 'no signups related to this log item',
    }),
  ], {
    title: 'ID of the signup related to this log item',
  }),
  signupName: Type.Union([
    Type.String({
      title: 'signup name',
    }),
    Type.Null({
      title: 'no signups related to this log item',
    }),
  ], {
    title: 'name of the signup related to this log item',
  }),
  extra: Type.String({
    title: 'Additional information',
  }),
});
