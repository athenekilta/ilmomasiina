import { NotFound } from '@feathersjs/errors';
import { Params } from '@feathersjs/feathers';

import { Event } from '../../../models/event';
import { logEvent } from '../../../util/auditLog';

export default async (id: Event['id'], params: Params | undefined): Promise<null> => {
  const event = await Event.findByPk(id);
  if (event === null) {
    throw new NotFound('No event found with id');
  }

  // Delete the DB object
  await event?.destroy();

  if (event) {
    await logEvent('event.delete', { params, event });
  }

  return null;
};
