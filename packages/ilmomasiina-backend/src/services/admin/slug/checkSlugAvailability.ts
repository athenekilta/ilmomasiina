import { AdminCheckSlugResponse } from '@tietokilta/ilmomasiina-models/src/services/admin/slug/get';
import { Event } from '../../../models/event';

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
