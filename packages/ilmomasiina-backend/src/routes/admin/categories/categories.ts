import { FastifyReply, FastifyRequest } from 'fastify';

import * as schema from '@tietokilta/ilmomasiina-models/src/schema';
import { Event } from '../../../models/event';

export default async function getCategoriesList(
  request: FastifyRequest,
  response: FastifyReply,
): Promise<schema.AdminListCategoriesResponse> {
  const results = await Event.findAll({
    attributes: ['category'],
    group: ['category'],
  });

  const categories = results.map((event) => event.category);

  response.status(200);
  return categories;
}
