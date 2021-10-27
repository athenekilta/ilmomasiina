import { NotFound } from '@feathersjs/errors';
import { Params } from '@feathersjs/feathers';
import _ from 'lodash';

import {
  signupGetAnswerAttrs,
  signupGetEventAttrs,
  signupGetQuestionAttrs,
  signupGetQuotaAttrs,
  SignupGetResponse,
  signupGetSignupAttrs,
} from '@tietokilta/ilmomasiina-models/src/services/signups/getForEdit';
import { Answer } from '../../models/answer';
import { Event } from '../../models/event';
import { Question } from '../../models/question';
import { Quota } from '../../models/quota';
import { Signup } from '../../models/signup';
import { verifyToken } from './editTokens';

export default async (id: string, params?: Params): Promise<SignupGetResponse> => {
  const editToken = params?.query?.editToken;
  verifyToken(id, editToken);

  const signup = await Signup.scope('active').findByPk(id, {
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
    order: [[Quota, Event, Question, 'order', 'ASC']],
  });
  if (signup === null) {
    // Event not found with id, probably deleted
    throw new NotFound('No signup found with id');
  }

  const event = signup.quota!.event!;

  return {
    signup: {
      ..._.pick(signup, signupGetSignupAttrs),
      quota: _.pick(signup.quota!, signupGetQuotaAttrs),
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
