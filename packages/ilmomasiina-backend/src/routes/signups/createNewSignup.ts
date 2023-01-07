import { FastifyReply, FastifyRequest } from 'fastify';
import { Forbidden, NotFound } from 'http-errors';

import type { CreatedSignupSchema, SignupCreateSchema } from '@tietokilta/ilmomasiina-models';
import { Event } from '../../models/event';
import { Quota } from '../../models/quota';
import { Signup } from '../../models/signup';
import { refreshSignupPositions } from './computeSignupPosition';
import { generateToken } from './editTokens';

export const signupsAllowed = (event: Event) => {
  if (event.registrationStartDate === null || event.registrationEndDate === null) {
    return false;
  }

  const now = new Date();
  return now >= event.registrationStartDate && now <= event.registrationEndDate;
};

export default async function createSignup(
  request: FastifyRequest<{ Body: SignupCreateSchema }>,
  response: FastifyReply,
): Promise<CreatedSignupSchema> {
  // Find the given quota and event.
  const quota = await Quota.findByPk(request.body.quotaId, {
    attributes: [],
    include: [
      {
        model: Event.scope('user'),
        attributes: ['id', 'registrationStartDate', 'registrationEndDate', 'openQuotaSize'],
      },
    ],
  });

  // Do some validation.
  if (!quota) {
    throw new NotFound('Quota doesn\'t exist.');
  }

  if (!signupsAllowed(quota.event!)) {
    throw new Forbidden('Signups closed for this event.');
  }

  // Create the signup.
  const newSignup = await Signup.create({ quotaId: request.body.quotaId });
  await refreshSignupPositions(quota.event!);

  const editToken = generateToken(newSignup.id);

  response.status(201);
  return {
    id: newSignup.id,
    editToken,
  };
}
