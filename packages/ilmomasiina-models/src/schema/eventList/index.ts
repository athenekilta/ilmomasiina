import { Static, Type } from '@sinclair/typebox';

import { adminEventListItemSchema, userEventListItemSchema } from '../event';

/** Describes request body for sending information about multiple events for admin */
export const adminEventListSchema = Type.Array(
  adminEventListItemSchema,
  {},
);

/** Describes request body for sending information about multiple events for user */
export const userEventListSchema = Type.Array(
  userEventListItemSchema,
  {},
);

/** Describes query parameters for GET events endpoint */
export const eventListQuery = Type.Object({
  category: Type.Optional(Type.String({
    title: 'include events only from selected category',
  })),
});

export type UserEventList = Static<typeof userEventListSchema>;
export type AdminEventList = Static<typeof adminEventListSchema>;
export type EventListQuery = Static<typeof eventListQuery>;
