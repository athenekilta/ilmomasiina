import { NotFound } from '@feathersjs/errors';
import _ from 'lodash';

import { Answer } from '../../models/answer';
import { Event } from '../../models/event';
import { Question } from '../../models/question';
import { Quota } from '../../models/quota';
import { Signup } from '../../models/signup';

// Attributes included in GET /api/events/ID for Event instances.
export const eventGetEventAttrs = [
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
  'signupsPublic',
] as const;

// Attributes included in GET /api/admin/events/ID for Event instances.
export const adminEventGetEventAttrs = [
  ...eventGetEventAttrs,
  'id',
  'draft',
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

// Attributes included in results for Quota instances.
export const eventGetQuotaAttrs = [
  'id',
  'title',
  'size',
] as const;

// Attributes included in results for Signup instances.
export const eventGetSignupAttrs = [
  'firstName',
  'lastName',
  'createdAt',
] as const;

// Attributes included in results for Signup instances.
export const adminEventGetSignupAttrs = [
  ...eventGetSignupAttrs,
  'id',
  'email',
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

export interface EventGetAnswerItem extends Pick<Answer, typeof eventGetAnswerAttrs[number]> {}

export interface EventGetSignupItem extends Pick<Signup, typeof eventGetSignupAttrs[number]> {
  answers: EventGetAnswerItem[];
}

export interface EventGetQuotaItem extends Pick<Quota, typeof eventGetQuotaAttrs[number]> {
  signups?: EventGetSignupItem[] | null;
  signupCount?: number;
}

export interface EventGetResponse extends Pick<Event, typeof eventGetEventAttrs[number]> {
  questions: EventGetQuestionItem[];
  // intentionally misnamed to match old API
  quota: EventGetQuotaItem[];
  millisTillOpening?: number;
  registrationClosed?: boolean;
}

// Type definitions for the admin variant of the endpoint.

export type AdminEventGetQuestionItem = EventGetQuestionItem;

export type AdminEventGetAnswerItem = EventGetAnswerItem;

export interface AdminEventGetSignupItem extends Pick<Signup, typeof adminEventGetSignupAttrs[number]> {
  answers: AdminEventGetAnswerItem[];
}

export interface AdminEventGetQuotaItem extends Pick<Quota, typeof eventGetQuotaAttrs[number]> {
  signups?: AdminEventGetSignupItem[] | null;
  signupCount?: number;
}

export interface AdminEventGetResponse extends Pick<Event, typeof adminEventGetEventAttrs[number]> {
  questions: AdminEventGetQuestionItem[];
  // intentionally misnamed to match old API
  quota: AdminEventGetQuotaItem[];
  millisTillOpening?: number;
  registrationClosed?: boolean;
}

export type EventGetResponseType<A extends boolean> = true extends A ? AdminEventGetResponse : EventGetResponse;

/**
 * @param slugOrId Event id if admin === true, slug if admin === false.
 * @param admin Whether or not to return results for the admin view.
 */
export default async function getEventDetails<A extends boolean>(
  slugOrId: string | number, admin: A,
): Promise<EventGetResponseType<A>> {
  // Admin queries include internal data such as confirmation email contents
  const eventAttrs = admin ? adminEventGetEventAttrs : eventGetEventAttrs;
  // Admin queries include emails and signup IDs
  const signupAttrs = admin ? adminEventGetSignupAttrs : eventGetSignupAttrs;
  // Admin queries also show past and draft events.
  const scope = admin ? Event.unscoped() : Event;
  // Admin queries use ids (so that the slug can be safely edited), user queries use slugs.
  const where = admin ? { id: slugOrId } : { slug: slugOrId };

  const event = await scope.findOne({
    where,
    attributes: [...eventAttrs],
    include: [
      // First include all questions (also non-public for the form)
      {
        model: Question,
        attributes: [...eventGetQuestionAttrs],
      },
      // Include quotas..
      {
        model: Quota,
        attributes: [...eventGetQuotaAttrs],
        // ... and signups of quotas
        include: [
          {
            model: Signup,
            attributes: [...signupAttrs],
            required: false,
            // ... and answers of signups
            include: [
              {
                model: Answer,
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
  const result: EventGetResponseType<A> = {
    ..._.pick(event, eventAttrs),
    questions: event.questions!.map((question) => ({
      ..._.pick(question, eventGetQuestionAttrs),
      // Split answer options into array
      options: question.options ? question.options.split(';') : null,
    })),
    quota: event.quotas!.map((quota) => ({
      ..._.pick(quota, eventGetQuotaAttrs),
      signups: quota.signups!.map((signup) => ({
        ..._.pick(signup, signupAttrs),
        answers: signup.answers!,
      })),
    })),
  };

  // Admins get to see all signup data
  if (!admin) {
    // Hide all signups if answers are not public
    if (!event.signupsPublic) {
      result.quota.forEach((quota) => ({
        ...quota,
        signups: null,
      }));
    } else {
      // Find IDs of public questions
      const publicQuestions = _.map(_.filter(event.questions!, 'public'), 'id');

      // Hide answers of non-public questions
      result.quota.forEach((quota) => {
        quota.signups!.forEach((signup) => ({
          ...signup,
          answers: signup.answers.filter((answer) => publicQuestions.includes(answer.questionId)),
        }));
      });
    }
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
}
