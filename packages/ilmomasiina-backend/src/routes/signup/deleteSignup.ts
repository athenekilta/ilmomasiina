import { Forbidden, NotFound } from '@feathersjs/errors';
import { Params } from '@feathersjs/feathers';

import { Event } from '../../models/event';
import { Quota } from '../../models/quota';
import { Signup } from '../../models/signup';
import { logEvent } from '../../util/auditLog';
import { refreshSignupPositions } from './computeSignupPosition';
import { signupsAllowed } from './createNewSignup';
import { verifyToken } from './editTokens';

type AdminParams = { adminAuthenticated?: boolean };

export default async (id: string, params?: Params & AdminParams): Promise<null> => {
  if (!params?.adminAuthenticated) {
    const editToken = (params as Params)?.query?.editToken;
    verifyToken(id, editToken);
  }

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
  if (!params?.adminAuthenticated && !signupsAllowed(signup.quota!.event!)) {
    throw new Forbidden('Signups closed for this event.');
  }

  // Delete the DB object
  await signup.destroy();

  // Advance the queue and send emails to people that were accepted
  await refreshSignupPositions(signup.quota!.event!);

  await logEvent('signup.delete', { signup, params });

  return null;
};
