import { Static, Type } from '@sinclair/typebox';

import { eventID, eventSlug } from '../event/attributes';

/** Describes path params for slug usage check endpoint */
export const checkSlugParams = Type.Object({
  slug: eventSlug,
});

/** Describes response body for slug usage check endpoint */
export const checkSlugResponse = Type.Object({
  id: Type.Union([
    eventID,
    Type.Null({
      title: 'no events using this slug',
    }),
  ], {
    title: 'ID of the event',
  }),
  title: Type.Union([
    Type.String({
      title: 'event title',
    }),
    Type.Null({
      title: 'no events using this slug',
    }),
  ], {
    title: 'title of the event',
  }),
});

export type CheckSlugParams = Static<typeof checkSlugParams>;
export type CheckSlugResponse = Static<typeof checkSlugResponse>;
