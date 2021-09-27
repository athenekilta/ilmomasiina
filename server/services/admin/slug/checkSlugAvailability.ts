import { Event } from '../../../models/event';

export interface AdminCheckSlugResponse {
  id: Event['id'] | null;
  title: string | null;
}

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
