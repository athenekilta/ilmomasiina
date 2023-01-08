import { Static, Type } from '@sinclair/typebox';

import { eventID, eventSlug } from '../event/attributes';
import { Nullable } from '../utils';

/** Path parameters necessary to check a slug's availability from the admin API. */
export const checkSlugParams = Type.Object({
  slug: eventSlug,
});

/** Response schema for checking a slug's availability. */
export const checkSlugResponse = Type.Object({
  id: Nullable(
    eventID,
    { description: 'ID of the event with the given slug, or null if none exist.' },
  ),
  title: Nullable(
    Type.String(),
    { description: 'Title of the event with the given slug, or null if none exist.' },
  ),
});

/** Path parameters necessary to check a slug's availability from the admin API. */
export type CheckSlugParams = Static<typeof checkSlugParams>;
/** Response schema for checking a slug's availability. */
export type CheckSlugResponse = Static<typeof checkSlugResponse>;
