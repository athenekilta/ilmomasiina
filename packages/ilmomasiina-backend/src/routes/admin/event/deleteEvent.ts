import { FastifyReply, FastifyRequest } from 'fastify';

import { AdminEventPathParams } from '@tietokilta/ilmomasiina-models/src/schema';
import { AuditEvent } from '@tietokilta/ilmomasiina-models/src/schema/auditLog';
import { Event } from '../../../models/event';

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
    await request.logEvent(AuditEvent.DELETE_EVENT, { event });
  }

  response.status(204);
}
