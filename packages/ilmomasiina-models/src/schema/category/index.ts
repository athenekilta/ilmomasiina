import { Static, Type } from '@sinclair/typebox';

/** Type of an event category. */
export const eventCategory = Type.String({
  description: 'Category tag for events.',
});

/** Response schema for fetching event categories. */
export const categoriesResponse = Type.Array(eventCategory);

/** Type of an event category. */
export type EventCategory = Static<typeof eventCategory>;
/** Response schema for fetching event categories. */
export type CategoriesResponse = Static<typeof categoriesResponse>;
