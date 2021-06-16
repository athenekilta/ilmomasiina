import _ from 'lodash';
import { Event } from '../../../models/event';
import { Question } from '../../../models/question';
import { Quota } from '../../../models/quota';

// Attributes included in POST /api/events for Event instances.
export const adminEventCreateEventAttrs = [
  'title',
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
  quotas: AdminEventCreateQuota[];
}

export default async (data: AdminEventCreateBody) => {
  // Pick only allowed attributes
  const attribs = {
    ..._.pick(data, adminEventCreateEventAttrs),
    questions: data.questions?.map((question) => _.pick(question, adminEventCreateQuestionAttrs)),
    quotas: data.quotas?.map((quota) => _.pick(quota, adminEventCreateQuotaAttrs)),
  };

  // Create the event with relations - Sequelize will handle validation
  const event = Event.sequelize!.transaction((transaction) => (
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

  return event;
};
