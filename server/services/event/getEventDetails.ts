import { BadRequest, NotFound } from '@feathersjs/errors';
import { Id } from '@feathersjs/feathers';
import { Model } from 'sequelize';
import _ from 'lodash';
import { Answer } from '../../models/answer';
import { Event } from '../../models/event';
import { Question } from '../../models/question';
import { Quota } from '../../models/quota';
import { Signup } from '../../models/signup';

// Attributes included in results for Event instances.
export const eventGetEventAttrs = [
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
export const eventGetQuestionAttrs = [
  'id',
  'question',
  'type',
  'options',
  'required',
  'public',
] as const;

// Attributes included in results for QuotaA instances.
export const eventGetQuotaAttrs = [
  'title',
  'size',
  'id',
] as const;

// Attributes included in results for Signup instances.
export const eventGetSignupAttrs = [
  'firstName',
  'lastName',
  'createdAt',
] as const;

// Attributes included in results for Answer instances.
export const eventGetAnswerAttrs = [
  'questionId',
  'answer',
] as const;

// Type definitions for the endpoint: pick the columns above and add relations.

export interface EventGetQuestionItem
  extends Omit<Pick<Question, typeof eventGetQuestionAttrs[number]>, 'options'> {
  options: string[] | null;
}

export interface EventGetAnswersItem extends Pick<Answer, typeof eventGetAnswerAttrs[number]> {}

export interface EventGetSignupItem extends Pick<Signup, typeof eventGetSignupAttrs[number]> {
  answers: EventGetAnswersItem[];
}

export interface EventGetQuotaItem extends Pick<Quota, typeof eventGetQuotaAttrs[number]> {
  signups?: EventGetSignupItem[] | null;
  signupCount?: number;
}

export interface EventGetResponse extends Pick<Event, typeof eventGetEventAttrs[number]> {
  questions: EventGetQuestionItem[];
  quotas: EventGetQuotaItem[];
  millisTillOpening?: number;
  registrationClosed?: boolean;
}

export default async (id: Id): Promise<EventGetResponse> => {
  if (!Number.isSafeInteger(id)) {
    throw new BadRequest('Invalid id');
  }

  const event = await Event.findByPk(id, {
    attributes: [...eventGetEventAttrs],
    include: [
      // First include all questions (also non-public for the form)
      {
        model: Question as typeof Model,
        attributes: [...eventGetQuestionAttrs],
      },
      // Include quotas..
      {
        model: Quota as typeof Model,
        attributes: [...eventGetQuotaAttrs],
        // ... and signups of quotas
        include: [
          {
            model: Signup as typeof Model,
            attributes: [...eventGetSignupAttrs],
            required: false,
            // ... and answers of signups
            include: [
              {
                model: Answer as typeof Model,
                attributes: [...eventGetAnswerAttrs],
                required: false,
              },
            ],
          },
        ],
      },
    ],
  });
  if (event === null) {
    // Event not found with id, probably deleted
    throw new NotFound('No event found with id');
  }

  // Convert event to response
  const result: EventGetResponse = {
    ..._.pick(event, eventGetEventAttrs),
    questions: event.questions!.map((question) => ({
      ..._.pick(question, eventGetQuestionAttrs),
      // Split answer options into array
      options: question.options ? question.options.split(';') : null,
    })),
    quotas: event.quotas!.map((quota) => ({
      ..._.pick(quota, eventGetQuotaAttrs),
      signups: quota.signups!.map((signup) => ({
        ..._.pick(signup, eventGetSignupAttrs),
        answers: signup.answers!,
      })),
    })),
  };

  // Hide all signups if answers are not public
  if (!event.signupsPublic) {
    result.quotas.forEach((quota) => {
      quota.signups = null;
    });
  } else {
    // Find IDs of public questions
    const publicQuestions = event.questions!
      .filter((question) => question.public)
      .map((question) => question.id);

    // Hide answers of non-public questions
    result.quotas.forEach((quota) => {
      quota.signups!.forEach((signup) => {
        signup.answers = signup.answers.filter((answer) => publicQuestions.includes(answer.questionId));
      });
    });
  }

  // Add millisTillOpening or registrationClosed if necessary
  const startDate = new Date(result.registrationStartDate);
  const now = new Date();
  const endDate = new Date(result.registrationEndDate);
  if (now > startDate) {
    result.millisTillOpening = 0;
  } else {
    result.millisTillOpening = startDate.getTime() - now.getTime();
  }
  if (now > endDate) {
    result.registrationClosed = true;
  }

  return result;
};
