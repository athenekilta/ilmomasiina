import { Static, Type } from '@sinclair/typebox';

export const eventCategory = Type.String({
  title: 'category',
  description: 'used to categorize Events',
});

export const adminListCategoriesResponse = Type.Array(
  eventCategory,
  {
    title: 'Category list',
    description: 'a list of all categories',
  },
);

export type AdminListCategoriesResponse = Static<typeof adminListCategoriesResponse>;
export type EventCategory = Static<typeof eventCategory>;
