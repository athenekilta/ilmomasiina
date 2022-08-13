import { Static, Type } from '@sinclair/typebox';

import { eventID } from './event';

export const checkSlugParams = Type.Object({
  slug: Type.String(), // TODO: Create own schema for slug
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
