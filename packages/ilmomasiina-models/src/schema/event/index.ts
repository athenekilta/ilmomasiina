import { Static, Type } from '@sinclair/typebox';

import {
  signupQuestions,
  signupQuestionsCreate,
  signupQuestionsUpdate,
} from '../question';
import {
  signupQuotasCreate, signupQuotasUpdate,
  signupQuotasWithSignupCount,
} from '../quota';
import { signupQuotasWithSignupsForAdmin, signupQuotasWithSignupsForUser } from '../quotaWithSignups';
import {
  adminEventAttributesBasic,
  adminEventAttributesExtended,
  eventExtraInformation,
  eventID,
  eventIdentity,
  eventSlug,
  userEventAttributesBasic, userEventAttributesExtended,
} from './attributes';

export const adminEventSchema = Type.Intersect(
  [
    eventIdentity,
    adminEventAttributesExtended,
    signupQuestions,
    signupQuotasWithSignupsForAdmin,
  ],
);

export const adminEventListItemSchema = Type.Intersect(
  [
    eventIdentity,
    adminEventAttributesBasic,
  ],
);

export const userEventForSignupSchema = Type.Intersect([
  eventIdentity,
  userEventAttributesExtended,
  signupQuestions,
]);

export const userEventSchema = Type.Intersect([
  eventIdentity,
  userEventAttributesExtended,
  signupQuestions,
  signupQuotasWithSignupsForUser,
  eventExtraInformation,
], {
  title: 'Full event details for normal users',
  description: 'Contains details for a single event',
});

export const userEventListItemSchema = Type.Intersect([
  eventIdentity,
  userEventAttributesBasic,
  signupQuotasWithSignupCount,
]);

// Schema used in POST /api/events for Event instances.
export const eventCreateSchema = Type.Intersect(
  [
    adminEventAttributesExtended,
    signupQuestionsCreate,
    signupQuotasCreate,
  ],
);

export const eventEditSchema = Type.Partial(
  Type.Intersect(
    [
      eventIdentity, // TODO: Required (maybe not?)
      adminEventAttributesExtended,
      signupQuestionsUpdate,
      signupQuotasUpdate,
      Type.Object({
        moveSignupsToQueue: Type.Boolean({
          title: 'allow moving signups back to queue', // TODO: Correct interpretation?
          description: 'Allow to move signups back queue if necessary to meet updated quotas.',
          default: false,
        }),
      }),
    ],
  ),
);

export const adminEventPathParams = Type.Object({
  id: eventID,
});

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
