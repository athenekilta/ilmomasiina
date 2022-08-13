import { FastifyReply, FastifyRequest } from 'fastify';

import { AdminEventPathParams } from '@tietokilta/ilmomasiina-models/src/schema';
import { Event } from '../../../models/event';
import { logEvent } from '../../../util/auditLog';

export default async function deleteEvent(
  request: FastifyRequest<{ Params: AdminEventPathParams }>,
  response: FastifyReply,
): Promise<void> {
  const event = await Event.findByPk(request.params.id);
  if (event === null) {
    // TODO: Replace with 404 error
    response.status(404);
    response.send('No event found with id');
  }

  // Delete the DB object
  await event?.destroy();

  if (event) {
    await logEvent('event.delete', { params: request.params, event });
  }

  response.status(200);
}
