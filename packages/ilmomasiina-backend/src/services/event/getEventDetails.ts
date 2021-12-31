import { NotFound } from '@feathersjs/errors';
import _ from 'lodash';

import {
  adminEventGetEventAttrs,
  AdminEventGetResponse,
  adminEventGetSignupAttrs,
  eventGetAnswerAttrs,
  eventGetEventAttrs,
  eventGetQuestionAttrs,
  eventGetQuotaAttrs,
  EventGetResponse,
  eventGetSignupAttrs,
} from '@tietokilta/ilmomasiina-models/src/services/events/details';
import { Answer } from '../../models/answer';
import { Event } from '../../models/event';
import { Question } from '../../models/question';
import { Quota } from '../../models/quota';
import { Signup } from '../../models/signup';

// Admin queries use ids (so that the slug can be safely edited), user queries use slugs.
type EventGetIdentifier = { id: Event['id'] } | { slug: string };

async function getEventDetails(
  where: EventGetIdentifier,
  admin: boolean,
): Promise<EventGetResponse | AdminEventGetResponse> {
  // Admin queries include internal data such as confirmation email contents
  const eventAttrs = admin ? adminEventGetEventAttrs : eventGetEventAttrs;
  // Admin queries include emails and signup IDs
  const signupAttrs = admin ? adminEventGetSignupAttrs : eventGetSignupAttrs;
  // Admin queries also show past and draft events.
  const scope = admin ? Event : Event.scope('user');

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
            model: Signup.scope('active'),
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
  let registrationClosed = true;
  let millisTillOpening = null;

  if (event.registrationStartDate !== null && event.registrationEndDate !== null) {
    const startDate = new Date(event.registrationStartDate);
    const now = new Date();
    millisTillOpening = Math.max(0, startDate.getTime() - now.getTime());

    const endDate = new Date(event.registrationEndDate);
    registrationClosed = now > endDate;
  }

  return {
    ..._.pick(event, eventGetEventAttrs),
    questions,

    quotas: event.quotas!.map((quota) => {
      // Hide all signups from non-admins if answers are not public
      let signups = null;

      if (event.signupsPublic) {
        signups = quota.signups!.map((signup) => ({
          ..._.pick(signup, eventGetSignupAttrs),
          // Hide name if necessary
          firstName: signup.namePublic ? signup.firstName : null,
          lastName: signup.namePublic ? signup.lastName : null,
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
