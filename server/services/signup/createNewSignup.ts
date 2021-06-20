import { BadRequest, Forbidden, NotFound } from '@feathersjs/errors';
import moment from 'moment';
import { Event } from '../../models/event';
import { Quota } from '../../models/quota';
import { Signup } from '../../models/signup';
import computeSignupPosition from './computeSignupPosition';
import { generateToken } from './editTokens';

// Expected request schema.
export interface SignupCreateBody {
  quotaId: number;
}

export type SignupState = 'in-quota' | 'in-open' | 'in-queue';

// Response schema.
export interface SignupCreateResponse {
  id: number;
  position: number | null;
  status: SignupState | null;
  quotaId: number;
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
  if (!Number.isSafeInteger(quotaId)) {
    throw new BadRequest('Missing quota id.');
  }

  // Find the given quota and event.
  const quota = await Quota.findByPk(quotaId, {
    include: [
      {
        model: Event,
        attributes: ['registrationStartDate', 'registrationEndDate'],
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
  return {
    id: newSignup.id,
    quotaId,
    createdAt: newSignup.createdAt,
    ...await computeSignupPosition(newSignup),
    editToken: generateToken(newSignup),
  };
};
