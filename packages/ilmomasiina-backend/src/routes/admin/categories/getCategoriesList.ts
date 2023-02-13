import { FastifyReply, FastifyRequest } from 'fastify';

import type { CategoriesResponse } from '@tietokilta/ilmomasiina-models';
import { Event } from '../../../models/event';

export default async function getCategoriesList(
  request: FastifyRequest,
  response: FastifyReply,
): Promise<CategoriesResponse> {
  const results = await Event.findAll({
    attributes: ['category'],
    group: ['category'],
  });

  const categories = results.map((event) => event.category);

  response.status(200);
  return categories;
}
