import { Static, Type } from '@sinclair/typebox';

import {
  question, questionCreate, questionUpdate,
} from '../question';
import {
  adminQuotaWithSignups, quotaCreate, quotaUpdate, userQuotaWithSignups,
} from '../quota';
import {
  adminFullEventAttributes,
  eventDynamicAttributes,
  eventID,
  eventIdentity,
  eventSlug,
  userFullEventAttributes,
} from './attributes';

/** Response schema for fetching or modifying an event in the admin API. */
export const adminEventResponse = Type.Intersect(
  [
    eventIdentity,
    adminFullEventAttributes,
    Type.Object({
      questions: Type.Array(question),
      quotas: Type.Array(adminQuotaWithSignups),
      updatedAt: Type.String({
        description: 'Last update time of the event. Used for edit conflict handling.',
        format: 'date-time',
      }),
    }),
  ],
);

/** Response schema for fetching an event from the public API. */
export const userEventResponse = Type.Intersect([
  eventIdentity,
  userFullEventAttributes,
  Type.Object({
    questions: Type.Array(question),
    quotas: Type.Array(userQuotaWithSignups),
  }),
  eventDynamicAttributes,
]);

/** Request body for creating an event. */
export const eventCreateBody = Type.Intersect([
  adminFullEventAttributes,
  Type.Object({
    quotas: Type.Array(quotaCreate),
    questions: Type.Array(questionCreate),
  }),
]);

/** Request body for editing an existing event. */
export const eventUpdateBody = Type.Partial(Type.Intersect([
  adminFullEventAttributes,
  Type.Object({
    quotas: Type.Array(quotaUpdate),
    questions: Type.Array(questionUpdate),
    moveSignupsToQueue: Type.Boolean({
      default: false,
      description: 'Whether to allow moving signups to the queue, if caused by quota changes.',
    }),
    updatedAt: Type.String({
      format: 'date-time',
      description: 'Last update time of the event. An edit conflict is detected if this does not match the update '
        + 'date on the server.',
    }),
  }),
]));

/** Response schema when an event is fetched as part of an editable signup. */
export const userEventForSignup = Type.Intersect([
  eventIdentity,
  userFullEventAttributes,
  Type.Object({
    questions: Type.Array(question),
  }),
]);

/** Path parameters necessary to fetch an event from the admin API. */
export const adminEventPathParams = Type.Object({
  id: eventID,
});

/** Path parameters necessary to fetch an event from the public API. */
export const userEventPathParams = Type.Object({
  slug: eventSlug,
});

/** Event ID type. Randomly generated alphanumeric string. */
export type EventID = Static<typeof eventID>;
/** Event slug type. */
export type EventSlug = Static<typeof eventSlug>;

/** Path parameters necessary to fetch an event from the admin API. */
export type AdminEventPathParams = Static<typeof adminEventPathParams>;
/** Path parameters necessary to fetch an event from the public API. */
export type UserEventPathParams = Static<typeof userEventPathParams>;

/** Request body for creating an event. */
export type EventCreateBody = Static<typeof eventCreateBody>;
/** Request body for editing an existing event. */
export type EventUpdateBody = Static<typeof eventUpdateBody>;

/** Response schema for fetching or modifying an event in the admin API. */
export type AdminEventResponse = Static<typeof adminEventResponse>;
/** Response schema for fetching an event from the public API. */
export type UserEventResponse = Static<typeof userEventResponse>;
