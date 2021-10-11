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
  'listed',
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

// Attributes included in GET /api/events/ID for Signup instances.
export const eventGetSignupAttrs = [
  'firstName',
  'lastName',
  'status',
  'position',
  'createdAt',
] as const;

// Attributes included in GET /api/admin/events/ID for Signup instances.
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
  signups: EventGetSignupItem[] | null;
  signupCount: number;
}

export interface EventGetResponse extends Pick<Event, typeof eventGetEventAttrs[number]> {
  questions: EventGetQuestionItem[];
  quotas: EventGetQuotaItem[];
  millisTillOpening: number;
  registrationClosed: boolean;
}

// Type definitions for the admin variant of the endpoint.

export type AdminEventGetQuestionItem = EventGetQuestionItem;

export type AdminEventGetAnswerItem = EventGetAnswerItem;

export interface AdminEventGetSignupItem extends Pick<Signup, typeof adminEventGetSignupAttrs[number]> {
  answers: AdminEventGetAnswerItem[];
}

export interface AdminEventGetQuotaItem extends Pick<Quota, typeof eventGetQuotaAttrs[number]> {
  signups: AdminEventGetSignupItem[];
  signupCount: number;
}

export interface AdminEventGetResponse extends Pick<Event, typeof adminEventGetEventAttrs[number]> {
  questions: AdminEventGetQuestionItem[];
  quotas: AdminEventGetQuotaItem[];
}

// Admin queries use ids (so that the slug can be safely edited), user queries use slugs.
type EventGetIdentifier = { id: Event['id'] } | { slug: string };

async function getEventDetails(
  where: EventGetIdentifier, admin: boolean,
): Promise<EventGetResponse | AdminEventGetResponse> {
  // Admin queries include internal data such as confirmation email contents
  const eventAttrs = admin ? adminEventGetEventAttrs : eventGetEventAttrs;
  // Admin queries include emails and signup IDs
  const signupAttrs = admin ? adminEventGetSignupAttrs : eventGetSignupAttrs;
  // Admin queries also show past and draft events.
  const scope = admin ? Event.unscoped() : Event;

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
    order: [
      [Question, 'order', 'ASC'],
      [Quota, 'order', 'ASC'],
      [Quota, Signup, 'createdAt', 'ASC'],
    ],
  });
  if (event === null) {
    // Event not found with id, probably deleted
    throw new NotFound('No event found with id');
  }

  const questions = event.questions!.map((question) => ({
    ..._.pick(question, eventGetQuestionAttrs),
    // Split answer options into array
    options: question.options ? question.options.split(';') : null,
  }));

  // Admins get a simple result with many columns
  if (admin) {
    return {
      ..._.pick(event, adminEventGetEventAttrs),
      questions,

      quotas: event.quotas!.map((quota) => ({
        ..._.pick(quota, eventGetQuotaAttrs),

        signups: quota.signups!.map((signup) => ({
          ..._.pick(signup, adminEventGetSignupAttrs),
          answers: signup.answers!,
        })),
        signupCount: quota.signups!.length,
      })),
    };
  }

  // Only return answers to public questions
  const publicQuestions = new Set(
    event.questions!
      .filter((question) => question.public)
      .map((question) => question.id),
  );

  // Dynamic extra fields
  const startDate = new Date(event.registrationStartDate);
  const now = new Date();
  const millisTillOpening = Math.max(0, startDate.getTime() - now.getTime());

  const endDate = new Date(event.registrationEndDate);
  const registrationClosed = now > endDate;

  return {
    ..._.pick(event, eventGetEventAttrs),
    questions,

    quotas: event.quotas!.map((quota) => {
      // Hide all signups from non-admins if answers are not public
      let signups = null;

      if (event.signupsPublic) {
        signups = quota.signups!.map((signup) => ({
          ..._.pick(signup, eventGetSignupAttrs),
          // Hide answers of non-public questions
          answers: signup.answers!.filter((answer) => publicQuestions.has(answer.questionId)),
        }));
      }

      return {
        ..._.pick(quota, eventGetQuotaAttrs),
        signups,
        signupCount: quota.signups!.length,
      };
    }),

    millisTillOpening,
    registrationClosed,
  };
}

export default function getEventDetailsForUser(slug: string): Promise<EventGetResponse> {
  return getEventDetails({ slug }, false) as Promise<EventGetResponse>;
}

export function getEventDetailsForAdmin(id: Event['id']): Promise<AdminEventGetResponse> {
  return getEventDetails({ id }, true) as Promise<AdminEventGetResponse>;
}
