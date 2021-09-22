import { Event } from '../../../models/event';

export interface AdminCheckSlugResponse {
  id: Event['id'] | null;
  title: string | null;
}

/**
 * @param slugOrId Event id if admin === true, slug if admin === false.
 * @param admin Whether or not to return results for the admin view.
 */
export default async function checkSlugAvailability(slug: string): Promise<AdminCheckSlugResponse> {
  const event = await Event.unscoped().findOne({
    where: {
      slug,
    },
    attributes: ['id', 'title'],
  });
  return {
    id: event?.id ?? null,
    title: event?.title ?? null,
  };
}
