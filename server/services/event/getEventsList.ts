import _ from 'lodash';
import { col, fn } from 'sequelize';

import { Event } from '../../models/event';
import { Quota } from '../../models/quota';
import { Signup } from '../../models/signup';

// Attributes included in GET /api/events for Event instances.
export const eventListEventAttrs = [
  'slug',
  'title',
  'date',
  'registrationStartDate',
  'registrationEndDate',
  'openQuotaSize',
  'signupsPublic',
] as const;

// Attributes included in GET /api/admin/events for Event instances.
const adminEventListEventAttrs = [
  ...eventListEventAttrs,
  'id',
  'draft',
  'listed',
] as const;

export const eventListQuotaAttrs = [
  'id',
  'title',
  'size',
] as const;

// Type definitions for the endpoint: pick the columns above and add relations.

export interface EventListQuotaItem extends Pick<Quota, typeof eventListQuotaAttrs[number]> {
  signupCount: number;
}

export interface EventListItem extends Pick<Event, typeof eventListEventAttrs[number]> {
  quotas: EventListQuotaItem[];
}

export type EventListResponse = EventListItem[];

// Type definitions for the admin variant of the endpoint.

export type AdminEventListQuotaItem = EventListQuotaItem;

export interface AdminEventListItem extends Pick<Event, typeof adminEventListEventAttrs[number]> {
  quotas: AdminEventListQuotaItem[];
}

export type AdminEventListResponse = AdminEventListItem[];

export type EventListResponseType<A extends boolean> = true extends A ? AdminEventListResponse : EventListResponse;

async function getEventsList<A extends boolean>(admin: A): Promise<EventListResponseType<A>> {
  // Admin view also shows id, draft and listed fields.
  const eventAttrs = admin ? adminEventListEventAttrs : eventListEventAttrs;
  // Admin view shows all events, user view only shows future/recent events.
  const scope = admin ? Event.unscoped() : Event;
  // Admin view also shows unlisted events.
  const where = admin ? {} : { listed: true };

  const events = await scope.findAll({
    attributes: [...eventAttrs],
    where,
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
            model: Signup,
            required: false,
            attributes: [],
          },
        ],
      },
    ],
    group: [col('event.id'), col('quotas.id')],
    order: [[Quota, 'order', 'ASC']],
  });

  // Convert event list to response
  const result: EventListResponseType<A> = events.map((event) => ({
    ..._.pick(event, eventAttrs),
    quotas: event.quotas!.map((quota) => ({
      ..._.pick(quota, eventListQuotaAttrs),
      signupCount: quota.signupCount!,
    })),
  }));

  return result;
}

export default function getEventsListForUser() {
  return getEventsList(false);
}

export function getEventsListForAdmin() {
  return getEventsList(true);
}
