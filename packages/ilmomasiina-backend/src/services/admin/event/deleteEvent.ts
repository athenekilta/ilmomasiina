import { NotFound } from '@feathersjs/errors';

import { Event } from '../../../models/event';

export default async (id: Event['id']): Promise<null> => {
  const event = await Event.findByPk(id);
  if (event === null) {
    throw new NotFound('No event found with id');
  }

  // Delete the DB object
  await event?.destroy();

  return null;
};
