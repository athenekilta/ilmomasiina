import {
  col, fn, Model, Op,
} from 'sequelize';
import _ from 'lodash';
import moment from 'moment';
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
  quotas: EventListQuotaItem[];
}

export type EventListResponse = EventListItem[];

export default async (): Promise<EventListResponse> => {
  const events = await Event.findAll({
    attributes: [...eventListEventAttrs],
    // Filter out events that are saved as draft
    where: {
      draft: 0,
      date: {
        [Op.gt]: moment().subtract(1, 'days').toDate(),
      },
    },
    // Include quotas of event and count of signups
    include: [
      {
        model: Quota as typeof Model,
        attributes: [
          'title',
          'size',
          [fn('COUNT', col('quota->signups.id')), 'signupCount'],
        ],
        include: [
          {
            model: Signup as typeof Model,
            required: false,
            attributes: [],
          },
        ],
      },
    ],
    group: [col('event.id'), col('quota.id')],
  });

  // Convert event list to response
  const result: EventListResponse = events.map((event) => ({
    ..._.pick(event, eventListEventAttrs),
    quotas: event.quotas!.map((quota) => ({
      ..._.pick(quota, eventListQuotaAttrs),
      signupCount: quota.signupCount!,
    })),
  }));

  return result;
};
