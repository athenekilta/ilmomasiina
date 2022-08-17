import { FastifyReply, FastifyRequest } from 'fastify';
import { col, fn, Order } from 'sequelize';

import {
  adminEventListEventAttrs,
  eventListEventAttrs,
} from '@tietokilta/ilmomasiina-models/src/attrs/event';
import * as schema from '@tietokilta/ilmomasiina-models/src/schema';
import { Event } from '../../models/event';
import { Quota } from '../../models/quota';
import { Signup } from '../../models/signup';
import { ascNullsFirst } from '../../models/util';
import { stringifyDates } from '../utils';

function eventOrder(): Order {
  return [
    // events without signup (date=NULL) come first
    ['date', ascNullsFirst()],
    ['registrationEndDate', 'ASC'],
    ['title', 'ASC'],
    [Quota, 'order', 'ASC'],
  ];
}

export default async function getEventsListForUser(
  request: FastifyRequest<{ Querystring: schema.EventListQuery }>,
  reply: FastifyReply,
): Promise<schema.UserEventList> {
  const eventAttrs = eventListEventAttrs;
  const filter = { ...request.query };

  const events = await Event.scope('user').findAll({
    attributes: [...eventAttrs],
    where: { listed: true, ...filter },
    // Include quotas of event and count of signups
    include: [
      {
        model: Quota,
        attributes: [
          'id',
          'title',
          'size',
          [fn('COUNT', col('quotas->signups.id')), 'signupCount'],
        ],
        include: [
          {
            model: Signup.scope('active'),
            required: false,
            attributes: [],
          },
        ],
      },
    ],
    group: [col('event.id'), col('quotas.id')],
    order: eventOrder(),
  });

  const res = events.map((event) => ({
    ...stringifyDates(event.get({ plain: true })),
    quotas: event.quotas!.map((quota) => ({
      ...quota.get({ plain: true }),
      signupCount: Number(quota.signupCount!),
    })),
  }));

  reply.status(200);
  return res;
}

export async function getEventsListForAdmin(
  request: FastifyRequest<{ Querystring: schema.EventListQuery }>,
  reply: FastifyReply,
): Promise<schema.AdminEventList> {
  // Admin view also shows id, draft and listed fields.
  const eventAttrs = adminEventListEventAttrs;
  const filter = { ...request.query };

  const events = await Event.findAll({
    attributes: [...eventAttrs],
    where: { ...filter },
    // Include quotas of event and count of signups
    include: [
      {
        model: Quota,
        attributes: [
          'id',
          'title',
          'size',
          [fn('COUNT', col('quotas->signups.id')), 'signupCount'],
        ],
        include: [
          {
            model: Signup.scope('active'),
            required: false,
            attributes: [],
          },
        ],
      },
    ],
    group: [col('event.id'), col('quotas.id')],
    order: eventOrder(),
  });

  const res = events.map((event) => ({
    ...stringifyDates(event.get({ plain: true })),
    quotas: event.quotas!.map((quota) => ({
      ...quota.get({ plain: true }),
      signupCount: Number(quota.signupCount!),
    })),
  }));

  reply.status(200);
  return res;
}
