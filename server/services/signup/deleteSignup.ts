import { BadRequest, NotFound } from '@feathersjs/errors';
import { Id, Params } from '@feathersjs/feathers';
import moment from 'moment';
import { Model } from 'sequelize';
import EmailService from '../../mail';
import { Event } from '../../models/event';
import { Signup } from '../../models/signup';
import { verifyToken } from './editTokens';

async function advanceQueueAfterDeletion(deletedSignup: Signup) {
  const currentQuota = await deletedSignup.getQuota({
    include: [
      {
        model: Event as typeof Model,
      },
    ],
  })!;
  const event = currentQuota.event!;

  // TODO: fix this, currently doesn't handle open quota correctly
  const { count, rows } = await Signup.findAndCountAll({
    where: { quotaId: currentQuota.id } /* TODO */ as any,
    // Only retrieve the entry that just got accepted from the queue
    limit: 1,
    offset: currentQuota.size + event.openQuotaSize - 1,
  });
  if (count >= currentQuota.size) {
    // There is someone that just got accepted from the queue, inform them
    const promotedFromQueue = rows[0];

    // No need to send email now if they have yet to confirm their signup
    if (promotedFromQueue.confirmedAt === null) {
      return;
    }

    const params = {
      event,
      date: moment(event.date).tz('Europe/Helsinki').format('DD.MM.YYYY HH:mm'),
    };
    EmailService.sendPromotedFromQueueEmail(promotedFromQueue.email!, params);
  }
}

export default async (id: Id, params?: Params): Promise<Signup> => {
  if (!Number.isSafeInteger(id)) {
    throw new BadRequest('Invalid id');
  }

  const editToken = params?.query?.editToken;
  verifyToken(Number(id), editToken);

  const signup = await Signup.findByPk(id);
  if (signup === null) {
    throw new NotFound('No signup found with id');
  }

  // Delete the DB object
  await signup?.destroy();

  // Advance the queue and send emails to people that were accepted
  await advanceQueueAfterDeletion(signup);

  // TODO: ensure that no secret data is actually returned here
  return signup;
};
