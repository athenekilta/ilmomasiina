import { FastifyReply, FastifyRequest } from 'fastify';

import type { AdminEventPathParams } from '@tietokilta/ilmomasiina-models';
import { AuditEvent } from '@tietokilta/ilmomasiina-models';
import { Event } from '../../../models/event';

export default async function deleteEvent(
  request: FastifyRequest<{ Params: AdminEventPathParams }>,
  response: FastifyReply,
): Promise<void> {
  const event = await Event.findByPk(request.params.id);
  if (event === null) {
    response.notFound('No event found with id');
    return;
  }

  // Delete the DB object
  await event?.destroy();

  if (event) {
    await request.logEvent(AuditEvent.DELETE_EVENT, { event });
  }

  response.status(204);
}
