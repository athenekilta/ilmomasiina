import { FastifyReply, FastifyRequest } from 'fastify';

import * as schema from '@tietokilta/ilmomasiina-models/src/schema';
import { Event } from '../../../models/event';

export default async function checkSlugAvailability(
  request: FastifyRequest<{ Params: schema.CheckSlugParams }>,
  response: FastifyReply,
): Promise<schema.CheckSlugResponse> {
  const event = await Event.findOne({
    where: request.params,
    attributes: ['id', 'title'],
  });

  response.status(200);
  return {
    id: event?.id ?? null,
    title: event?.title ?? null,
  };
}
