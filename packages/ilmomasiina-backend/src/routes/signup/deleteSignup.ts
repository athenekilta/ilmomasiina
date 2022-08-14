import { FastifyReply, FastifyRequest } from 'fastify';
import { Forbidden, NotFound } from 'http-errors';

import * as schema from '@tietokilta/ilmomasiina-models/src/schema';
import { Event } from '../../models/event';
import { Quota } from '../../models/quota';
import { Signup } from '../../models/signup';
import { logEvent } from '../../util/auditLog';
import { refreshSignupPositions } from './computeSignupPosition';
import { signupsAllowed } from './createNewSignup';

/** Requires admin authentication OR editTokenVerification */
async function deleteSignup(id: string, admin: boolean = false): Promise<void> {
  const signup = await Signup.scope('active').findByPk(id, {
    include: [
      {
        model: Quota,
        attributes: ['id'],
        include: [
          {
            model: Event,
            attributes: ['id', 'title', 'registrationStartDate', 'registrationEndDate', 'openQuotaSize'],
          },
        ],
      },
    ],
  });
  if (signup === null) {
    throw new NotFound('No signup found with id');
  }
  if (!admin && !signupsAllowed(signup.quota!.event!)) {
    throw new Forbidden('Signups closed for this event.');
  }

  // Delete the DB object
  await signup.destroy();

  // Advance the queue and send emails to people that were accepted
  await refreshSignupPositions(signup.quota!.event!);

  // TODO: Improve
  await logEvent('signup.delete', { signup, params: { adminAuthenticated: admin } });
}

// TODO: Require admin authentication
export async function deleteSignupAsAdmin(
  request: FastifyRequest<{ Params: schema.SignupPathParams }>,
  reply: FastifyReply,
): Promise<void> {
  await deleteSignup(request.params.id, true);
  reply.status(204);
}

// TODO: Require editTokenVerification
export async function deleteSignupAsUser(
  request: FastifyRequest<{ Params: schema.SignupPathParams }>,
  reply: FastifyReply,
): Promise<void> {
  await deleteSignup(request.params.id);
  reply.status(204);
}
