import { FastifyReply, FastifyRequest } from 'fastify';

import * as schema from '@tietokilta/ilmomasiina-models/src/schema';
import { AuditEvent } from '@tietokilta/ilmomasiina-models/src/schema/auditLog';
import { Event } from '../../../models/event';
import { Question } from '../../../models/question';
import { Quota } from '../../../models/quota';
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
        // @ts-ignore
        questions: request.body.questions ? request.body.questions.map((q, order) => ({
          ...q, options: (q.options && q.options.length) ? q.options.join(';') : null, order,
        })) : [],
        quotas: request.body.quotas ? request.body.quotas.map((q, order) => ({ ...q, order })) : [],
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

    await request.logEvent(AuditEvent.CREATE_EVENT, { event: created, transaction });

    return created;
  });

  const eventDetails = await eventDetailsForAdmin(event.id);

  response.status(201);
  return stringifyDates(eventDetails);
}
