import { FastifyReply, FastifyRequest } from 'fastify';
import { NotFound } from 'http-errors';

import type { SignupForEditResponse, SignupPathParams } from '@tietokilta/ilmomasiina-models';
import { Answer } from '../../models/answer';
import { Event } from '../../models/event';
import { Question } from '../../models/question';
import { Quota } from '../../models/quota';
import { Signup } from '../../models/signup';
import { stringifyDates } from '../utils';

/** Requires editTokenVerification */
export default async function getSignupForEdit(
  request: FastifyRequest<{ Params: SignupPathParams }>,
  reply: FastifyReply,
): Promise<SignupForEditResponse> {
  const signup = await Signup.scope('active').findByPk(request.params.id, {
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
    throw new NotFound('No signup found with given id');
  }

  const event = signup.quota!.event!;

  const response = {
    signup: {
      ...stringifyDates(signup.get({ plain: true })),
      confirmed: Boolean(signup.confirmedAt),
      status: signup.status,
      answers: signup.answers!,
      quota: signup.quota!,
    },
    event: {
      ...stringifyDates(event.get({ plain: true })),
      questions: event.questions!.map((question) => ({
        ...question.get({ plain: true }),
        // Split answer options into array
        options: question.options ? question.options.split(';') : null,
      })),
    },
  };

  reply.status(200);

  return response;
}
