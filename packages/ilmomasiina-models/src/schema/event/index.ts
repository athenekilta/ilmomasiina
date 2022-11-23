import { Static, Type } from '@sinclair/typebox';

import {
  questions,
  questionsCreate,
  questionsUpdate,
} from '../question';
import {
  quotasCreate,
  quotasUpdate,
  quotasWithSignupCount,
} from '../quota';
import { signupQuotasWithSignupsForAdmin, signupQuotasWithSignupsForUser } from '../quotaWithSignups';
import {
  adminEventAttributesBasic,
  adminEventAttributesExtended,
  eventExtraInformation,
  eventID,
  eventIdentity,
  eventSlug,
  userEventAttributesBasic,
  userEventAttributesExtended,
} from './attributes';

/** Describes the event used in responses for admins */
export const adminEventSchema = Type.Intersect(
  [
    eventIdentity,
    adminEventAttributesExtended,
    questions,
    signupQuotasWithSignupsForAdmin,
  ],
);

/** Describes the event used in responses for admins when the responses contain multiple events */
export const adminEventListItemSchema = Type.Intersect(
  [
    eventIdentity,
    adminEventAttributesBasic,
    quotasWithSignupCount,
  ],
);

/** Describes the event used in responses for users */
export const userEventSchema = Type.Intersect([
  eventIdentity,
  userEventAttributesExtended,
  questions,
  signupQuotasWithSignupsForUser,
  eventExtraInformation,
], {
  title: 'Full event details for normal users',
  description: 'Contains details for a single event',
});

/** Describes the event used in responses for users when the responses contain multiple events */
export const userEventListItemSchema = Type.Intersect([
  eventIdentity,
  userEventAttributesBasic,
  quotasWithSignupCount,
]);

/** Define response body for successful event edit */
export const eventCreateSchema = Type.Intersect(
  [
    adminEventAttributesExtended,
    questionsCreate,
    quotasCreate,
  ],
);

/** Define request body for editing an existing event */
export const eventEditSchema = Type.Partial(
  Type.Intersect(
    [
      adminEventAttributesExtended,
      questionsUpdate,
      quotasUpdate,
      Type.Object({
        moveSignupsToQueue: Type.Boolean({
          title: 'allow moving signups back to queue',
          description: 'Allow to move signups back queue if necessary to meet updated quotas.',
          default: false,
        }),
      }),
    ],
  ),
);

/** Special form of event to provide all necessary information for user to edit their signup */
export const userEventForSignupSchema = Type.Intersect([
  eventIdentity,
  userEventAttributesExtended,
  questions,
]);

/** Describes path parameters for admin routes */
export const adminEventPathParams = Type.Object({
  id: eventID,
});

/** Describes path parameters for user routes */
export const userEventPathParams = Type.Object({
  slug: eventSlug,
});

export type EventID = Static<typeof eventID>;
export type EventSlug = Static<typeof eventSlug>;
export type EventCreateSchema = Static<typeof eventCreateSchema>;
export type EventEditSchema = Static<typeof eventEditSchema>;
export type AdminEventSchema = Static<typeof adminEventSchema>;
export type UserEventSchema = Static<typeof userEventSchema>;
export type AdminEventPathParams = Static<typeof adminEventPathParams>;
export type UserEventPathParams = Static<typeof userEventPathParams>;
