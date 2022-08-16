import { Static, Type } from '@sinclair/typebox';

export const eventCategory = Type.String({
  title: 'category',
  description: 'used to categorize Events',
});

/** Describes the response body for GET categories endpoint */
export const listCategoriesResponse = Type.Array(
  eventCategory,
  {
    title: 'Category list',
    description: 'a list of all categories',
  },
);

export type ListCategoriesResponse = Static<typeof listCategoriesResponse>;
export type EventCategory = Static<typeof eventCategory>;
