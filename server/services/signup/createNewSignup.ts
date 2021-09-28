import { Forbidden, NotFound } from '@feathersjs/errors';
import moment from 'moment';

import { Event } from '../../models/event';
import { Quota } from '../../models/quota';
import { Signup, SignupStatus } from '../../models/signup';
import { refreshSignupPositionsAndGet } from './computeSignupPosition';
import { generateToken } from './editTokens';

// Expected request schema.
export interface SignupCreateBody {
  quotaId: Quota['id'];
}

// Response schema.
export interface SignupCreateResponse {
  id: Signup['id'];
  position: number | null;
  status: SignupStatus | null;
  quotaId: Quota['id'];
  createdAt: Date;
  editToken: string,
}

const signupsAllowed = (event: Event) => {
  if (event.registrationStartDate === null && event.registrationEndDate === null) {
    return true;
  }

  const now = moment();

  const isOpened = now.isSameOrAfter(moment(event.registrationStartDate));
  const isClosed = now.isAfter(moment(event.registrationEndDate));

  return isOpened && !isClosed;
};

export default async ({ quotaId }: SignupCreateBody): Promise<SignupCreateResponse> => {
  // Find the given quota and event.
  const quota = await Quota.findByPk(quotaId, {
    attributes: [],
    include: [
      {
        model: Event,
        attributes: ['id', 'registrationStartDate', 'registrationEndDate', 'openQuotaSize'],
      },
    ],
  });

  // Do some validation.
  if (quota === null) {
    throw new NotFound('Quota doesn\'t exist.');
  }
  if (!signupsAllowed(quota.event!)) {
    throw new Forbidden('Signups closed for this event.');
  }

  // Create the signup.
  const newSignup = await Signup.create({ quotaId });

  // Add returned information.
  const { id, createdAt } = newSignup;
  const { status, position } = await refreshSignupPositionsAndGet(quota.event!, id);

  const editToken = generateToken(newSignup);

  return {
    id,
    quotaId,
    createdAt,
    position,
    status,
    editToken,
  };
};
