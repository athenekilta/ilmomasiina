import { Static, Type } from '@sinclair/typebox';

import { adminEventListItemSchema, userEventListItemSchema } from '../event';

export const adminEventListSchema = Type.Array(
  adminEventListItemSchema,
  {

  },
);

export const userEventListSchema = Type.Array(
  userEventListItemSchema,
  {

  },
);

export const eventListQuery = Type.Object({
  category: Type.Optional(Type.String({
    title: 'include events only from selected category',
  })),
});

export type UserEventList = Static<typeof userEventListSchema>;
export type AdminEventList = Static<typeof adminEventListSchema>;
export type EventListQuery = Static<typeof eventListQuery>;
