import { BadRequest, NotFound } from '@feathersjs/errors';
import { Params } from '@feathersjs/feathers';
import _ from 'lodash';

import { Answer } from '../../models/answer';
import { Event } from '../../models/event';
import { Question } from '../../models/question';
import { Quota } from '../../models/quota';
import { Signup } from '../../models/signup';
import { eventGetEventAttrs, eventGetQuestionAttrs, EventGetQuestionItem } from '../event/getEventDetails';
import { verifyToken } from './editTokens';

// Include the same attributes from Event as /api/events.
const signupGetEventAttrs = eventGetEventAttrs;

const signupGetQuestionAttrs = eventGetQuestionAttrs;

// Attributes included from Answer.
const signupGetAnswerAttrs = [
  'questionId',
  'answer',
] as const;

// Attributes included from Signup.
const signupGetSignupAttrs = [
  'id',
  'firstName',
  'lastName',
  'email',
] as const;

// Data type definitions for this endpoint - pick columns and add included relations

export interface SignupGetAnswerItem extends Pick<Answer, typeof signupGetAnswerAttrs[number]> {}

export interface SignupGetSignupItem extends Pick<Signup, typeof signupGetSignupAttrs[number]> {
  answers: SignupGetAnswerItem[];
}

export type SignupGetQuestionItem = EventGetQuestionItem;

export interface SignupGetEventItem extends Pick<Event, typeof signupGetEventAttrs[number]> {
  questions: SignupGetQuestionItem[];
}

export interface SignupGetResponse {
  signup: SignupGetSignupItem | null;
  event: SignupGetEventItem | null;
}

export default async (id: number, params?: Params): Promise<SignupGetResponse> => {
  if (!Number.isSafeInteger(id)) {
    throw new BadRequest('Invalid id');
  }

  const editToken = params?.query?.editToken;
  verifyToken(Number(id), editToken);

  const signup = await Signup.findByPk(id, {
    include: [
      {
        model: Answer,
        required: false,
      },
      {
        model: Quota,
        include: [
          {
            model: Event,
            include: [
              {
                model: Question,
                required: false,
              },
            ],
          },
        ],
      },
    ],
  });
  if (signup === null) {
    // Event not found with id, probably deleted
    throw new NotFound('No signup found with id');
  }

  const event = signup.quota!.event!;

  return {
    signup: {
      ..._.pick(signup, signupGetSignupAttrs),
      answers: signup.answers!.map((answer) => _.pick(answer, signupGetAnswerAttrs)),
    },
    event: {
      ..._.pick(event, signupGetEventAttrs),
      questions: event.questions!.map((question) => ({
        ..._.pick(question, signupGetQuestionAttrs),
        // Split answer options into array
        options: question.options ? question.options.split(';') : null,
      })),
    },
  };
};
