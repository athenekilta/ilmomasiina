import { FastifyReply, FastifyRequest } from 'fastify';

import type { CheckSlugParams, CheckSlugResponse } from '@tietokilta/ilmomasiina-models';
import { Event } from '../../../models/event';

export default async function checkSlugAvailability(
  request: FastifyRequest<{ Params: CheckSlugParams }>,
  response: FastifyReply,
): Promise<CheckSlugResponse> {
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
