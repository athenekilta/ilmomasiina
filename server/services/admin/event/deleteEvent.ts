import { BadRequest, NotFound } from '@feathersjs/errors';
import { Event } from '../../../models/event';

export default async (id: number): Promise<null> => {
  if (!Number.isSafeInteger(id)) {
    throw new BadRequest('Invalid id');
  }

  const event = await Event.unscoped().findByPk(id);
  if (event === null) {
    throw new NotFound('No event found with id');
  }

  // Delete the DB object
  await event?.destroy();

  return null;
};
