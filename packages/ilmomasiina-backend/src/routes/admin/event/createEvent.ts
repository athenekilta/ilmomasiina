import { FastifyReply, FastifyRequest } from 'fastify';

import * as schema from '@tietokilta/ilmomasiina-models/src/schema';
import { Event } from '../../../models/event';
import { Question } from '../../../models/question';
import { Quota } from '../../../models/quota';
import { logEvent } from '../../../util/auditLog';
import { eventDetailsForAdmin } from '../../event/getEventDetails';
import { stringifyDates, toDate } from '../../utils';

export default async function createEvent(
  request: FastifyRequest<{ Body: schema.EventCreateSchema }>,
  response: FastifyReply,
): Promise<schema.AdminEventSchema> {
  // Create the event with relations - Sequelize will handle validation
  const event = await Event.sequelize!.transaction(async (transaction) => {
    const created = await Event.create(
      {
        ...request.body,
        date: toDate(request.body.date),
        endDate: toDate(request.body.endDate),
        registrationStartDate: toDate(request.body.registrationStartDate),
        registrationEndDate: toDate(request.body.registrationEndDate),
      },
      {
        transaction,
        include: [
          {
            model: Question,
            required: false,
          },
          {
            model: Quota,
            required: false,
          },
        ],
      },
    );

    await logEvent('event.create', { event: created, params: request.body, transaction });

    return created;
  });

  const eventDetails = await eventDetailsForAdmin(event.id);

  response.status(201);
  return stringifyDates(eventDetails);
}
