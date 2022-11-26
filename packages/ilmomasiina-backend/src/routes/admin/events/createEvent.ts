import { FastifyReply, FastifyRequest } from 'fastify';
import { CreationAttributes } from 'sequelize';

import { AuditEvent } from '@tietokilta/ilmomasiina-models/src/enum';
import * as schema from '@tietokilta/ilmomasiina-models/src/schema';
import { Event } from '../../../models/event';
import { Question } from '../../../models/question';
import { Quota } from '../../../models/quota';
import { eventDetailsForAdmin } from '../../events/getEventDetails';
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
        // add order to questions and stringify answer options
        questions: request.body.questions ? request.body.questions.map((q, order) => ({
          ...q,
          order,
          options: (q.options && q.options.length) ? q.options.join(';') : null,
        })) : [],
        // add order to quotas
        quotas: request.body.quotas ? request.body.quotas.map((q, order) => ({ ...q, order })) : [],
        date: toDate(request.body.date),
        endDate: toDate(request.body.endDate),
        registrationStartDate: toDate(request.body.registrationStartDate),
        registrationEndDate: toDate(request.body.registrationEndDate),
      } as CreationAttributes<Event>,
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
