import { disallow } from 'feathers-hooks-common';
import sequelizeService from 'feathers-sequelize';
import { IlmoService } from '..';
import { IlmoApplication } from '../../defs';
import { Answer } from '../../models/answer';
import { Event } from '../../models/event';
import { Question } from '../../models/question';
import { Quota } from '../../models/quota';
import { Signup } from '../../models/signup';
import addRegistrationOpenStatus from './hooks/addRegistrationOpenStatus';
import eventDetailsFetchOptions from './hooks/eventDetailsFetchOptions';
import eventListFetchOptions from './hooks/eventListFetchOptions';
import removeNonpublicAnswers from './hooks/removeNonpublicAnswers';
import splitAnswerOptionsToArray from './hooks/splitAnswerOptionsToArray';

// Attributes included in results for Event instances.
export const eventServiceEventAttrs = [
  'id',
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

// Attributes included in results for Question instances.
export const eventServiceQuestionAttrs = [
  'id',
  'question',
  'type',
  'options',
  'required',
  'public',
] as const;

// Attributes included in results for QuotaA instances.
export const eventServiceQuotaAttrs = [
  'title',
  'size',
  'id',
] as const;

// Attributes included in results for Signup instances.
export const eventServiceSignupAttrs = [
  'firstName',
  'lastName',
  'createdAt',
] as const;

// Attributes included in results for Answer instances.
export const eventServiceAnswerAttrs = [
  'questionId',
  'answer',
] as const;

// Type definitions for the service: pick the columns above and add associations and attributes added by hooks.

export interface EventServiceQuestionItem extends Omit<Pick<Question, typeof eventServiceQuestionAttrs[number]>, 'options'> {
  options: string | string[];
}

export type EventServiceAnswersItem = Pick<Answer, typeof eventServiceAnswerAttrs[number]>;

export interface EventServiceSignupItem extends Pick<Signup, typeof eventServiceSignupAttrs[number]> {
  answers: EventServiceAnswersItem[];
}

export interface EventServiceQuotaItem extends Pick<Quota, typeof eventServiceQuotaAttrs[number]> {
  signups?: EventServiceSignupItem[] | null;
  signupCount?: number;
}

export interface EventServiceItem extends Pick<Event, typeof eventServiceEventAttrs[number]> {
  questions: EventServiceQuestionItem[];
  quotas: EventServiceQuotaItem[];
  millisTillOpening: number;
  registrationClosed?: boolean;
}

export type EventsService = IlmoService<EventServiceItem>;

export default function (this: IlmoApplication) {
  const app = this;

  const options = {
    Model: app.get('models').event,
  };

  // Initialize our service with any options it requires
  app.use('/api/events', sequelizeService(options));

  // Get our initialize service to that we can bind hooks
  const eventService = app.service('/api/events');

  eventService.hooks({
    before: {
      all: [],
      find: [eventListFetchOptions()],
      get: [eventDetailsFetchOptions()],
      create: [disallow()],
      update: [disallow()],
      patch: [disallow()],
      remove: [disallow()],
    },
    after: {
      all: [],
      find: [],
      get: [removeNonpublicAnswers(), splitAnswerOptionsToArray(), addRegistrationOpenStatus()],
      create: [],
      update: [],
      patch: [],
      remove: [],
    },
  });
}
