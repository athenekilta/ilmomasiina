import { Params } from '@feathersjs/feathers';
import _ from 'lodash';
import { col, fn } from 'sequelize';

import {
  adminEventListEventAttrs,
  AdminEventListResponse,
  eventListEventAttrs,
  eventListQuotaAttrs,
  EventListResponse,
} from '@tietokilta/ilmomasiina-models/src/services/events/list';
import { Event } from '../../models/event';
import { Quota } from '../../models/quota';
import { Signup } from '../../models/signup';
import { descNullsFirst } from '../../models/util';

export type EventListResponseType<A extends boolean> = true extends A ? AdminEventListResponse : EventListResponse;

async function getEventsList<A extends boolean>(admin: A, params?: Params): Promise<EventListResponseType<A>> {
  // Admin view also shows id, draft and listed fields.
  const eventAttrs = admin ? adminEventListEventAttrs : eventListEventAttrs;
  // Admin view shows all events, user view only shows future/recent events.
  const scope = admin ? Event : Event.scope('user');
  // Admin view also shows unlisted events.
  const listed = admin ? {} : { listed: true };

  const filter = _.pick(params?.query ?? {}, 'category');

  const events = await scope.findAll({
    attributes: [...eventAttrs],
    where: { ...listed, ...filter },
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
    order: [
      // events without signup (date=NULL) come first
      ['date', descNullsFirst()],
      ['registrationEndDate', 'ASC'],
      ['title', 'ASC'],
      [Quota, 'order', 'ASC'],
    ],
  });

  // Convert event list to response
  const result: EventListResponseType<A> = events.map((event) => ({
    ..._.pick(event, eventAttrs),
    quotas: event.quotas!.map((quota) => ({
      ..._.pick(quota, eventListQuotaAttrs),
      signupCount: Number(quota.signupCount!),
    })),
  }));

  return result;
}

export default function getEventsListForUser(params?: Params) {
  return getEventsList(false, params);
}

export function getEventsListForAdmin(params?: Params) {
  return getEventsList(true, params);
}
