import { NotFound } from '@feathersjs/errors';
import { Params } from '@feathersjs/feathers';

import { Event } from '../../models/event';
import { Quota } from '../../models/quota';
import { Signup } from '../../models/signup';
import { refreshSignupPositions } from './computeSignupPosition';
import { verifyToken } from './editTokens';

type AdminParams = { adminAuthenticated: true };

export default async (id: string, params?: Params | AdminParams): Promise<null> => {
  if (!params?.adminAuthenticated) {
    const editToken = (params as Params)?.query?.editToken;
    verifyToken(id, editToken);
  }

  const signup = await Signup.findByPk(id, {
    include: [
      {
        model: Quota,
        attributes: ['id'],
        include: [
          {
            model: Event.unscoped(),
            attributes: ['id', 'registrationStartDate', 'registrationEndDate', 'openQuotaSize'],
          },
        ],
      },
    ],
  });
  if (signup === null) {
    throw new NotFound('No signup found with id');
  }

  // Delete the DB object
  await signup.destroy();

  // Advance the queue and send emails to people that were accepted
  await refreshSignupPositions(signup.quota!.event!);

  return null;
};
