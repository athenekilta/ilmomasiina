import { Static, Type } from '@sinclair/typebox';

import { eventID, eventSlug } from '../event/attributes';

export const checkSlugParams = Type.Object({
  slug: eventSlug,
});

export const checkSlugResponse = Type.Object({
  id: Type.Union([
    eventID,
    Type.Null(),
  ]),
  title: Type.Union([
    Type.String(),
    Type.Null(),
  ]),
});

export type CheckSlugParams = Static<typeof checkSlugParams>;
export type CheckSlugResponse = Static<typeof checkSlugResponse>;
