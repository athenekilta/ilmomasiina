import _ from 'lodash';

import { Event } from '../../../models/event';
import { Question } from '../../../models/question';
import { Quota } from '../../../models/quota';
import { AdminEventGetResponse, getEventDetailsForAdmin } from '../../event/getEventDetails';

// Attributes included in POST /api/events for Event instances.
export const adminEventCreateEventAttrs = [
  'title',
  'slug',
  'date',
  'registrationStartDate',
  'registrationEndDate',
  'openQuotaSize',
  'description',
  'price',
  'location',
  'webpageUrl',
  'facebookUrl',
  'draft',
  'signupsPublic',
  'verificationEmail',
] as const;

// Attributes included in POST /api/events for Question instances.
export const adminEventCreateQuestionAttrs = [
  'question',
  'type',
  'options',
  'required',
  'public',
] as const;

// Attributes included in POST /api/events for Quota instances.
export const adminEventCreateQuotaAttrs = [
  'title',
  'size',
] as const;

// Data type definitions for the request body.
export interface AdminEventCreateQuestion extends Pick<Question, typeof adminEventCreateQuestionAttrs[number]> {}

export interface AdminEventCreateQuota extends Pick<Quota, typeof adminEventCreateQuotaAttrs[number]> {}

export interface AdminEventCreateBody extends Pick<Event, typeof adminEventCreateEventAttrs[number]> {
  questions: AdminEventCreateQuestion[];
  // intentionally misnamed to match old API
  quota: AdminEventCreateQuota[];
}

export default async (data: AdminEventCreateBody): Promise<AdminEventGetResponse> => {
  // Pick only allowed attributes and add order
  const attribs = {
    ..._.pick(data, adminEventCreateEventAttrs),
    questions: data.questions?.map((question, order) => ({
      ..._.pick(question, adminEventCreateQuestionAttrs),
      order,
    })),
    quotas: data.quota?.map((quota, order) => ({
      ..._.pick(quota, adminEventCreateQuotaAttrs),
      order,
    })),
  };

  // Create the event with relations - Sequelize will handle validation
  const event = await Event.sequelize!.transaction((transaction) => (
    Event.create(attribs, {
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
    })
  ));

  return getEventDetailsForAdmin(event.id);
};
