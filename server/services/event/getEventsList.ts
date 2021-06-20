import { col, fn } from 'sequelize';
import _ from 'lodash';
import { Event } from '../../models/event';
import { Quota } from '../../models/quota';
import { Signup } from '../../models/signup';

// Attributes included in GET /api/events for Event instances.
export const eventListEventAttrs = [
  'id',
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
  'draft',
] as const;

export const eventListQuotaAttrs = [
  'title',
  'size',
  'signupCount',
] as const;

// Type definitions for the endpoint: pick the columns above and add relations.

export interface EventListQuotaItem extends Pick<Quota, typeof eventListQuotaAttrs[number]> {
  signupCount: number;
}

export interface EventListItem extends Pick<Event, typeof eventListEventAttrs[number]> {
  // intentionally misnamed to match old API
  quota: EventListQuotaItem[];
}

export type EventListResponse = EventListItem[];

export default async (admin = false): Promise<EventListResponse> => {
  // Admin view also shows draft field.
  const eventAttrs = admin ? adminEventListEventAttrs : eventListEventAttrs;
  // Admin view shows all events, user view only shows future events.
  const scope = admin ? Event.unscoped() : Event;

  const events = await scope.findAll({
    attributes: [...eventAttrs],
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
  });

  // Convert event list to response
  const result: EventListResponse = events.map((event) => ({
    ..._.pick(event, eventAttrs),
    quota: event.quotas!.map((quota) => ({
      ..._.pick(quota, eventListQuotaAttrs),
      signupCount: quota.signupCount!,
    })),
  }));

  return result;
};
